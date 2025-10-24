import { FileText, Scale, Shield, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Header />

      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Scale className="w-10 h-10 text-blue-600" />
              Terms of Service
            </h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-600 mb-4">
                By accessing and using Careerlyze, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Use License
              </h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily use Careerlyze for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Service Description
              </h2>
              <p className="text-gray-600 mb-4">
                Careerlyze provides AI-powered resume analysis and job matching
                services. We reserve the right to modify or discontinue the
                service at any time.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                User Responsibilities
              </h2>
              <p className="text-gray-600 mb-4">
                Users are responsible for ensuring the accuracy of information
                provided and for maintaining the confidentiality of their
                account credentials.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-600 mb-4">
                In no event shall Careerlyze or its suppliers be liable for any
                damages arising out of the use or inability to use the service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please
                contact us at{" "}
                <a
                  href="mailto:legal@careerlyze.com"
                  className="text-blue-600 hover:text-blue-500"
                >
                  legal@careerlyze.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
