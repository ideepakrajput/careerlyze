import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { verifyToken } from "@/lib/jwt";

export async function GET(
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

    // Await params to get the id
    const { id } = await params;

    // Find the resume and verify ownership
    const resume = await Resume.findOne({
      _id: id,
      userId: decoded.userId,
    }).select("-filePath"); // Exclude file path for security

    if (!resume) {
      return NextResponse.json(
        {
          error: "Resume analysis not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("Get resume analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch resume analysis",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Await params to get the id
    const { id } = await params;

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

    // Delete the file from disk if it exists
    try {
      if (resume.filePath) {
        const { promises: fs } = await import("fs");
        await fs.unlink(resume.filePath);
      }
    } catch (fileError) {
      console.warn("Failed to delete file from disk:", fileError);
    }

    // Delete from database
    await Resume.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Resume analysis deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete resume analysis",
      },
      { status: 500 }
    );
  }
}
