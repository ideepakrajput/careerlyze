# CareerLyze - AI-Powered Resume Analysis & Career Optimization Platform

## MCA Major Project Report - Part 5

**Student Details:**

- **Name:** Deepak Kumar
- **University ID:** 024MCA160487
- **Course:** MCA - Al & ML
- **University:** Chandigarh University

---

### **6. Coding & Implementation**

#### **6.1 Module-wise Implementation**

**6.1.1 User Authentication Module**

**Functionality Description:**
The authentication module handles user registration, login, password management, and session management using JWT tokens. It includes secure password hashing, email verification, and password reset functionality with OTP.

**Key Code Implementation:**

**File:** `careerlyze/src/app/api/auth/register/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateToken } from "@/lib/jwt";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password with 12 salt rounds
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(email, firstName);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**File:** `careerlyze/src/app/api/auth/login/route.ts`

```typescript
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**Add Screenshot:** Login page showing the authentication interface

**6.1.2 Resume Upload and Processing Module**

**Functionality Description:**
This module handles secure file uploads, PDF validation, file storage, and integration with Google Gemini AI for resume analysis. It includes file size limits, type validation, and comprehensive error handling.

**Key Code Implementation:**

**File:** `careerlyze/src/app/api/resume-analyze/route.ts`

```typescript
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

    // Save resume record to database
    const resume = new Resume({
      userId: decoded.userId,
      filename: fileName,
      originalName: file.name,
      filePath: filePath,
      fileSize: file.size,
      jobTitle,
      jobDescription,
      status: "processing",
    });

    await resume.save();

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      resumeId: resume._id,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
```

**Add Screenshot:** File upload interface showing drag-and-drop functionality

**6.1.3 AI Analysis Module**

**Functionality Description:**
This module integrates with Google Gemini AI to perform comprehensive resume analysis including ATS scoring, keyword matching, content analysis, and personalized recommendations.

**Key Code Implementation:**

**File:** `careerlyze/src/app/api/resume-analyze/[id]/route.ts`

````typescript
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { verifyToken } from "@/lib/jwt";

