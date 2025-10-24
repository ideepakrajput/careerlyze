"use client";

import { useState, useEffect } from "react";
import { FileText, Zap, Search } from "lucide-react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About Careerlyze
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Careerlyze is a cutting-edge AI-powered platform that revolutionizes
            resume evaluation and job matching using advanced Natural Language
            Processing (NLP) technology.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div
            className={`text-center transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Resume Analysis
            </h3>
            <p className="text-gray-600">
              Extract and analyze resume text to provide comprehensive insights
              and recommendations.
            </p>
          </div>

          <div
            className={`text-center transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ATS Compatibility
            </h3>
            <p className="text-gray-600">
              Get detailed ATS scores and section completeness analysis for
              better optimization.
            </p>
          </div>

          <div
            className={`text-center transition-all duration-1000 delay-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Search className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Job Matching
            </h3>
            <p className="text-gray-600">
              Compare resume content with job descriptions to estimate match
              percentages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
