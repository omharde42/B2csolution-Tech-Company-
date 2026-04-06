import { motion } from 'framer-motion';
import { ArrowRight, Globe, Rocket, Shield, Cpu, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-hero">
    <div className="absolute top-10 left-0 h-96 w-96 rounded-full bg-primary/8 blur-[100px]" />
    <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/8 blur-[100px]" />

    <div className="container mx-auto px-4 py-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center lg:text-left"
        >
          <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-display text-[10px] font-bold uppercase tracking-widest text-accent">
            Technology & Digital Solutions
          </span>

          <h1 className="font-display text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl mb-6">
            Building Smart<br />
            <span className="text-gradient-brand">Digital Solutions</span><br />
            for Modern Businesses
          </h1>

          <p className="mx-auto max-w-lg text-base text-muted-foreground md:text-lg lg:mx-0 mb-4 leading-relaxed">
            Websites • Apps • Automation • AI Tools • Online Business Solutions
          </p>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground lg:mx-0 mb-8 leading-relaxed">
            Powered by <strong className="text-foreground">B2C Solution</strong> — affordable tech services with premium quality.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <a
              href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!%20I%27d%20like%20to%20start%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-105 glow-accent"
            >
              <Rocket size={16} /> Start a Project <ArrowRight size={14} />
            </a>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 font-display text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              <Globe size={16} /> View Services
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
            {[
              { icon: Zap, label: 'Fast Delivery' },
              { icon: Shield, label: 'Secure & Reliable' },
              { icon: Cpu, label: 'Modern Tech Stack' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                <b.icon size={14} className="text-primary" />
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-md mx-auto">
            <motion.div
              className="relative z-10 rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-primary/20"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <pre className="text-xs md:text-sm font-mono text-muted-foreground leading-relaxed">
<span className="text-primary">const</span> <span className="text-accent">b2c</span> = {'{'}{'\n'}  <span className="text-primary">name</span>: <span className="text-green-400">"B2C Solution"</span>,{'\n'}  <span className="text-primary">services</span>: [{'\n'}    <span className="text-green-400">"Web Development"</span>,{'\n'}    <span className="text-green-400">"App Development"</span>,{'\n'}    <span className="text-green-400">"AI Tools"</span>,{'\n'}    <span className="text-green-400">"Automation"</span>{'\n'}  ],{'\n'}  <span className="text-primary">quality</span>: <span className="text-accent">&#x2728; Premium</span>{'\n'}{'}'};
              </pre>
            </motion.div>

            <motion.div
              className="absolute -left-6 top-8 z-20 rounded-xl border border-border bg-card px-4 py-3 shadow-xl"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <Rocket size={16} className="text-accent" />
                <span className="text-xs font-bold text-foreground">50+ Projects</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-4 bottom-8 z-20 rounded-xl border border-border bg-card px-4 py-3 shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                <span className="text-xs font-bold text-foreground">100% Reliable</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
