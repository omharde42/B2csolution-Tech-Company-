import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
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
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Have a Project Idea? <span className="text-gradient-brand">Let's Build It Together.</span></h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          From concept to launch — we build websites, apps, AI tools, and digital solutions that grow your business.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!%20I%20have%20a%20project%20idea%20to%20discuss."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-105 glow-accent"
          >
            <MessageCircle size={16} /> Start a Project
          </a>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3 font-display text-sm font-bold text-foreground transition-colors hover:bg-secondary"
          >
            View Services <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HomeCTA;
