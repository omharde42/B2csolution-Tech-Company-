import { motion } from 'framer-motion';
import { TrendingUp, Zap, Users } from 'lucide-react';

const cases = [
  {
    tag: 'Local Retail',
    title: 'Bakery doubled WhatsApp orders in 3 weeks',
    desc: 'A neighborhood bakery went from no online presence to taking 30+ orders/day directly through WhatsApp from their new site.',
    metric: '2×',
    metricLabel: 'WhatsApp orders',
    icon: TrendingUp,
  },
  {
    tag: 'AI Automation',
    title: 'Coaching center auto-answers 80% of queries',
    desc: 'Custom AI chatbot trained on course details, fees and timings replies instantly — staff now only handle real leads.',
    metric: '80%',
    metricLabel: 'queries auto-handled',
    icon: Zap,
  },
  {
    tag: 'Real Estate',
    title: 'Property site brings 50+ qualified leads/month',
    desc: 'Listing site with WhatsApp enquiry and gallery turned a local broker’s referral business into a steady inbound pipeline.',
    metric: '50+',
    metricLabel: 'leads/month',
    icon: Users,
  },
];

const CaseStudies = () => (
  <section className="py-16 sm:py-20 bg-secondary/20" id="case-studies">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-accent">
          Real Results
        </span>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          What our work <span className="text-gradient-brand">actually delivers</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
          A few snapshots of how small businesses grew after launching with us.
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3 max-w-6xl mx-auto">
        {cases.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 overflow-hidden hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <span className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider text-muted-foreground">
                  {c.tag}
                </span>
                <c.icon size={18} className="text-primary" aria-hidden="true" />
              </div>
              <div className="mb-5">
                <div className="font-display text-4xl font-black text-gradient-brand leading-none">{c.metric}</div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1.5 font-display font-semibold">
                  {c.metricLabel}
                </div>
              </div>
              <h3 className="font-display text-base font-bold mb-2 leading-snug">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default CaseStudies;
