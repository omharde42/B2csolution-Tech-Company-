import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeCTA = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl bg-gradient-hero border border-border p-10 md:p-14 text-center"
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Ready to Get <span className="text-gradient-brand">Started?</span></h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Let's solve your tech problems today. Reach out and we'll get back to you within minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2CSOLUTION!%20I%27d%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-accent px-8 py-3 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-105 glow-accent flex items-center gap-2"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
          <Link to="/contact" className="rounded-lg border border-border px-8 py-3 font-display text-sm font-bold text-foreground transition-colors hover:bg-secondary">
            Contact Form
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HomeCTA;
