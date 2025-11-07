import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import puppeteer from "puppeteer";
import { marked } from "marked";

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

    // Check if updatedResume exists
    if (!resume.analysisData?.updatedResume) {
      return NextResponse.json(
        {
          error: "Updated resume markdown not found. Please analyze the resume first.",
        },
        { status: 404 }
      );
    }

    // Convert markdown to HTML
    const htmlContent = marked.parse(resume.analysisData.updatedResume);

    // Create a complete HTML document with styling
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${resume.jobTitle}</title>
    <style>
        @page {
            margin: 1in;
            size: letter;
        }
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 10px;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
        }
        h2 {
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #666;
            padding-bottom: 3px;
        }
        h3 {
            font-size: 16px;
            margin-top: 15px;
            margin-bottom: 8px;
        }
        p {
            margin: 8px 0;
        }
        ul, ol {
            margin: 10px 0;
            padding-left: 25px;
        }
        li {
            margin: 5px 0;
        }
        strong {
            font-weight: bold;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        hr {
            border: none;
            border-top: 1px solid #ccc;
            margin: 20px 0;
        }
        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>
    `;

    // Launch Puppeteer and generate PDF
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'Letter',
        margin: {
          top: '1in',
          right: '1in',
          bottom: '1in',
          left: '1in',
        },
        printBackground: true,
      });

      await browser.close();

      // Return PDF file
      const filename = `updated-resume-${resume.jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${id}.pdf`;

      // Convert buffer to ensure proper type for NextResponse
      const buffer = Buffer.from(pdfBuffer);

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-cache",
        },
      });
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
      if (browser) {
        await browser.close();
      }
      return NextResponse.json(
        {
          error: "Failed to generate PDF. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Download PDF error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

