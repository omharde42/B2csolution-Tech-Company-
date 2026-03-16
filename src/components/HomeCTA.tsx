import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag } from 'lucide-react';
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
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Ready to Get Your <span className="text-gradient-brand">Custom Merch?</span></h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Browse our collection or create something unique. Premium quality, affordable prices, fast delivery.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-105 glow-accent"
          >
            <ShoppingBag size={16} /> Shop Now
          </Link>
          <a
            href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!%20I%27d%20like%20to%20place%20a%20custom%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3 font-display text-sm font-bold text-foreground transition-colors hover:bg-secondary"
          >
            <MessageCircle size={16} /> Custom Order
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HomeCTA;
