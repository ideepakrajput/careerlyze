"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
  Target,
  Award,
  BarChart3,
  FileText,
  Shield,
} from "lucide-react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-100 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-100 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-orange-100 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute bottom-1/3 right-10 w-14 h-14 bg-pink-100 rounded-full animate-pulse opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 mb-6 text-sm text-blue-700">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">
                Trusted by 10,000+ Job Seekers
              </span>
            </div>

            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Career with AI
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
              Get instant, professional resume analysis powered by Google Gemini
              AI. Boost your ATS score, optimize keywords, and land more
              interviews with intelligent recommendations tailored to your
              industry.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium">95% ATS Score</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">Instant Analysis</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium">Job Matching</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-orange-600" />
                </div>
                <span className="font-medium">Expert Tips</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/resume-analyze"
                className="group bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                Start Free Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/how-it-works"
                className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <BarChart3 className="w-5 h-5" />
                How It Works
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm text-gray-600">
                  Join 10,000+ users
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">4.9/5 rating</span>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {/* Enhanced Demo Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-500 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Sample Analysis
                  </h3>
                  <p className="text-gray-600">
                    See what you'll get with our AI analysis
                  </p>
                </div>

                {/* Analysis Results */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">ATS Score</p>
                        <p className="text-sm text-gray-600">Compatibility</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">95%</p>
                      <p className="text-sm text-green-600">Excellent</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Job Match</p>
                        <p className="text-sm text-gray-600">Relevance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">87%</p>
                      <p className="text-sm text-blue-600">Great Fit</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Keywords</p>
                        <p className="text-sm text-gray-600">Optimization</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">92%</p>
                      <p className="text-sm text-purple-600">Well Optimized</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>Secure & Private Analysis</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
