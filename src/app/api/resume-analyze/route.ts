import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import { promises as fs } from "fs";
import path from "path";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

// Configure multer for file upload
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), "uploads"));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Initialize Google AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Configure route to allow longer execution times
// Reduced to 90 seconds to stay under Cloudflare's 100s timeout
// Main response returns immediately, markdown generates in background
export const maxDuration = 90; // 90 seconds (under Cloudflare's 100s limit)
export const runtime = "nodejs";

// Guard rails for structured output
const guardRails = {
  structuredJsonOutput: `Return ONLY valid JSON in this exact format:
  {
    "atsScore": number (0-100),
    "summary": "string",
    "strengths": ["string array"],
    "improvementAreas": ["string array"], 
    "keywordMatch": {
      "matched": ["string array"],
      "missing": ["string array"]
    },
    "recommendations": ["string array"],
    "detailedAnalysis": "markdown string",
    "contactInfo": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "linkedin": "string",
      "github": "string",
      "website": "string"
    }
  }`,
  jobMatchAnalysis: `Analyze resume against job requirements. Focus on keyword matching, experience relevance, and skill alignment. Provide specific, actionable feedback. Extract contact information including name, email, phone, location, LinkedIn profile URL (only the profile URL, not the full linkedin.com/in/...), GitHub profile URL, and website if available.`,
};

