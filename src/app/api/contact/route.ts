import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Create HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Careerlyze</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">New Contact Form Submission</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Contact Form Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Sender Information</h3>
            <p style="margin: 5px 0; color: #475569;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></p>
            <p style="margin: 5px 0; color: #475569;"><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Message</h3>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #475569; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Careerlyze. All rights reserved.
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">
            This email was sent from the Careerlyze contact form
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">
            Developed by <a href="https://ideepakrajput.in" style="color: #3b82f6;">ideepakrajput.in</a> | 
            <a href="https://github.com/ideepakrajput/careerlyze" style="color: #3b82f6;">GitHub Repository</a>
          </p>
        </div>
      </div>
    `;

    // Create plain text version
    const textContent = `
Careerlyze - New Contact Form Submission

Sender Information:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from the Careerlyze contact form
Developed by ideepakrajput.in
    `;

    // Send email
    const mailOptions = {
      from: `Careerlyze Contact Form <${process.env.GMAIL_USER}>`,
      to: "careerlyze@ideepakrajput.in",
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
      text: textContent,
      replyTo: email, // Allow direct reply to sender
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to sender
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Careerlyze</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Message Received</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Thank You for Contacting Us!</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Hello ${name},
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            We have received your message regarding "<strong>${subject}</strong>" and will get back to you as soon as possible.
          </p>
          
          <div style="background: #3b82f6; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px;">What's Next?</h3>
            <p style="margin: 0; font-size: 16px;">Our team will review your message and respond within 24 hours</p>
          </div>
          
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
            <strong>Your Message:</strong><br>
            <em>${message}</em>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Careerlyze. All rights reserved.
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">
            This is an automated confirmation email
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">
            Developed by <a href="https://ideepakrajput.in" style="color: #3b82f6;">ideepakrajput.in</a> | 
            <a href="https://github.com/ideepakrajput/careerlyze" style="color: #3b82f6;">GitHub Repository</a>
          </p>
        </div>
      </div>
    `;

    const confirmationMailOptions = {
      from: `Careerlyze <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting Careerlyze",
      html: confirmationHtml,
    };

    await transporter.sendMail(confirmationMailOptions);

    return NextResponse.json(
      {
        message: "Message sent successfully! We'll get back to you soon.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
