import Hero from '@/components/Hero';
import PricingSection from '@/components/PricingSection';
import ProjectsSection from '@/components/ProjectsSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import Reviews from '@/components/Reviews';
import FAQSection from '@/components/FAQSection';
import HomeCTA from '@/components/HomeCTA';
import TrackOrderCTA from '@/components/TrackOrderCTA';

const Index = () => {
  return (
    <div>
      <Hero />
      <PricingSection />
      <ProjectsSection />
      <WhyChooseUs />
      <Reviews />
      <TrackOrderCTA />
      <FAQSection />
      <HomeCTA />
    </div>
  );
};

export default Index;
