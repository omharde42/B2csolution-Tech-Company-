import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Zap, IndianRupee, Smile, FolderGit2, Sparkles, Code2, Bot } from 'lucide-react';

const WA_LINK =
  'https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!%20I%20want%20a%20website%20for%20my%20business.';

const Hero = () => (
  <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-gradient-hero">
    {/* Animated grid */}
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)',
      }}
    />

    {/* Color orbs */}
    <motion.div
      aria-hidden="true"
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-10 left-0 h-96 w-96 rounded-full bg-primary/15 blur-[120px]"
    />
    <motion.div
      aria-hidden="true"
      animate={{ y: [0, 20, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/12 blur-[120px]"
    />

    {/* Floating glass UI badges (desktop only) */}
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="hidden lg:flex absolute top-[18%] left-[6%] items-center gap-2 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md px-3 py-2 shadow-xl shadow-primary/10 animate-[float_4s_ease-in-out_infinite]"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
        <Code2 size={14} />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-display font-bold">Deployed</div>
        <div className="text-xs font-semibold">in 48 hours</div>
      </div>
    </motion.div>

    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="hidden lg:flex absolute top-[24%] right-[7%] items-center gap-2 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md px-3 py-2 shadow-xl shadow-accent/10 animate-[float_5s_ease-in-out_infinite]"
      style={{ animationDelay: '1s' }}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent">
        <Bot size={14} />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-display font-bold">AI</div>
        <div className="text-xs font-semibold">Chat ready</div>
      </div>
    </motion.div>

    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="hidden lg:flex absolute bottom-[18%] left-[10%] items-center gap-2 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md px-3 py-2 shadow-xl shadow-primary/10 animate-[float_6s_ease-in-out_infinite]"
      style={{ animationDelay: '2s' }}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--price))/0.2] text-[hsl(var(--price))]">
        <IndianRupee size={14} />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-display font-bold">From</div>
        <div className="text-xs font-semibold">₹3,500</div>
      </div>
    </motion.div>

    <div className="container relative mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-display text-[10px] font-bold uppercase tracking-widest text-accent"
        >
          <Sparkles size={11} /> Websites for Small Businesses
        </motion.span>

        <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl mb-6">
          We build websites that{' '}
          <span className="text-gradient-brand">bring customers</span> to your business
        </h1>

        <p className="mx-auto max-w-xl text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
          Simple, fast, and affordable websites for small businesses — ready in just 2–3 days.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-display text-sm font-bold text-accent-foreground transition-all hover:scale-105 glow-accent"
          >
            <MessageCircle size={16} /> Get Your Website on WhatsApp
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 backdrop-blur-sm px-8 py-3.5 font-display text-sm font-bold text-foreground transition-colors hover:bg-secondary"
          >
            <FolderGit2 size={16} /> View Projects
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {[
            { icon: Zap, label: 'Ready in 2–3 days' },
            { icon: IndianRupee, label: 'AI Website from ₹3,500' },
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
