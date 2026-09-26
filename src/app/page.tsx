import StorefrontExperience from '@/components/showroom/StorefrontExperience';
import BrandStatementSection from '@/components/home/BrandStatementSection';
import PortfolioPreviewSection from '@/components/home/PortfolioPreviewSection';
import TransformationSection from '@/components/home/TransformationSection';
// Chapter 05 (The Making Matters / WhyUs) temporarily disabled per user preference
// import WhyUsSection from '@/components/home/WhyUsSection';
import ServicesStackSection from '@/components/home/ServicesStackSection';
// Chapter 07 (Process / How Your Storefront Takes Shape) commented out per user request
// import ProcessSection from '@/components/home/ProcessSection';
import FinalCtaSection from '@/components/home/FinalCtaSection';
import './storefront.css';

export default function HomePage() {
  return (
    <>
      <StorefrontExperience />
      <div className="home-continuation">
        {/* Horizontal Marquee Separation Ribbon between Hero and Portfolio */}
        <BrandStatementSection />
        {/* Work & Inspiration (Portfolio Preview) */}
        <PortfolioPreviewSection />
        <TransformationSection />
        {/* Chapter 05: The Making Matters / Craft section temporarily commented out */}
        {/* <WhyUsSection /> */}
        <ServicesStackSection />
        {/* Chapter 07: Process Section / How Your Storefront Takes Shape commented out per user request */}
        {/* <ProcessSection /> */}
        <FinalCtaSection />
      </div>
    </>
  );
}

