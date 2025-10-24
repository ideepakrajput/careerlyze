import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Careerlyze - AI-Powered Resume Evaluation & Job Fit System",
  description:
    "Smart AI assistant that evaluates resumes, provides ATS compatibility scores, and recommends improvements for better job shortlisting chances.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
