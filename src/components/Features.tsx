"use client";

import { useState, useEffect } from "react";
import { CheckCircle, TrendingUp, Lightbulb, BarChart3 } from "lucide-react";

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
            Key Features
          </h2>
          <p className="text-xl text-gray-600">
            Powerful AI-driven capabilities to enhance your career prospects
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div
            className={`space-y-8 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="flex items-start group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 shrink-0 group-hover:bg-blue-200 transition-all duration-300">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Smart Resume Analysis
                </h3>
                <p className="text-gray-600">
                  Advanced NLP algorithms analyze your resume structure, content
                  quality, and keyword optimization.
                </p>
              </div>
            </div>

            <div className="flex items-start group">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 shrink-0 group-hover:bg-green-200 transition-all duration-300">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ATS Score Calculation
                </h3>
                <p className="text-gray-600">
                  Get precise ATS compatibility scores and detailed feedback on
                  how to improve your resume.
                </p>
              </div>
            </div>

            <div className="flex items-start group">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 shrink-0 group-hover:bg-purple-200 transition-all duration-300">
                <Lightbulb className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Intelligent Recommendations
                </h3>
                <p className="text-gray-600">
                  Receive personalized suggestions for skills, structure
                  improvements, and missing keywords.
                </p>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Resume Analysis Report
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ATS Compatibility</span>
                  <span className="text-green-600 font-semibold">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full progress-bar"
                    style={{ width: "95%" }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Content Quality</span>
                  <span className="text-blue-600 font-semibold">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full progress-bar"
                    style={{ width: "88%" }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Keyword Optimization</span>
                  <span className="text-purple-600 font-semibold">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full progress-bar"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
