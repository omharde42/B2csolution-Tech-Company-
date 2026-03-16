import { motion } from 'framer-motion';
import { Users, Target, Award, Globe } from 'lucide-react';

const stats = [
  { icon: Users, value: '500+', label: 'Happy Customers' },
  { icon: Target, value: '1000+', label: 'Products Sold' },
  { icon: Award, value: '4.8★', label: 'Avg. Rating' },
  { icon: Globe, value: 'Pan India', label: 'Delivery' },
];

const AboutSection = () => (
  <section className="py-20" id="about">
    <div className="container mx-auto px-4">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        {/* Content */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-primary">
            About Us
          </span>
          <h2 className="font-display text-3xl font-bold mb-4">About <span className="text-gradient-brand">B2C Solution</span></h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            B2C Solution is a creative design and e-commerce brand founded by <strong className="text-foreground">Om Harde</strong>, 
            with <strong className="text-foreground">Raj Bonlawar</strong> as partner. We specialize in premium custom merchandise — 
            from T-shirts and hoodies to mugs and phone cases.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Our mission is simple: deliver high-quality, affordable, and creatively designed products that help you express your unique style. 
            Every product is made with care, using premium materials and cutting-edge printing technology.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We also offer digital services including web development, graphic design, and custom branding solutions — 
            making us your one-stop shop for all creative needs.
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:glow-primary"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon size={22} />
                </div>
                <div className="font-display text-2xl font-black text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
