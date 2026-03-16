import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Truck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImg1 from '@/assets/hero-product-1.png';
import heroImg2 from '@/assets/hero-product-2.png';
import heroImg3 from '@/assets/hero-product-3.png';

const Hero = () => (
  <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-hero">
    {/* Background blobs */}
    <div className="absolute top-10 left-0 h-96 w-96 rounded-full bg-primary/8 blur-[100px]" />
    <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/8 blur-[100px]" />

    <div className="container mx-auto px-4 py-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left — Copy */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center lg:text-left"
        >
          <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-display text-[10px] font-bold uppercase tracking-widest text-accent">
            Premium Custom Merchandise
          </span>

          <h1 className="font-display text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl mb-6">
            Design It.<br />
            <span className="text-gradient-brand">Wear It.</span><br />
            Own It.
          </h1>

          <p className="mx-auto max-w-lg text-base text-muted-foreground md:text-lg lg:mx-0 mb-8 leading-relaxed">
            High-quality custom T-shirts, mugs, hoodies, phone cases & more — designed by <strong className="text-foreground">B2C Solution</strong>. Affordable prices, fast delivery, and premium prints.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-105 glow-accent"
            >
              <ShoppingBag size={16} /> Shop Now <ArrowRight size={14} />
            </Link>
            <a
              href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!%20I%27d%20like%20to%20order%20custom%20merchandise."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 font-display text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              Custom Order
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
            {[
              { icon: Truck, label: 'Fast Delivery' },
              { icon: Shield, label: 'Premium Quality' },
              { icon: ShoppingBag, label: '500+ Designs' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                <b.icon size={14} className="text-primary" />
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Product showcase */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-md mx-auto">
            {/* Main product */}
            <motion.img
              src={heroImg1}
              alt="Custom printed merchandise by B2C Solution"
              className="relative z-10 w-full rounded-2xl shadow-2xl shadow-primary/20"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              loading="eager"
            />
            {/* Floating secondary products */}
            <motion.img
              src={heroImg2}
              alt="Custom design product"
              className="absolute -left-8 top-8 z-20 w-28 rounded-xl border-2 border-card shadow-xl md:w-36"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
              loading="eager"
            />
            <motion.img
              src={heroImg3}
              alt="Creative merchandise"
              className="absolute -right-6 bottom-8 z-20 w-28 rounded-xl border-2 border-card shadow-xl md:w-36"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
