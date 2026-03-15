import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import Services from '@/components/Services';
import ProcessSection from '@/components/ProcessSection';
import Reviews from '@/components/Reviews';
import NewsSection from '@/components/NewsSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import B2CDesignerSection from '@/components/B2CDesignerSection';
import HomeCTA from '@/components/HomeCTA';

const Index = () => {
  return (
    <div>
      <Hero />
      <ProblemSection />
      <Services />
      <Reviews />
      <NewsSection />
      <ProcessSection />
      <PricingSection />
      <FAQSection />
      <B2CDesignerSection />
      <HomeCTA />
    </div>
  );
};

export default Index;
