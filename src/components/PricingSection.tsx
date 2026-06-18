import { motion } from 'framer-motion';
import { Check, MessageCircle } from 'lucide-react';

const waLink = (plan: string) =>
  `https://api.whatsapp.com/send?phone=919882303030&text=${encodeURIComponent(
    `Hi B2C Solution! I'm interested in the ${plan} website plan.`,
  )}`;

const packages = [
  {
    name: 'Basic Website',
    price: 3000,
    tagline: 'Perfect for getting online',
    features: ['1–3 pages', 'Mobile-friendly design', 'Contact form', 'Delivered in 2–3 days'],
    popular: false,
  },
  {
    name: 'Business Website',
    price: 5000,
    tagline: 'Most popular for small businesses',
    features: [
      'Everything in Basic',
      'WhatsApp contact integration',
      'Up to 5 pages',
      'Google-ready setup',
    ],
    popular: true,
  },
  {
    name: 'Advanced',
    price: 8000,
    priceSuffix: '+',
    tagline: 'For businesses ready to scale',
    features: [
      'Everything in Business',
      'Automation features',
      'Custom forms & integrations',
      'Priority support',
    ],
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-secondary/30" id="pricing">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-primary">
            Simple Pricing
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Pick a plan that fits <span className="text-gradient-brand">your business</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            One-time payment. No hidden fees. Pay only when you're happy.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-[1.5px] flex ${
                pkg.popular
                  ? 'bg-gradient-to-br from-accent via-primary to-accent md:scale-[1.04] shadow-[0_20px_60px_-20px_hsl(var(--accent)/0.5)]'
                  : 'bg-border'
              }`}
            >
              <div className="relative w-full rounded-2xl bg-card p-7 flex flex-col">
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-accent to-primary px-4 py-1 text-[10px] font-bold text-accent-foreground uppercase tracking-wider shadow-lg">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-lg font-bold mb-1">{pkg.name}</h3>
                <p className="text-xs text-muted-foreground mb-5">{pkg.tagline}</p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-black text-[hsl(var(--price))]">
                    ₹{pkg.price.toLocaleString()}
                    {pkg.priceSuffix || ''}
                  </span>
                  <span className="text-xs text-muted-foreground">/ one-time</span>
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check size={16} className="text-[hsl(var(--price))] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={waLink(pkg.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all hover:scale-[1.02] ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-accent to-primary text-accent-foreground glow-accent'
                      : 'border border-border text-foreground hover:bg-secondary hover:border-primary/40'
                  }`}
                >
                  <MessageCircle size={14} /> Order on WhatsApp
                </a>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default PricingSection;
