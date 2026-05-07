import { motion } from 'framer-motion';
import { Star, Quote, BadgeCheck, Users, Briefcase, Clock } from 'lucide-react';

const reviews = [
  { name: 'Arjun Patel', city: 'Ahmedabad', rating: 5, date: 'Mar 2026', text: 'B2C Solution built our company website from scratch. The design is modern, fast, and mobile-friendly. Delivered in 3 days as promised.', service: 'Business Website' },
  { name: 'Priya Sharma', city: 'Pune', rating: 5, date: 'Feb 2026', text: 'They developed a custom dashboard for our internal operations. Clean UI, fast delivery, and great communication on WhatsApp throughout.', service: 'Web Application' },
  { name: 'Rahul Khanna', city: 'Delhi', rating: 4, date: 'Feb 2026', text: 'Got our ecommerce store set up with UPI + Razorpay integration. Everything works smoothly. Will hire again for the next phase.', service: 'Ecommerce Store' },
  { name: 'Anita Reddy', city: 'Hyderabad', rating: 5, date: 'Jan 2026', text: 'Amazing AI chatbot integration for customer support. Cut our response time by ~80%. Worth every rupee at this price.', service: 'AI Chatbot' },
  { name: 'Vikram Desai', city: 'Mumbai', rating: 5, date: 'Jan 2026', text: 'Professional website with on-page SEO. Our organic traffic grew 3x within two months. Genuinely good work.', service: 'Website + SEO' },
  { name: 'Sneha Mehta', city: 'Bengaluru', rating: 4, date: 'Dec 2025', text: 'Automated our entire invoicing workflow. What used to take hours now happens automatically. Strong technical skills.', service: 'Automation' },
];

const stats = [
  { icon: Briefcase, value: '120+', label: 'Projects delivered' },
  { icon: Users, value: '90+', label: 'Happy clients' },
  { icon: Star, value: '4.8/5', label: 'Average rating' },
  { icon: Clock, value: '2–3 days', label: 'Avg. delivery' },
];

const Reviews = () => (
  <section className="py-16 sm:py-20" id="reviews">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-12">
        <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-primary">
          Verified Testimonials
        </span>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          Trusted by <span className="text-gradient-brand">small businesses</span> across India
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          Real feedback from founders, store owners, and teams we've shipped projects for.
        </p>
      </motion.div>

      {/* Trust stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10 sm:mb-14">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-border bg-card p-4 sm:p-5 text-center"
          >
            <s.icon size={18} className="text-accent mx-auto mb-2" />
            <p className="font-display text-lg sm:text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="flex flex-col rounded-xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary/30 hover:glow-primary"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, j) => (
                  <Star key={j} size={13} className={j < r.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'} />
                ))}
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--price))]/10 px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--price))]">
                <BadgeCheck size={11} /> Verified
              </span>
            </div>
            <Quote size={18} className="text-primary/30 mb-2" />
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">"{r.text}"</p>
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{r.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{r.city} · {r.date}</p>
              </div>
              <span className="shrink-0 ml-2 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">{r.service}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
