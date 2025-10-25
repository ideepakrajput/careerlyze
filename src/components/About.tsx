"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Zap,
  Search,
  Brain,
  Users,
  Award,
  Globe,
  Shield,
  Target,
  TrendingUp,
  CheckCircle,
  Lightbulb,
} from "lucide-react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            About CareerLyze
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            CareerLyze is a revolutionary AI-powered platform that transforms
            how job seekers approach resume optimization. Using cutting-edge
            Google Gemini AI technology and advanced Natural Language
            Processing, we provide comprehensive resume analysis that helps you
            land your dream job.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="bg-linear-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 lg:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Our Mission
                </h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To democratize career success by providing every job seeker with
                access to professional-grade resume analysis tools powered by
                artificial intelligence. We believe everyone deserves the
                opportunity to present their best professional self.
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="bg-linear-to-br from-green-50 to-emerald-100 rounded-3xl p-8 lg:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become the world's leading AI-powered career development
                platform, helping millions of professionals optimize their job
                search strategies and achieve their career goals through
                intelligent, data-driven insights.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div
          className={`mb-20 transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Powered by Advanced AI Technology
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform leverages the latest in artificial intelligence to
              provide unparalleled resume analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all duration-300">
                <Brain className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Google Gemini AI
              </h4>
              <p className="text-gray-600 text-sm">
                State-of-the-art language model for comprehensive text analysis
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-all duration-300">
                <Zap className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                NLP Processing
              </h4>
              <p className="text-gray-600 text-sm">
                Advanced natural language processing for content understanding
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-all duration-300">
                <Search className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Keyword Analysis
              </h4>
              <p className="text-gray-600 text-sm">
                Intelligent keyword extraction and matching algorithms
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-all duration-300">
                <Award className="w-10 h-10 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                ATS Optimization
              </h4>
              <p className="text-gray-600 text-sm">
                Specialized algorithms for applicant tracking system
                compatibility
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div
          className={`mb-20 transition-all duration-1000 delay-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with user-friendly design to
              deliver exceptional results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-all duration-300">
                <FileText className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Comprehensive Analysis
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes every aspect of your resume including structure,
                content quality, keyword optimization, and ATS compatibility.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-all duration-300">
                <TrendingUp className="w-7 h-7 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Real-time Results
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Get instant analysis results with detailed scores,
                recommendations, and actionable insights in seconds.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-all duration-300">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Privacy & Security
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Your data is encrypted and secure. We never share your personal
                information with third parties.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-all duration-300">
                <Users className="w-7 h-7 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                User-Friendly Interface
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Intuitive design makes it easy for anyone to upload, analyze,
                and improve their resume.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-200 transition-all duration-300">
                <Globe className="w-7 h-7 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Industry Expertise
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Our AI understands industry-specific requirements and provides
                tailored recommendations for your field.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-all duration-300">
                <CheckCircle className="w-7 h-7 text-indigo-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Proven Results
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Thousands of job seekers have improved their resume quality and
                increased their interview chances.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div
          className={`bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 lg:p-12 text-white transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Trusted by Job Seekers Worldwide
            </h3>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their career
              prospects
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Resumes Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">User Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Industries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">AI Analysis Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
