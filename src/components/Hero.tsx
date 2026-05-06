import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Zap, IndianRupee, Smile, FolderGit2 } from 'lucide-react';

const WA_LINK =
  'https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!%20I%20want%20a%20website%20for%20my%20business.';

const Hero = () => (
  <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-hero">
    <div className="absolute top-10 left-0 h-96 w-96 rounded-full bg-primary/8 blur-[100px]" />
    <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/8 blur-[100px]" />

    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="mb-5 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-display text-[10px] font-bold uppercase tracking-widest text-accent">
          Websites for Small Businesses
        </span>

        <h1 className="font-display text-4xl font-black leading-[1.1] tracking-tight md:text-5xl lg:text-6xl mb-6">
          We build websites that{' '}
          <span className="text-gradient-brand">bring customers</span> to your business
        </h1>

        <p className="mx-auto max-w-xl text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
          Simple, fast, and affordable websites for small businesses — ready in just 2–3 days.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-105 glow-accent"
          >
            <MessageCircle size={16} /> Get Your Website on WhatsApp
            <ArrowRight size={14} />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 font-display text-sm font-bold text-foreground transition-colors hover:bg-secondary"
          >
            <FolderGit2 size={16} /> View Projects
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: Zap, label: 'Ready in 2–3 days' },
            { icon: IndianRupee, label: 'AI Website starting at ₹3500' },
            { icon: Smile, label: 'Made for small business' },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-xs text-muted-foreground">
              <b.icon size={14} className="text-primary" />
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
