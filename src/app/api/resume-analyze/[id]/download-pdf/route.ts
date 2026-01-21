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
    let htmlContent = marked.parse(resume.analysisData.updatedResume);

    // Handle if marked.parse returns a Promise
    if (htmlContent instanceof Promise) {
      htmlContent = await htmlContent;
    }

    // Ensure htmlContent is a string
    htmlContent = String(htmlContent);

    // Get name from contact info for filename
    const contactName = resume.analysisData?.contactInfo?.name || "Resume";

    // Remove hr tags after sections (lines after end of sections)
    htmlContent = htmlContent.replace(/<hr[^>]*>\s*(?=<h[1-3]|$)/gi, '');

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
            margin: 0.5in 0.6in;
            size: A4;
        }
        body {
            font-family: "Calibri", "Roboto", "Segoe UI", "Arial", sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            text-align: justify;
        }
        h1 {
            font-size: 24pt;
            font-weight: 700;
            margin-bottom: 4px;
            margin-top: 0;
            color: #000;
            line-height: 1.2;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
        }
        h1 + p {
            text-align: center;
            margin-bottom: 16px;
            font-size: 10pt;
            color: #444;
        }
        h2 {
            font-size: 12pt;
            font-weight: 700;
            margin-top: 16px;
            margin-bottom: 8px;
            border-bottom: 1px solid #777;
            padding-bottom: 2px;
            line-height: 1.2;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #2c5282;
        }
        hr {
            border: none;
            border-top: 1px solid #e0e0e0;
            margin: 8px 0;
        }
        h3 {
            font-size: 11pt;
            font-weight: 700;
            margin-top: 10px;
            margin-bottom: 4px;
            line-height: 1.2;
            color: #000;
        }
        h4 {
             font-size: 11pt;
             font-weight: 600;
             font-style: italic;
             margin-top: 8px;
             margin-bottom: 2px;
        }
        p {
            font-size: 11pt;
            margin: 4px 0;
            line-height: 1.5;
            text-align: justify;
            hyphens: auto;
        }
        ul, ol {
            margin: 4px 0;
            padding-left: 20px;
            line-height: 1.5;
        }
        li {
            font-size: 11pt;
            margin: 3px 0;
            line-height: 1.5;
            text-align: justify;
        }
        strong {
            font-weight: 700;
            color: #000;
        }
        a {
            color: #2b6cb0;
            text-decoration: none;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        td {
            padding: 4px;
            vertical-align: top;
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
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
        ],
        ignoreDefaultArgs: ['--disable-extensions'],
      });

      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

      // Generate PDF with A4 size
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '0.75in',
          right: '0.75in',
          bottom: '0.75in',
          left: '0.75in',
        },
        printBackground: true,
      });

      await browser.close();

      // Return PDF file - Format: "Deepak Kumar - Job title.pdf" (no trailing underscore)
      const sanitizedName = contactName.replace(/[^a-z0-9\s-]/gi, '').trim();
      const sanitizedJobTitle = resume.jobTitle.replace(/[^a-z0-9\s-]/gi, '').trim();
      const filename = `${sanitizedName} - ${sanitizedJobTitle}.pdf`;

      // Convert buffer to ensure proper type for NextResponse
      const buffer = Buffer.from(pdfBuffer);

      // Encode filename properly for Content-Disposition header
      const encodedFilename = encodeURIComponent(filename);

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
          "Cache-Control": "no-cache",
        },
      });
    } catch (pdfError: any) {
      console.error("PDF generation error:", pdfError);
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error("Error closing browser:", closeError);
        }
      }

      // Check if it's a library dependency error
      const errorMessage = pdfError?.message || String(pdfError);
      if (errorMessage.includes("shared libraries") || errorMessage.includes("libatk")) {
        return NextResponse.json(
          {
            error: "PDF generation failed due to missing system dependencies. Please install required libraries: apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to generate PDF. Please try again.",
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
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

