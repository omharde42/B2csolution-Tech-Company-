import { motion } from 'framer-motion';
import { Palette, Truck, BadgeCheck, IndianRupee, Headphones, Repeat } from 'lucide-react';

const reasons = [
  { icon: Palette, title: 'Premium Designs', desc: 'Unique, eye-catching designs created by professional artists for every style.' },
  { icon: BadgeCheck, title: 'Top Quality Prints', desc: 'Durable, fade-resistant prints using industry-leading DTG and sublimation tech.' },
  { icon: IndianRupee, title: 'Affordable Pricing', desc: 'Competitive prices without compromising on quality. Starting from just ₹149.' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Quick processing and nationwide shipping. Get your orders within 5-7 days.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Reach us anytime via WhatsApp for queries, custom orders, or tracking.' },
  { icon: Repeat, title: 'Easy Returns', desc: 'Not satisfied? We offer hassle-free returns and exchanges within 7 days.' },
];

const WhyChooseUs = () => (
  <section className="py-20 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold mb-3">Why Choose <span className="text-gradient-brand">B2C Solution</span></h2>
        <p className="text-muted-foreground max-w-lg mx-auto">We combine creative design with premium quality to deliver merchandise you'll love.</p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group flex gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:glow-primary"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <r.icon size={22} />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold mb-1">{r.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
