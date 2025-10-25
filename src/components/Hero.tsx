"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-100 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-100 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Resume
              <span className="text-blue-600 animate-pulse flex items-center gap-2">
                <Sparkles className="w-8 h-8" />
                Evaluation
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Smart AI assistant that evaluates resumes, provides ATS
              compatibility scores, and recommends improvements for better job
              shortlisting chances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/resume-analyze"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Analyze Resume
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <CheckCircle className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ATS Score: 95%
                </h3>
                <p className="text-gray-600 mb-4">
                  Your resume is highly compatible with ATS systems
                </p>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium animate-bounce">
                  Excellent Match
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
