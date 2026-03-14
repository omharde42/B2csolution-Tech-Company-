import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const packages = [
  {
    name: 'Starter',
    price: 500,
    desc: 'Essential services for individuals',
    features: ['Windows/Linux Installation', 'Virus Removal', 'Software Installation', 'Basic PC Optimization', 'Email Support'],
    popular: false,
  },
  {
    name: 'Professional',
    price: 4999,
    desc: 'Complete solutions for businesses',
    features: ['Custom Website Development', 'Full Security Suite', 'Data Recovery', 'Printer & WiFi Setup', 'Priority WhatsApp Support'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 9999,
    desc: 'All-inclusive business package',
    features: ['AI Website Builder + Custom Dev', 'App Development', 'Full Hardware Support', 'SEO & Social Media', 'Dedicated Account Manager'],
    popular: false,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold mb-3">Our <span className="text-gradient-brand">Packages</span></h2>
          <p className="text-muted-foreground">Choose the plan that fits your needs. All prices are starting from.</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border p-6 flex flex-col ${pkg.popular ? 'border-accent bg-card glow-accent relative' : 'border-border bg-card'}`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-[10px] font-bold text-accent-foreground uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-bold mb-1">{pkg.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{pkg.desc}</p>
              <div className="mb-6">
                <span className="font-display text-3xl font-black text-[hsl(var(--price))]">₹{pkg.price.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground ml-1">onwards</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {pkg.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check size={14} className="text-[hsl(var(--price))] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/services')}
                className={`w-full rounded-lg py-2.5 text-xs font-bold transition-transform hover:scale-[1.02] ${pkg.popular ? 'bg-accent text-accent-foreground glow-accent' : 'border border-border text-foreground hover:bg-secondary'}`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
