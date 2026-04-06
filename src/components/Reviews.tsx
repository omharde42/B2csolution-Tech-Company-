import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  { name: 'Arjun P.', rating: 5, text: 'B2C Solution built our company website from scratch. The design is modern, fast, and mobile-friendly. Highly professional team!', service: 'Website Development' },
  { name: 'Priya S.', rating: 5, text: 'They developed a custom dashboard for our business operations. Clean UI, fast delivery, and great communication throughout.', service: 'Web Application' },
  { name: 'Rahul K.', rating: 4, text: 'Got our ecommerce store set up with payment integration. Everything works smoothly. Will hire again for future projects.', service: 'Ecommerce Development' },
  { name: 'Anita R.', rating: 5, text: 'Amazing AI chatbot integration for our customer support. Reduced our response time by 80%. Worth every rupee!', service: 'AI Tool Development' },
  { name: 'Vikram D.', rating: 5, text: 'Professional website with SEO optimization. Our organic traffic increased 3x within two months. Excellent work!', service: 'Website + SEO' },
  { name: 'Sneha M.', rating: 4, text: 'They automated our entire invoicing workflow. What used to take hours now happens automatically. Great technical skills!', service: 'Automation Solution' },
];

const Reviews = () => (
  <section className="py-20" id="reviews">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-primary">
          Testimonials
        </span>
        <h2 className="font-display text-3xl font-bold mb-3">Client <span className="text-gradient-brand">Reviews</span></h2>
        <p className="text-muted-foreground">See what our clients are saying about our work</p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:glow-primary"
          >
            <Quote size={20} className="text-primary/30 mb-3" />
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{r.text}"</p>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }, (_, j) => (
                <Star key={j} size={12} className={j < r.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'} />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{r.name}</span>
              <span className="rounded-full bg-secondary px-3 py-0.5 text-[10px] font-medium text-muted-foreground">{r.service}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