// Helper function to run multer
const runMiddleware = (req: NextRequest, res: any) => {
  return new Promise((resolve, reject) => {
    upload.single("file")(req as any, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Helper function to wait for file processing (waits indefinitely until complete)
const waitForFileProcessing = async (
  ai: GoogleGenAI,
  fileName: string,
  checkInterval: number = 2000 // Check every 2 seconds
): Promise<void> => {
  let fileStatus = await ai.files.get({ name: fileName });
  let attempts = 0;
  const maxAttempts = 300; // Maximum 10 minutes (300 * 2 seconds)

  while (fileStatus.state === "PROCESSING") {
    attempts++;
    if (attempts > maxAttempts) {
      throw new Error(
        "File processing is taking too long. Please try again with a smaller file."
      );
    }

    console.log(
      `Waiting for file processing... (attempt ${attempts}/${maxAttempts})`
    );
    await new Promise((resolve) => setTimeout(resolve, checkInterval));
    fileStatus = await ai.files.get({ name: fileName });
  }

  if (fileStatus.state === "FAILED") {
    throw new Error("File processing failed");
  }

  console.log("File processing completed successfully");
};

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;

    // Validation
    if (!file || !jobTitle || !jobDescription) {
      return NextResponse.json(
        {
          error: "Missing required fields: file, jobTitle, jobDescription",
        },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          error: "Only PDF files are allowed",
        },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `resume-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    try {
      console.log("Starting file upload to Gemini...");
      // Upload file to Gemini using File API
      const uploadedFile = await ai.files.upload({
        file: filePath,
        config: {
          displayName: file.name,
          mimeType: "application/pdf",
        },
      });

      // Check if uploadedFile has required properties
      if (!uploadedFile || !uploadedFile.name || !uploadedFile.uri) {
        throw new Error("Uploaded file is missing required properties");
      }

      console.log("File uploaded, waiting for processing...");
      // Wait for file processing (will wait up to 10 minutes)
      await waitForFileProcessing(ai, uploadedFile.name);

      console.log("Generating AI content analysis...");
      // Generate structured response (no timeout - waits until complete)
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            text: `Analyze this resume for "${jobTitle}" position. Job Description: "${jobDescription}"`,
          },
          {
            text: guardRails.structuredJsonOutput,
          },
          {
            text: guardRails.jobMatchAnalysis,
          },
          {
            fileData: {
              mimeType: "application/pdf",
              fileUri: uploadedFile.uri,
            },
          },
        ],
      });

      console.log("AI content generation completed");

      // Parse JSON response - handle markdown code blocks
      let structuredData;
      try {
        let responseText = response.text!;

        // Remove markdown code blocks if present
        if (responseText.includes("```json")) {
          responseText = responseText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "");
        }

        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          responseText = jsonMatch[0];
        }

        structuredData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Response text:", response.text);

        // Fallback if JSON parsing fails
        structuredData = {
          atsScore: 0,
          summary: response.text,
          strengths: [],
          improvementAreas: ["Failed to parse structured response"],
          keywordMatch: {
            matched: [],
            missing: [],
          },
          recommendations: ["Please try again with a different resume"],
          detailedAnalysis: response.text,
          contactInfo: {
            name: "",
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            github: "",
            website: "",
          },
        };
      }

      // Connect to database and save analysis
      await connectDB();

      const resume = new Resume({
        userId: decoded.userId,
        fileName: fileName,
        filePath: filePath,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        jobTitle,
        jobDescription,
        analysisData: structuredData,
      });

      await resume.save();

      console.log("Resume saved with ID:", resume._id);
      console.log("Resume LinkedIn:", structuredData.contactInfo?.linkedin);

      // Return response immediately to avoid Cloudflare timeout
      // Markdown generation will happen in background
      const apiResponse = NextResponse.json({
        success: true,
        data: structuredData,
        resumeId: resume._id,
        markdownGenerating: false, // Will be true if markdown generation starts
      });

      // Generate markdown asynchronously in background (non-blocking)
      // This prevents Cloudflare timeout while still generating markdown
      (async () => {
        try {
          const user = await User.findById(decoded.userId);
          const ALLOWED_EMAILS = ["contact.deepakrajput@gmail.com"];

          if (!user || !ALLOWED_EMAILS.includes(user.email)) {
            // Clean up file immediately if user doesn't have access
            try {
              if (uploadedFile && uploadedFile.name) {
                await ai.files.delete({ name: uploadedFile.name });
                console.log("Cleaned up uploaded file from Gemini");
              }
            } catch (deleteError) {
              console.warn("Failed to delete file from Gemini:", deleteError);
            }
            return;
          }

          console.log("Generating updated resume markdown in background...");

          // Read the original resume.md file
          const resumeMdPath = path.join(process.cwd(), "public", "resume.md");
          let originalResumeMarkdown = "";
          try {
            originalResumeMarkdown = await fs.readFile(resumeMdPath, "utf-8");
          } catch (readError) {
            console.warn("Could not read resume.md file:", readError);
            // Continue without the original resume if file doesn't exist
          }

          // Generate updated resume markdown using AI
          const resumeMarkdownPrompt = `You are tasked with updating an existing resume in markdown format based on the resume analysis and job requirements.

ORIGINAL RESUME (resume.md):
${
  originalResumeMarkdown
    ? "```markdown\n" + originalResumeMarkdown + "\n```"
    : "No original resume provided. Generate a new resume."
}

JOB REQUIREMENTS:
Job Title: "${jobTitle}"
Job Description: ${jobDescription}

RESUME ANALYSIS DATA:
- ATS Score: ${structuredData.atsScore}/100
- Strengths: ${
            structuredData.strengths.length > 0
              ? structuredData.strengths.join(", ")
              : "None identified"
          }
- Improvement Areas: ${
            structuredData.improvementAreas.length > 0
              ? structuredData.improvementAreas.join(", ")
              : "None identified"
          }
- Matched Keywords: ${
            structuredData.keywordMatch.matched.length > 0
              ? structuredData.keywordMatch.matched.join(", ")
              : "None"
          }
- Missing Keywords: ${
            structuredData.keywordMatch.missing.length > 0
              ? structuredData.keywordMatch.missing.join(", ")
              : "None"
          }
- Recommendations: ${
            structuredData.recommendations.length > 0
              ? structuredData.recommendations.join("; ")
              : "None"
          }

CONTACT INFORMATION (use this if different from original):
- Name: ${structuredData.contactInfo.name || "Keep original"}
- Email: ${structuredData.contactInfo.email || "Keep original"}
- Phone: ${structuredData.contactInfo.phone || "Keep original"}
- Location: ${structuredData.contactInfo.location || "Keep original"}
- LinkedIn: ${structuredData.contactInfo.linkedin || "Keep original"}
- GitHub: ${structuredData.contactInfo.github || "Keep original"}
- Website: ${structuredData.contactInfo.website || "Keep original"}

TASK:
Update the original resume.md according to the analysisData. Your updated resume should:
1. Keep the same structure and format as the original resume
2. Incorporate missing keywords naturally into existing sections
3. Enhance strengths that are relevant to the job
4. Address improvement areas by refining content
5. Optimize bullet points and descriptions for the specific job title and description
6. Maintain all original information unless it conflicts with improvements
7. Use the contact information from analysisData if provided, otherwise keep original
8. Ensure the resume is ATS-optimized while maintaining readability

Return ONLY the updated markdown content, no explanations or code blocks. The output should be a complete, well-formatted resume in markdown.`;

          // Check if uploadedFile and uri exist before using
          if (!uploadedFile || !uploadedFile.uri) {
            throw new Error("Uploaded file or URI is missing");
          }

          const markdownResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                text: resumeMarkdownPrompt,
              },
              {
                fileData: {
                  mimeType: "application/pdf",
                  fileUri: uploadedFile.uri,
                },
              },
            ],
          });

          let updatedResumeMarkdown = markdownResponse.text || "";

          // Clean up markdown if wrapped in code blocks
          if (updatedResumeMarkdown.includes("```")) {
            updatedResumeMarkdown = updatedResumeMarkdown
              .replace(/```markdown\n?/g, "")
              .replace(/```\n?/g, "")
              .trim();
          }

          // Update resume with markdown
          await connectDB();
          const updatedResume = await Resume.findById(resume._id);
          if (updatedResume) {
            updatedResume.analysisData.updatedResume = updatedResumeMarkdown;
            await updatedResume.save();
            console.log("Updated resume markdown generated and saved");
          }
        } catch (markdownError) {
          console.error(
            "Error generating updated resume markdown:",
            markdownError
          );
          // Continue even if markdown generation fails
        } finally {
          // Clean up uploaded file from Gemini after markdown generation (or if it fails)
          try {
            if (uploadedFile && uploadedFile.name) {
              await ai.files.delete({ name: uploadedFile.name });
              console.log("Cleaned up uploaded file from Gemini");
            }
          } catch (deleteError) {
            console.warn("Failed to delete file from Gemini:", deleteError);
          }
        }
      })();

      // Return response immediately (before markdown generation completes)
      console.log(
        "Returning response immediately, markdown generating in background"
      );
      return apiResponse;
    } catch (aiError: any) {
      console.error("AI processing error:", aiError);
      return NextResponse.json(
        {
          error: "Failed to analyze resume. Please try again.",
        },
        { status: 500 }
      );
    } finally {
      // Keep local file for PDF viewing - don't delete
      // The file will be served by the PDF API endpoint
    }
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Get user's resume analyses
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const resumes = await Resume.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .select("-filePath"); // Exclude file path for security

    return NextResponse.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch resumes",
      },
      { status: 500 }
    );
  }
}
