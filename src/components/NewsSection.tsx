import { motion } from 'framer-motion';
import { Newspaper, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';

const NewsSection = () => {
  const { items, loading } = useNews();

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Newspaper size={24} />
          </div>
          <h2 className="font-display text-3xl font-bold mb-3">Latest <span className="text-gradient-brand">News</span></h2>
          <p className="text-muted-foreground">Stay updated with B2C Solution</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" size={26} /></div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No updates published yet — check back soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {items.map((item, i) => (
              <motion.article
                key={item.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                    {item.badge}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar size={10} /> {item.date}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{item.excerpt}</p>
                <Link
                  to={`/news/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md w-fit"
                  aria-label={`Read full update: ${item.title}`}
                >
                  Read full update <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
