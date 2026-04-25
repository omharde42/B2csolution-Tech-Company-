import { motion } from 'framer-motion';
import { Zap, IndianRupee, Smile, Sparkles } from 'lucide-react';

const reasons = [
  { icon: Zap, title: 'Fast delivery', desc: 'Your website ready in just 2–3 days.' },
  { icon: IndianRupee, title: 'Affordable pricing', desc: 'Honest prices that fit a small business budget.' },
  { icon: Smile, title: 'Built for small business', desc: 'Made to bring you real customers, not just clicks.' },
  { icon: Sparkles, title: 'Clean & modern design', desc: 'Looks great on phone, tablet, and desktop.' },
];

const WhyChooseUs = () => (
  <section className="py-20 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
          Why small businesses <span className="text-gradient-brand">choose us</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Everything you need to take your business online — without the headache.
        </p>
      </motion.div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <r.icon size={24} />
            </div>
            <h3 className="font-display text-base font-bold mb-1.5">{r.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
