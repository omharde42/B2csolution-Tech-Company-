import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  { name: 'Arjun P.', rating: 5, text: 'Incredible service! B2CSOLUTION delivered my website ahead of schedule with outstanding quality.', service: 'Web Development' },
  { name: 'Sneha M.', rating: 5, text: 'The SEO optimization doubled our traffic in 2 months. Highly recommend their digital marketing team!', service: 'SEO' },
  { name: 'Rahul K.', rating: 4, text: 'Great graphic design work. The logo and branding they created perfectly represents our business.', service: 'Graphic Design' },
  { name: 'Priya S.', rating: 5, text: 'Professional video editing for our YouTube channel. Quick turnaround and amazing results!', service: 'Video Editing' },
  { name: 'Vikram D.', rating: 5, text: 'The app they built works flawlessly. Communication was excellent throughout the project.', service: 'App Development' },
  { name: 'Anita R.', rating: 4, text: 'Social media management has been a game-changer for our brand visibility. Great team!', service: 'Social Media' },
];

const Reviews = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold mb-3">Customer <span className="text-gradient-brand">Reviews</span></h2>
        <p className="text-muted-foreground">What our clients say about us</p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:glow-primary"
          >
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }, (_, j) => (
                <Star key={j} size={14} className={j < r.rating ? 'fill-accent text-accent' : 'text-muted-foreground'} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{r.text}"</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{r.name}</span>
              <span className="text-xs text-accent">{r.service}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
