import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  BarChart3,
  Search,
  Lightbulb,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Github,
  ExternalLink,
  Users,
  Shield,
  Scale,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4 bg-white rounded-full">
              <Image
                src="/logo.png"
                alt="Careerlyze Logo"
                width={70}
                height={70}
                className="mr-2 mix-blend-multiply"
              />
              <span className="text-xl font-bold text-center justify-center">
                <span className="text-blue-400">Career</span>
                <span className="text-green-400">lyze</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered Job Success
            </p>
            <p className="text-gray-400 text-sm">
              Transform your career with intelligent resume analysis and job
              matching. Developed by{" "}
              <a
                href="https://ideepakrajput.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                ideepakrajput.in
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/features"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Resume Analysis
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  ATS Scoring
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Job Matching
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Recommendations
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal & Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Scale className="w-4 h-4" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ideepakrajput/careerlyze"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://ideepakrajput.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  ideepakrajput.in
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} Careerlyze. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
