import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';

const CollaborationBanner = () => (
  <section className="py-10">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border border-accent/30 bg-accent/5 p-6 md:p-8 text-center"
      >
        <Handshake size={32} className="mx-auto mb-3 text-accent" />
        <h3 className="font-display text-lg md:text-xl font-bold mb-2">
          In Collaboration with <span className="text-gradient-brand">Raj Bonlawar</span>
        </h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Team member of B2C Solution — handling product management, digital platform operations, and upcoming social media strategy.
        </p>
      </motion.div>
    </div>
  </section>
);

export default CollaborationBanner;
