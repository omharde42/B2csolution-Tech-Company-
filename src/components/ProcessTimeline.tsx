import { motion } from 'framer-motion';
import { MessageSquare, PenTool, Code2, Rocket, LifeBuoy } from 'lucide-react';

const steps = [
  { icon: MessageSquare, title: 'Discover', desc: 'We talk on WhatsApp — understand your business and goals.' },
  { icon: PenTool, title: 'Design', desc: 'Modern mockups tailored to your brand. Free revisions.' },
  { icon: Code2, title: 'Build', desc: 'Clean code, fast load times, mobile-first by default.' },
  { icon: Rocket, title: 'Launch', desc: 'Live in 2–3 days. Domain, hosting, WhatsApp — handled.' },
  { icon: LifeBuoy, title: 'Support', desc: '7-day free revisions and ongoing care, all on WhatsApp.' },
];

const ProcessTimeline = () => (
  <section className="py-16 sm:py-20" id="process">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-primary">
          How we work
        </span>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          From idea to live in <span className="text-gradient-brand">5 simple steps</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
          No agency drama. No long calls. Just a clean, fast process.
        </p>
      </motion.div>

      <div className="relative max-w-5xl mx-auto">
        <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-card border border-border shadow-lg shadow-primary/10">
                <s.icon size={22} className="text-primary" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-display font-bold text-accent-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-sm font-bold mb-1.5">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ProcessTimeline;
