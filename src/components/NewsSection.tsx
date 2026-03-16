import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, Calendar, Sparkles } from 'lucide-react';

const news = [
  {
    date: 'March 2026',
    badge: '🔥 Highlight',
    title: 'B2CDesigner Launching This Week!',
    excerpt: 'B2C Solution is proud to announce the official launch of B2CDesigner — our dedicated creative design brand for premium Canva templates, Shopify & Printify products.',
    highlight: true,
  },
  {
    date: 'March 2026',
    badge: 'New',
    title: 'New Product Categories Added',
    excerpt: 'We\'ve expanded our collection with hoodies, tote bags, and premium sticker packs. Check out the latest designs!',
    highlight: false,
  },
  {
    date: 'March 2026',
    badge: 'Update',
    title: 'Custom Design Service Now Live',
    excerpt: 'Want your own unique design on a product? Our custom design service is now live. Share your idea and we\'ll create it!',
    highlight: false,
  },
];

const NewsSection = () => (
  <section className="py-16 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Newspaper size={24} />
        </div>
        <h2 className="font-display text-3xl font-bold mb-3">Latest <span className="text-gradient-brand">News</span></h2>
        <p className="text-muted-foreground">Stay updated with B2C Solution</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {news.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl border p-6 transition-all ${
              item.highlight
                ? 'border-accent/50 bg-accent/5 shadow-[0_0_30px_hsl(0,78%,55%,0.1)] md:col-span-3 md:flex md:items-center md:gap-8'
                : 'border-border bg-card hover:border-primary/30'
            }`}
          >
            {item.highlight && (
              <div className="shrink-0 mb-4 md:mb-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Sparkles size={36} />
                </div>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  item.highlight
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'bg-primary/10 text-primary border border-primary/20'
                }`}>
                  {item.badge}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar size={10} /> {item.date}
                </span>
              </div>
              <h3 className={`font-display font-bold mb-2 ${item.highlight ? 'text-xl md:text-2xl' : 'text-sm'}`}>
                {item.title}
              </h3>
              <p className={`text-muted-foreground leading-relaxed ${item.highlight ? 'text-sm' : 'text-xs'}`}>
                {item.excerpt}
              </p>
            </div>
            {item.highlight && (
              <div className="mt-4 md:mt-0 shrink-0">
                <div className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-display text-xs font-bold text-accent-foreground glow-accent">
                  <TrendingUp size={14} /> Launching Soon
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default NewsSection;
