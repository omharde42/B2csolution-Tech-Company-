import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WA_LINK =
  'https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!%20I%20want%20a%20website%20for%20my%20business.';

const HomeCTA = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-gradient-hero border border-border p-10 md:p-16 text-center"
      >
        <h2 className="font-display text-2xl md:text-4xl font-bold mb-4 leading-tight">
          Want a website for your business?{' '}
          <span className="text-gradient-brand">Message me now on WhatsApp.</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-8">
          Tell me about your business — I'll reply with a quick plan and price the same day.
        </p>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-10 py-4 font-display text-base font-bold text-accent-foreground transition-transform hover:scale-105 glow-accent"
        >
          <MessageCircle size={18} /> Chat on WhatsApp
        </a>
      </motion.div>
    </div>
  </section>
);

export default HomeCTA;
