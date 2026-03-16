import Hero from '@/components/Hero';
import BestSellers from '@/components/BestSellers';
import WhyChooseUs from '@/components/WhyChooseUs';
import CustomDesignService from '@/components/CustomDesignService';
import Reviews from '@/components/Reviews';
import AboutSection from '@/components/AboutSection';
import ContactSocial from '@/components/ContactSocial';
import NewsSection from '@/components/NewsSection';
import B2CDesignerSection from '@/components/B2CDesignerSection';
import HomeCTA from '@/components/HomeCTA';

const Index = () => {
  return (
    <div>
      <Hero />
      <BestSellers />
      <WhyChooseUs />
      <CustomDesignService />
      <Reviews />
      <NewsSection />
      <AboutSection />
      <B2CDesignerSection />
      <ContactSocial />
      <HomeCTA />
    </div>
  );
};

export default Index;
