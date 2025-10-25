import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import { promises as fs } from "fs";
import path from "path";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
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
  jobMatchAnalysis: `Analyze resume against job requirements. Focus on keyword matching, experience relevance, and skill alignment. Provide specific, actionable feedback. Extract contact information including name, email, phone, location, LinkedIn, GitHub, and website if available.`,
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
      // Upload file to Gemini using File API
      const uploadedFile = await ai.files.upload({
        file: filePath,
        config: {
          displayName: file.name,
          mimeType: "application/pdf",
        },
      });

      // Wait for file processing
      let fileStatus = await ai.files.get({ name: uploadedFile.name! });
      while (fileStatus.state === "PROCESSING") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        fileStatus = await ai.files.get({ name: uploadedFile.name! });
      }

      if (fileStatus.state === "FAILED") {
        throw new Error("File processing failed");
      }

      // Generate structured response
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
              fileUri: uploadedFile.uri!,
            },
          },
        ],
      });

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

      // Clean up uploaded file from Gemini (optional)
      try {
        await ai.files.delete({ name: uploadedFile.name! });
      } catch (deleteError) {
        console.warn("Failed to delete file from Gemini:", deleteError);
      }

      return NextResponse.json({
        success: true,
        data: structuredData,
        resumeId: resume._id,
      });
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
