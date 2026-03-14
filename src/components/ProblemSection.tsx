import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Clock, ShieldOff } from 'lucide-react';

const problems = [
  { icon: TrendingDown, title: 'Losing Customers?', desc: "Without a professional online presence, you're invisible to potential clients searching for services." },
  { icon: Clock, title: 'Wasting Time on Tech?', desc: 'Hours spent fixing computers, setting up software, or troubleshooting issues that a pro can handle in minutes.' },
  { icon: ShieldOff, title: 'Security Concerns?', desc: 'Viruses, data loss, and unsecured networks put your business and personal data at risk every day.' },
  { icon: AlertTriangle, title: 'Outdated Systems?', desc: 'Slow PCs, broken printers, and old software are silently killing your productivity and profits.' },
];

const ProblemSection = () => (
  <section className="py-20 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold mb-3">Problems We <span className="text-gradient-brand">Solve</span></h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Stop struggling with tech issues. We handle everything so you can focus on what matters — growing your business.</p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <p.icon size={28} />
            </div>
            <h3 className="font-display text-sm font-bold mb-2">{p.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
