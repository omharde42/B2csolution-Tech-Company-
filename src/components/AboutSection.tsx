import { motion } from 'framer-motion';
import { Users, Target, Award, Globe } from 'lucide-react';

const stats = [
  { icon: Users, value: '50+', label: 'Clients Served' },
  { icon: Target, value: '100+', label: 'Projects Delivered' },
  { icon: Award, value: '4.8★', label: 'Avg. Rating' },
  { icon: Globe, value: 'Pan India', label: 'Service Reach' },
];

const AboutSection = () => (
  <section className="py-20" id="about">
    <div className="container mx-auto px-4">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-primary">
            About Us
          </span>
          <h2 className="font-display text-3xl font-bold mb-4">About <span className="text-gradient-brand">B2C Solution</span></h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            B2C Solution is a technology company founded by <strong className="text-foreground">Om Harde</strong>, 
            with <strong className="text-foreground">Raj Bonlawar</strong> as team member. We specialize in web development, 
            app development, AI tools, automation, and complete digital solutions for businesses of all sizes.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Our mission is simple: deliver high-quality, affordable, and innovative technology solutions that help 
            businesses grow and establish a strong digital presence. Every project is built with modern 
            frameworks and industry best practices.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            From custom websites and ecommerce platforms to AI-powered tools and business automation — 
            we are your one-stop technology partner for digital transformation.
          </p>
        </motion.div>

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
