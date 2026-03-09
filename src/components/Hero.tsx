import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const Hero = () => (
  <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
    {/* Decorative circles */}
    <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
    <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />

    <div className="container mx-auto px-4 py-20 text-center relative z-10">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-display text-4xl font-black tracking-tight md:text-6xl lg:text-7xl mb-6"
      >
        <span className="text-gradient-brand">B2CSOLUTION</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mx-auto max-w-xl text-lg text-muted-foreground md:text-xl mb-8"
      >
        Premium digital services for your business. Web, App, Design, SEO & more — all under one roof.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <a href="#services" className="rounded-lg bg-accent px-8 py-3 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-105 glow-accent">
          Explore Services
        </a>
        <a href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2CSOLUTION!%20I%27d%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener noreferrer"
          className="rounded-lg border border-border px-8 py-3 font-display text-sm font-bold text-foreground transition-colors hover:bg-secondary">
          Contact Us
        </a>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16"
      >
        <ArrowDown size={24} className="mx-auto text-muted-foreground animate-float" />
      </motion.div>
    </div>
  </section>
);

export default Hero;
