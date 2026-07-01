import HeroSection from "../../components/landing/HeroSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import HowItWorksSection from "../../components/landing/HowItWorksSection";
import WhyBlockchainSection from "../../components/landing/WhyBlockchainSection";
import TestimonialsSection from "../../components/landing/TestimonialsSection";
import StatsSection from "../../components/landing/StatsSection";
import PricingSection from "../../components/landing/PricingSection";
import FAQSection from "../../components/landing/FAQSection";
import CTASection from "../../components/landing/CTASection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhyBlockchainSection />
      <TestimonialsSection />
      <StatsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
