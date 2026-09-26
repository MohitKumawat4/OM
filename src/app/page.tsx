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

// Server Action to update the preview poster with the exact pixel-perfect Three.js canvas render
async function syncPosterAction(dataUrl: string) {
  'use server';
  if (process.env.NODE_ENV === 'production') return;
  try {
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const posterPath = path.join(process.cwd(), 'public/images/showroom/storefront-poster.webp');
    await fs.writeFile(posterPath, buffer);
    console.log('[Storefront] Successfully updated storefront-poster.webp from live Three.js render');
  } catch (error) {
    console.error('[Storefront] Failed to synchronize poster:', error);
  }
}

export default function HomePage() {
  return (
    <>
      <StorefrontExperience onCapturePoster={syncPosterAction} />
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