// Initialize Google AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Guard rails for structured output
const guardRails = {
  structuredJsonOutput: `
    You must respond with valid JSON only. No markdown formatting, no code blocks, no explanations.
    The JSON must match this exact structure:
    {
      "atsScore": number,
      "summary": "string",
      "strengths": ["string"],
      "improvementAreas": ["string"],
      "keywordMatch": {
        "matched": ["string"],
        "missing": ["string"]
      },
      "recommendations": ["string"],
      "detailedAnalysis": "string",
      "contactInfo": {
        "name": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "linkedin": "string",
        "github": "string",
        "website": "string"
      }
    }
  `,

  jobMatchAnalysis: `
    Analyze this resume against the job description and provide:
    1. ATS compatibility score (0-100)
    2. Keyword matching analysis
    3. Skills gap analysis
    4. Specific improvement recommendations
    5. Contact information extraction
  `,
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Connect to database
    await connectDB();

    // Find resume
    const resume = await Resume.findById(id);
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Check if user owns this resume
    if (resume.userId.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Upload file to Gemini using File API
    const uploadedFile = await ai.files.upload({
      file: resume.filePath,
      config: {
        displayName: resume.originalName,
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

    // Generate AI analysis
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `Analyze this resume for "${resume.jobTitle}" position. Job Description: "${resume.jobDescription}"`,
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

    // Parse JSON response
    let structuredData;
    try {
      let responseText = response.text!;

      // Remove markdown code blocks if present
      responseText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      structuredData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      throw new Error("Failed to parse AI response");
    }

    // Update resume with analysis data
    resume.analysisData = structuredData;
    resume.status = "analyzed";
    await resume.save();

    // Clean up uploaded file from Gemini
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
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze resume. Please try again.",
      },
      { status: 500 }
    );
  }
}
````

**Add Screenshot:** AI analysis results showing detailed scoring and recommendations

**6.1.4 Report Generation Module**

**Functionality Description:**
This module generates comprehensive analysis reports with visual charts, detailed scoring breakdowns, and actionable recommendations for resume improvement.

**Key Code Implementation:**

**File:** `careerlyze/src/app/resume-analysis/[id]/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useAuthState } from "@/hooks/useAuth";

interface AnalysisData {
  atsScore: number;
  summary: string;
  strengths: string[];
  improvementAreas: string[];
  keywordMatch: {
    matched: string[];
    missing: string[];
  };
  recommendations: string[];
  detailedAnalysis: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
}

export default function ResumeAnalysisPage() {
  const params = useParams();
  const { user, isAuthenticated } = useAuthState();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchAnalysisData();
    }
  }, [isAuthenticated, params.id]);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getResumeAnalysis(params.id as string);
      setAnalysisData(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to load analysis");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No analysis data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Analysis Report
          </h1>
          <p className="text-gray-600">
            Comprehensive analysis of your resume with AI-powered insights
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Overall ATS Score
          </h2>
          <div className="flex items-center justify-center">
            <div
              className={`text-6xl font-bold ${getScoreColor(
                analysisData.atsScore
              )}`}
            >
              {analysisData.atsScore}
            </div>
            <div className="ml-4">
              <div className="text-2xl font-semibold text-gray-900">/ 100</div>
              <div className="text-gray-600">ATS Compatibility</div>
            </div>
          </div>
          <div
            className={`mt-4 w-full bg-gray-200 rounded-full h-3 ${getScoreBgColor(
              analysisData.atsScore
            )}`}
          >
            <div
              className={`h-3 rounded-full ${
                analysisData.atsScore >= 80
                  ? "bg-green-500"
                  : analysisData.atsScore >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${analysisData.atsScore}%` }}
            ></div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Summary</h2>
          <p className="text-gray-700 leading-relaxed">
            {analysisData.summary}
          </p>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Strengths
            </h2>
            <ul className="space-y-2">
              {analysisData.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Areas for Improvement
            </h2>
            <ul className="space-y-2">
              {analysisData.improvementAreas.map((area, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">⚠</span>
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Keyword Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Keyword Analysis
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Matched Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.keywordMatch.matched.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.keywordMatch.missing.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Recommendations
          </h2>
          <ul className="space-y-3">
            {analysisData.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">{index + 1}.</span>
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Name:</strong> {analysisData.contactInfo.name}
              </p>
              <p>
                <strong>Email:</strong> {analysisData.contactInfo.email}
              </p>
              <p>
                <strong>Phone:</strong> {analysisData.contactInfo.phone}
              </p>
              <p>
                <strong>Location:</strong> {analysisData.contactInfo.location}
              </p>
            </div>
            <div>
              <p>
                <strong>LinkedIn:</strong> {analysisData.contactInfo.linkedin}
              </p>
              <p>
                <strong>GitHub:</strong> {analysisData.contactInfo.github}
              </p>
              <p>
                <strong>Website:</strong> {analysisData.contactInfo.website}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Detailed Analysis
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {analysisData.detailedAnalysis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Add Screenshot:** Complete analysis report showing all sections and visual elements

**6.1.5 Dashboard Module**

**Functionality Description:**
The dashboard provides users with an overview of their resume analyses, progress tracking, and quick access to all features. It includes analytics, recent activities, and navigation to different sections.

**Key Code Implementation:**

**File:** `careerlyze/src/app/dashboard/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useAuthState } from "@/hooks/useAuth";

interface ResumeAnalysis {
  _id: string;
  originalName: string;
  jobTitle: string;
  analysisData?: {
    atsScore: number;
    summary: string;
    strengths: string[];
    improvementAreas: string[];
  };
  createdAt: string;
  status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthState();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    completedAnalyses: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    } else {
      router.push("/login");
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getResumeAnalyses();
      setAnalyses(response.data);

      // Calculate stats
      const completedAnalyses = response.data.filter(
        (a) => a.status === "analyzed"
      );
      const totalScore = completedAnalyses.reduce(
        (sum, a) => sum + (a.analysisData?.atsScore || 0),
        0
      );

      setStats({
        totalAnalyses: response.data.length,
        averageScore:
          completedAnalyses.length > 0
            ? Math.round(totalScore / completedAnalyses.length)
            : 0,
        completedAnalyses: completedAnalyses.length,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "analyzed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Track your resume optimization progress
              </p>
            </div>
            <button
              onClick={() => router.push("/resume-analyze")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Analyze New Resume
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Analyses
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalAnalyses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p
                  className={`text-2xl font-semibold ${getScoreColor(
                    stats.averageScore
                  )}`}
                >
                  {stats.averageScore}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.completedAnalyses}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Analyses
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {analyses.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No analyses yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by analyzing your first resume.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push("/resume-analyze")}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Analyze Resume
                  </button>
                </div>
              </div>
            ) : (
              analyses.map((analysis) => (
                <div key={analysis._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {analysis.originalName}
                        </h3>
                        <span
                          className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            analysis.status
                          )}`}
                        >
                          {analysis.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Job Title: {analysis.jobTitle}
                      </p>
                      <p className="text-sm text-gray-500">
                        Analyzed on{" "}
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {analysis.analysisData && (
                        <div className="text-right">
                          <p
                            className={`text-2xl font-bold ${getScoreColor(
                              analysis.analysisData.atsScore
                            )}`}
                          >
                            {analysis.analysisData.atsScore}
                          </p>
                          <p className="text-sm text-gray-500">ATS Score</p>
                        </div>
                      )}
                      <button
                        onClick={() =>
                          router.push(`/resume-analysis/${analysis._id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Add Screenshot:** Dashboard showing statistics, recent analyses, and navigation

---

_[End of Part 5 - Coding & Implementation]_
_[Next: Part 6 - Testing and Application Screens]_
