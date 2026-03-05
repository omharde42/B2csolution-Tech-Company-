import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { Globe, Smartphone, Palette, Search, Share2, Video } from 'lucide-react';

const services = [
  { id: 'web-dev', name: 'Web Development', price: 4999, icon: Globe, desc: 'Custom responsive websites built with modern tech stacks.' },
  { id: 'app-dev', name: 'App Development', price: 7999, icon: Smartphone, desc: 'Cross-platform mobile apps for iOS and Android.' },
  { id: 'design', name: 'Graphic Design', price: 1999, icon: Palette, desc: 'Logos, banners, social media creatives and brand kits.' },
  { id: 'seo', name: 'SEO Optimization', price: 2999, icon: Search, desc: 'Boost your search rankings and organic traffic.' },
  { id: 'smm', name: 'Social Media Marketing', price: 3499, icon: Share2, desc: 'Grow your brand with targeted social campaigns.' },
  { id: 'video', name: 'Video Editing', price: 2499, icon: Video, desc: 'Professional editing for YouTube, reels and ads.' },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const { addItem } = useCart();
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:glow-primary"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon size={24} />
      </div>
      <h3 className="font-display text-base font-bold mb-2">{service.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.desc}</p>
      <div className="flex items-center justify-between">
        <span className="font-display text-lg font-bold text-accent">₹{service.price.toLocaleString()}</span>
        <button
          onClick={() => addItem({ id: service.id, name: service.name, price: service.price, description: service.desc })}
          className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-foreground transition-transform hover:scale-105"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

const Services = () => (
  <section className="py-20" id="services">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold mb-3">Our <span className="text-gradient-brand">Services</span></h2>
        <p className="text-muted-foreground">Professional solutions tailored for your business</p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
      </div>
    </div>
  </section>
);

export default Services;
