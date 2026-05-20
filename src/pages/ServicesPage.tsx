import Services from '@/components/Services';
import SEO from '@/components/SEO';

const ServicesPage = () => (
  <div>
    <SEO
      title="Services & Pricing — B2C Solution"
      description="Explore all digital services from B2C Solution: AI websites from ₹3500, business websites, automation tools, AI assistants, and custom development."
      path="/services"
    />
    <Services showAll />
  </div>
);

export default ServicesPage;
