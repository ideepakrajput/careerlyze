import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const mailOptions = {
      from: `Careerlyze <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error };
  }
};

export const sendOTPEmail = async (
  email: string,
  otp: string,
  firstName: string
) => {
  const subject = "Password Reset OTP - Careerlyze";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Careerlyze</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">AI-Powered Resume Evaluation</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Hello ${firstName},
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
          We received a request to reset your password. Use the OTP below to reset your password:
        </p>
        
        <div style="background: #1e293b; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">Your OTP Code</p>
          <h1 style="margin: 10px 0 0 0; font-size: 32px; letter-spacing: 4px; font-weight: bold;">${otp}</h1>
        </div>
        
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
          <strong>Important:</strong>
        </p>
        <ul style="color: #475569; font-size: 14px; line-height: 1.6; margin: 10px 0 0 0; padding-left: 20px;">
          <li>This OTP is valid for 10 minutes only</li>
          <li>Do not share this OTP with anyone</li>
          <li>If you didn't request this, please ignore this email</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Careerlyze. All rights reserved.
        </p>
        <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">
          This email was sent to ${email}
        </p>
        <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">
          Developed by <a href="https://ideepakrajput.in" style="color: #3b82f6;">ideepakrajput.in</a> | 
          <a href="https://github.com/ideepakrajput/careerlyze" style="color: #3b82f6;">GitHub Repository</a>
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject,
    html,
  });
};

export const sendWelcomeEmail = async (email: string, firstName: string) => {
  const subject = "Welcome to Careerlyze - Your AI-Powered Career Assistant";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Careerlyze!</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">AI-Powered Resume Evaluation</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Hello ${firstName}! 👋</h2>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Welcome to Careerlyze! We're excited to help you optimize your resume and advance your career.
        </p>
        
        <div style="background: #3b82f6; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <h3 style="margin: 0 0 10px 0; font-size: 20px;">Get Started Now</h3>
          <p style="margin: 0; font-size: 16px;">Upload your resume and get instant AI-powered analysis</p>
        </div>
        
        <h3 style="color: #1e293b; margin: 30px 0 15px 0; font-size: 18px;">What you can do with Careerlyze:</h3>
        <ul style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
          <li>Get ATS compatibility scores</li>
          <li>Receive personalized recommendations</li>
          <li>Optimize keywords for better visibility</li>
          <li>Match your resume with job descriptions</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Careerlyze. All rights reserved.
        </p>
        <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">
          Developed by <a href="https://ideepakrajput.in" style="color: #3b82f6;">ideepakrajput.in</a> | 
          <a href="https://github.com/ideepakrajput/careerlyze" style="color: #3b82f6;">GitHub Repository</a>
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject,
    html,
  });
};
