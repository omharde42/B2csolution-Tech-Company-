import { lazy, Suspense } from 'react';
import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import Services from '@/components/Services';
import ProcessSection from '@/components/ProcessSection';
import Reviews from '@/components/Reviews';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import HomeCTA from '@/components/HomeCTA';

const Index = () => {
  return (
    <div>
      <Hero />
      <ProblemSection />
      <Services />
      <Reviews />
      <ProcessSection />
      <PricingSection />
      <FAQSection />
      <HomeCTA />
    </div>
  );
};

export default Index;
