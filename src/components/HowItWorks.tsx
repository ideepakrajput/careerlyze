"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  Zap,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Target,
  Download,
} from "lucide-react";

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    {
      number: "01",
      title: "Upload Your Resume",
      description:
        "Upload your resume in PDF format and provide the job description you're targeting.",
      icon: Upload,
      color: "blue",
      details: [
        "Supports PDF format only",
        "Maximum file size: 10MB",
        "Job description is optional but recommended",
        "Secure file upload with encryption",
      ],
    },
    {
      number: "02",
      title: "AI Analysis",
      description:
        "Our advanced AI analyzes your resume using Google's Gemini AI technology.",
      icon: Zap,
      color: "green",
      details: [
        "Natural Language Processing (NLP)",
        "Content structure analysis",
        "Keyword extraction and matching",
        "ATS compatibility assessment",
      ],
    },
    {
      number: "03",
      title: "Generate Report",
      description:
        "Get a comprehensive analysis report with scores, recommendations, and insights.",
      icon: BarChart3,
      color: "purple",
      details: [
        "ATS compatibility score",
        "Content quality assessment",
        "Keyword optimization analysis",
        "Job matching percentage",
      ],
    },
    {
      number: "04",
      title: "Review & Improve",
      description:
        "View detailed recommendations and implement suggested improvements.",
      icon: CheckCircle,
      color: "orange",
      details: [
        "Detailed improvement suggestions",
        "Missing keywords identification",
        "Structure optimization tips",
        "Industry-specific recommendations",
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-200",
      green: "bg-green-100 text-green-600 group-hover:bg-green-200",
      purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-200",
      orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-200",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with CareerLyze in just a few simple steps and transform
            your resume with AI-powered insights
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div
                  className={`${
                    index % 2 === 1 ? "lg:order-2" : ""
                  } transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  }`}
                  style={{ transitionDelay: `${index * 200 + 100}ms` }}
                >
                  <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-gray-700" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-400 mb-1">
                          {step.number}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-center gap-3 text-gray-600"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  className={`${
                    index % 2 === 1 ? "lg:order-1" : ""
                  } transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  }`}
                  style={{ transitionDelay: `${index * 200 + 200}ms` }}
                >
                  <div className="relative">
                    <div className="bg-linear-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 lg:p-12">
                      <div className="text-center">
                        <div
                          className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group transition-all duration-300 ${getColorClasses(
                            step.color
                          )}`}
                        >
                          <Icon className="w-10 h-10" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-4">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 mb-6">{step.description}</p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Usually takes 30-60 seconds</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow for next step */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div
          className={`mt-20 bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 lg:p-12 text-white transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose CareerLyze?</h3>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Experience the power of AI-driven resume analysis with our
              cutting-edge platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Secure & Private</h4>
              <p className="text-blue-100 text-sm">
                Your data is encrypted and never shared
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Lightning Fast</h4>
              <p className="text-blue-100 text-sm">
                Get results in seconds, not hours
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Precise Analysis</h4>
              <p className="text-blue-100 text-sm">
                AI-powered insights for better results
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Export Reports</h4>
              <p className="text-blue-100 text-sm">
                Download detailed analysis reports
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
