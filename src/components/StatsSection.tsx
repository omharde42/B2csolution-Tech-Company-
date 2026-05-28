import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Rocket, Users, Bot, Clock } from 'lucide-react';

const stats = [
  { icon: Rocket, value: 120, suffix: '+', label: 'Projects Delivered' },
  { icon: Users, value: 95, suffix: '+', label: 'Happy Clients' },
  { icon: Bot, value: 40, suffix: '+', label: 'AI Solutions Built' },
  { icon: Clock, value: 1200, suffix: '+', label: 'Hours Saved' },
];

const Counter = ({ to, suffix }: { to: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString() + suffix);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 1.8, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, to, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const StatsSection = () => (
  <section className="relative py-16 sm:py-20 border-y border-border/60 bg-gradient-to-b from-background via-secondary/20 to-background">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-5 sm:p-7 text-center overflow-hidden hover:border-primary/40 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <s.icon size={22} className="mx-auto mb-3 text-primary" aria-hidden="true" />
              <div className="font-display text-2xl sm:text-4xl font-black text-gradient-brand">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p className="text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground mt-2 font-display font-semibold">
                {s.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
