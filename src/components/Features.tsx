"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  TrendingUp,
  Lightbulb,
  BarChart3,
  Shield,
  Clock,
  Target,
  Users,
  FileText,
  Zap,
  Search,
  Award,
  Download,
  Eye,
  MessageSquare,
  Globe,
} from "lucide-react";

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive AI-powered tools designed to optimize your resume and
            maximize your job search success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div
            className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-all duration-300">
              <CheckCircle className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Smart Resume Analysis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced AI algorithms analyze your resume structure, content
              quality, and keyword optimization to provide comprehensive
              insights.
            </p>
          </div>

          <div
            className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-all duration-300">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ATS Compatibility Score
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get precise ATS compatibility scores and detailed feedback on how
              to optimize your resume for applicant tracking systems.
            </p>
          </div>

          <div
            className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-all duration-300">
              <Lightbulb className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              AI-Powered Recommendations
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Receive personalized suggestions for skills, structure
              improvements, and missing keywords tailored to your industry.
            </p>
          </div>

          <div
            className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-all duration-300">
              <Target className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Job Matching Analysis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Compare your resume with specific job descriptions to get match
              percentages and targeted improvement suggestions.
            </p>
          </div>

          <div
            className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-200 transition-all duration-300">
              <Shield className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Secure & Private
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Your resume data is encrypted and secure. We never share your
              personal information with third parties.
            </p>
          </div>

          <div
            className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-all duration-300">
              <Clock className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Instant Results
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get comprehensive analysis results in seconds, not hours. Fast,
              accurate, and actionable insights.
            </p>
          </div>
        </div>

        {/* Enhanced Analysis Report Section */}
        <div
          className={`bg-white rounded-3xl shadow-2xl p-8 lg:p-12 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-10 h-10 text-blue-600" />
              <h3 className="text-3xl font-bold text-gray-900">
                Comprehensive Analysis Report
              </h3>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get detailed insights into every aspect of your resume with our
              advanced AI analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                ATS Score
              </h4>
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <p className="text-sm text-gray-600">Excellent compatibility</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Content Quality
              </h4>
              <div className="text-3xl font-bold text-blue-600 mb-2">88%</div>
              <p className="text-sm text-gray-600">Strong content</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Keywords
              </h4>
              <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
              <p className="text-sm text-gray-600">Well optimized</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Job Match
              </h4>
              <div className="text-3xl font-bold text-orange-600 mb-2">87%</div>
              <p className="text-sm text-gray-600">Great fit</p>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">PDF Viewer</span>
              </div>
              <p className="text-sm text-gray-600">
                View your original resume alongside analysis
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Download className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">
                  Export Reports
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Download detailed analysis reports
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">
                  Detailed Feedback
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Comprehensive improvement suggestions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
