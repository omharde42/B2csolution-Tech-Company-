import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { Globe, Smartphone, Palette, Search, Share2, Video, Monitor, Shield, HardDrive, Wrench, Printer, Wifi, Package, Mail, Gauge, FileText, Bot, Presentation, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';

interface ServiceTier {
  label: string;
  price: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
  icon: any;
  desc: string;
  category: string;
  tiers?: ServiceTier[];
}

const services: Service[] = [
  // Digital Services
  { id: 'web-dev', name: 'Web Development', price: 4999, icon: Globe, desc: 'Custom responsive websites built with modern tech stacks.', category: 'Digital' },
  { id: 'app-dev', name: 'App Development', price: 7999, icon: Smartphone, desc: 'Cross-platform mobile apps for iOS and Android.', category: 'Digital' },
  { id: 'design', name: 'Graphic Design', price: 1999, icon: Palette, desc: 'Logos, banners, social media creatives and brand kits.', category: 'Digital' },
  { id: 'seo', name: 'SEO Optimization', price: 2999, icon: Search, desc: 'Boost your search rankings and organic traffic.', category: 'Digital' },
  { id: 'smm', name: 'Social Media Marketing', price: 3499, icon: Share2, desc: 'Grow your brand with targeted social campaigns.', category: 'Digital' },
  { id: 'video', name: 'Video Editing', price: 2499, icon: Video, desc: 'Professional editing for YouTube, reels and ads.', category: 'Digital' },
  { id: 'ai-website', name: 'AI Website Builder', price: 2540, icon: Bot, desc: 'AI-powered website creation starting from ₹2540.', category: 'Digital' },
  // Document Services
  { id: 'typewriting', name: 'Typewriting', price: 300, icon: FileText, desc: 'Professional typewriting services.', category: 'Documents', tiers: [{ label: '10 pages', price: 300 }, { label: '20 pages', price: 600 }] },
  { id: 'ppt-making', name: 'PPT Making', price: 450, icon: Presentation, desc: 'Professional presentations starting ₹450 for 10 slides.', category: 'Documents', tiers: [{ label: '10 slides', price: 450 }, { label: '20 slides', price: 800 }] },
  { id: 'pdf-to-excel', name: 'PDF to Excel', price: 45, icon: FileSpreadsheet, desc: 'Standard PDF to Excel conversion — ₹45/page.', category: 'Documents' },
  // OS Installation
  { id: 'win-install', name: 'Windows Installation', price: 500, icon: Monitor, desc: 'Fresh Windows 10/11 installation with drivers.', category: 'OS Installation' },
  { id: 'linux-install', name: 'Linux Installation', price: 400, icon: Monitor, desc: 'Ubuntu/Fedora installation and setup.', category: 'OS Installation' },
  // Security
  { id: 'virus-removal', name: 'Virus Removal', price: 300, icon: Shield, desc: 'Complete malware and virus cleanup.', category: 'Security' },
  { id: 'antivirus-setup', name: 'Antivirus Setup', price: 200, icon: Shield, desc: 'Premium antivirus installation and configuration.', category: 'Security' },
  // Data & Hardware
  { id: 'data-recovery', name: 'Data Recovery', price: 800, icon: HardDrive, desc: 'Recover lost files from damaged drives.', category: 'Hardware' },
  { id: 'laptop-repair', name: 'Laptop Repair', price: 600, icon: Wrench, desc: 'Hardware diagnosis and repair.', category: 'Hardware' },
  { id: 'printer-setup', name: 'Printer Setup', price: 200, icon: Printer, desc: 'Printer installation and troubleshooting.', category: 'Hardware' },
  // Networking & Software
  { id: 'wifi-setup', name: 'WiFi Setup', price: 250, icon: Wifi, desc: 'Router configuration and network setup.', category: 'Networking' },
  { id: 'software-install', name: 'Software Installation', price: 150, icon: Package, desc: 'Install and configure any software.', category: 'Software' },
  { id: 'email-setup', name: 'Email Setup', price: 200, icon: Mail, desc: 'Configure email clients and accounts.', category: 'Software' },
  { id: 'pc-optimization', name: 'PC Optimization', price: 350, icon: Gauge, desc: 'Speed up your slow computer.', category: 'Maintenance' },
];

const categories = [...new Set(services.map(s => s.category))];

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
  const { addItem } = useCart();
  const Icon = service.icon;
  const [selectedTier, setSelectedTier] = useState(0);
  const currentPrice = service.tiers ? service.tiers[selectedTier].price : service.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:glow-primary"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon size={24} />
      </div>
      <h3 className="font-display text-base font-bold mb-2">{service.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.desc}</p>
      {service.tiers && (
        <div className="flex gap-2 mb-3">
          {service.tiers.map((tier, i) => (
            <button
              key={tier.label}
              onClick={() => setSelectedTier(i)}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${selectedTier === i ? 'border-[hsl(var(--price))] bg-[hsl(var(--price)/0.1)] text-[hsl(var(--price))]' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="font-display text-lg font-bold text-[hsl(var(--price))]">₹{currentPrice.toLocaleString()}</span>
        <button
          onClick={() => addItem({ id: service.tiers ? `${service.id}-${service.tiers[selectedTier].label}` : service.id, name: service.tiers ? `${service.name} (${service.tiers[selectedTier].label})` : service.name, price: currentPrice, description: service.desc })}
          className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-foreground transition-transform hover:scale-105"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

const Services = ({ showAll = false }: { showAll?: boolean }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const displayed = showAll ? services : services.slice(0, 6);
  const filtered = activeCategory ? displayed.filter(s => s.category === activeCategory) : displayed;

  return (
    <section className="py-20" id="services">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold mb-3">Our <span className="text-gradient-brand">Services</span></h2>
          <p className="text-muted-foreground">Professional solutions tailored for your business</p>
        </motion.div>
        {showAll && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button onClick={() => setActiveCategory(null)} className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${!activeCategory ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'}`}>All</button>
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${activeCategory === c ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'}`}>{c}</button>
            ))}
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
        </div>
        {!showAll && (
          <div className="text-center mt-8">
            <a href="/services" className="rounded-lg border border-border px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary inline-block">View All Services</a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
