import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import PricingSection from '@/components/PricingSection';
import ProjectsSection from '@/components/ProjectsSection';
import CaseStudies from '@/components/CaseStudies';
import ProcessTimeline from '@/components/ProcessTimeline';
import WhyChooseUs from '@/components/WhyChooseUs';
import Reviews from '@/components/Reviews';
import FAQSection from '@/components/FAQSection';
import HomeCTA from '@/components/HomeCTA';
import TrackOrderCTA from '@/components/TrackOrderCTA';
import SEO from '@/components/SEO';

const faqs = [
  { q: 'How long does it take to get my website?', a: 'Most websites are ready within 2–3 days. Simple one-page sites can even be delivered within 24 hours.' },
  { q: 'How many revisions do I get?', a: 'You get unlimited revisions until you are happy with the design. We work together until it looks exactly right.' },
  { q: 'Will WhatsApp be integrated on my website?', a: 'Yes. Every Business and Advanced package includes a WhatsApp chat button so visitors can message you directly.' },
  { q: 'How do I pay?', a: 'We accept UPI (Google Pay, PhonePe, Paytm). Half payment to start, half on delivery. No extra charges.' },
  { q: 'What do you need from me to start?', a: 'Just your business name, a few photos, and what you want to say. We handle everything else.' },
  { q: "What if I don't like the design?", a: "We revise it for free until you love it. In the rare case you change your mind before work starts, we offer a full refund." },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const Index = () => {
  return (
    <div>
      <SEO
        title="B2C Solution — Websites, AI Tools & Digital Services"
        description="Affordable websites, AI tools & automation for small businesses. AI Website from ₹3500. Fast delivery, WhatsApp setup, unlimited revisions."
        path="/"
        jsonLd={faqSchema}
      />
      <Hero />
      <StatsSection />
      <WhyChooseUs />
      <ProcessTimeline />
      <PricingSection />
      <ProjectsSection />
      <CaseStudies />
      <Reviews />
      <TrackOrderCTA />
      <FAQSection />
      <HomeCTA />
    </div>
  );
};

export default Index;
