import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Check if user has access to this feature
    const user = await User.findById(decoded.userId);
    const ALLOWED_EMAILS = ["contact.deepakrajput@gmail.com"];

    if (!user || !ALLOWED_EMAILS.includes(user.email)) {
      return NextResponse.json(
        { error: "Access denied. This feature is not available for your account." },
        { status: 403 }
      );
    }

    // Await params to get the id
    const { id } = await params;

    // Parse request body
    const body = await req.json();
    const { updatedResume } = body;

    if (!updatedResume || typeof updatedResume !== "string") {
      return NextResponse.json(
        { error: "updatedResume is required and must be a string" },
        { status: 400 }
      );
    }

    // Find the resume and verify ownership
    const resume = await Resume.findOne({
      _id: id,
      userId: decoded.userId,
    });

    if (!resume) {
      return NextResponse.json(
        {
          error: "Resume analysis not found",
        },
        { status: 404 }
      );
    }

    // Update the markdown
    resume.analysisData.updatedResume = updatedResume;
    await resume.save();

    return NextResponse.json({
      success: true,
      message: "Resume markdown updated successfully",
      data: {
        _id: resume._id,
        updatedResume: resume.analysisData.updatedResume,
      },
    });
  } catch (error) {
    console.error("Update markdown error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

