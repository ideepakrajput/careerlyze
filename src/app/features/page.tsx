import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import CTA from "@/components/CTA";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Header />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
