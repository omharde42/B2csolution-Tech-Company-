import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  { name: 'Arjun P.', rating: 5, text: 'The T-shirt quality is amazing! Colors are vibrant and the print hasn\'t faded even after multiple washes. Will definitely order again.', product: 'Geometric T-Shirt' },
  { name: 'Priya S.', rating: 5, text: 'Ordered a custom mug as a birthday gift. The design was exactly what I wanted, and it was delivered on time. Excellent service!', product: 'Custom Mug' },
  { name: 'Rahul K.', rating: 4, text: 'Great hoodie quality! The print is clean and the fabric is comfortable. Slightly delayed shipping but worth the wait.', product: 'Street Art Hoodie' },
  { name: 'Anita R.', rating: 5, text: 'Love my phone case! The design is gorgeous and it fits perfectly. B2C Solution has the best custom designs at affordable prices.', product: 'Phoenix Phone Case' },
  { name: 'Vikram D.', rating: 5, text: 'Ordered sticker packs for my laptop — absolutely love them! High quality vinyl, waterproof, and the designs are so cool.', product: 'Sticker Pack' },
  { name: 'Sneha M.', rating: 4, text: 'The tote bag is perfect for daily use. Sturdy material and the art print makes it stand out. Great value for money!', product: 'Splash Art Tote' },
];

const Reviews = () => (
  <section className="py-20" id="reviews">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-primary">
          Testimonials
        </span>
        <h2 className="font-display text-3xl font-bold mb-3">Customer <span className="text-gradient-brand">Reviews</span></h2>
        <p className="text-muted-foreground">See what our customers are saying about their purchases</p>
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
              <span className="rounded-full bg-secondary px-3 py-0.5 text-[10px] font-medium text-muted-foreground">{r.product}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
