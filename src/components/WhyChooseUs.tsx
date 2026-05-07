import { motion } from 'framer-motion';
import { Zap, IndianRupee, ShieldCheck, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';

const reasons = [
  { icon: Zap, title: 'Fast 2–3 day delivery', desc: 'Most websites go live within 72 hours of payment confirmation.' },
  { icon: IndianRupee, title: 'Transparent pricing', desc: 'Starts at ₹3,500. No hidden fees, no surprise renewals.' },
  { icon: ShieldCheck, title: 'Secure UPI payments', desc: 'Pay via verified UPI IDs with screenshot-based order verification.' },
  { icon: Sparkles, title: 'Modern, mobile-first design', desc: 'Pixel-perfect on phone, tablet and desktop — built with React.' },
  { icon: MessageCircle, title: 'Direct WhatsApp support', desc: 'Talk to the founder directly on +91 98823 03030. No call centres.' },
  { icon: RefreshCw, title: '7-day free revisions', desc: 'Free design and content tweaks for a week after handover.' },
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
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
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
