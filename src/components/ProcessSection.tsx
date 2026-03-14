import { motion } from 'framer-motion';
import { MessageSquare, Search, Wrench, CheckCircle } from 'lucide-react';

const steps = [
  { icon: MessageSquare, step: '01', title: 'Tell Us Your Need', desc: 'Reach out via WhatsApp, contact form, or call. Describe what you need.' },
  { icon: Search, step: '02', title: 'We Assess & Plan', desc: 'Our team evaluates your requirements and provides a clear quote.' },
  { icon: Wrench, step: '03', title: 'We Get It Done', desc: 'Expert execution — whether it's a website, repair, or document service.' },
  { icon: CheckCircle, step: '04', title: 'You Review & Approve', desc: 'We deliver, you review. Satisfaction guaranteed or we revise for free.' },
];

const ProcessSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold mb-3">How It <span className="text-gradient-brand">Works</span></h2>
        <p className="text-muted-foreground">Simple 4-step process from request to delivery</p>
      </motion.div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="relative text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <s.icon size={28} />
            </div>
            <span className="font-display text-xs font-bold text-accent tracking-widest">STEP {s.step}</span>
            <h3 className="font-display text-sm font-bold mt-2 mb-2">{s.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-8 -right-4 w-8 border-t border-dashed border-border" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSection;
