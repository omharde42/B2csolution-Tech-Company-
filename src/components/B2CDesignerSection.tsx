import { motion } from 'framer-motion';
import { Palette, ExternalLink, Sparkles } from 'lucide-react';
import b2cDesignerLogo from '@/assets/b2cdesigner-logo.png';

const B2CDesignerSection = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-accent/30 bg-gradient-to-br from-card via-card to-accent/5 p-8 md:p-12 overflow-hidden relative"
      >
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="shrink-0"
          >
            <img
              src={b2cDesignerLogo}
              alt="B2CDesigner - Creative Design Company"
              className="w-48 md:w-56 rounded-xl shadow-lg hover:shadow-accent/20 transition-shadow duration-300"
              loading="lazy"
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Sparkles size={18} className="text-accent" />
              <span className="text-xs font-display font-bold text-accent uppercase tracking-widest">New Venture</span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
              Introducing <span className="text-gradient-brand">B2CDesigner</span>
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-lg">
              A creative design company by B2CSOLUTION — specializing in premium Canva templates, 
              custom design assets, and ready-to-sell products on Shopify & Printify. 
              From social media templates to brand kits, we design it all.
            </p>

            <div className="flex flex-wrap gap-2 mb-5 justify-center md:justify-start">
              {['Canva Templates', 'Shopify Products', 'Printify Merch', 'Brand Kits', 'Social Media'].map(tag => (
                <span key={tag} className="rounded-full bg-secondary border border-border px-3 py-1 text-[10px] font-semibold text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/30 px-4 py-2">
                <Palette size={16} className="text-accent" />
                <span className="text-xs font-display font-bold text-accent">Website Coming Soon</span>
              </div>
              <span className="text-xs text-muted-foreground italic">Link will be available shortly</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default B2CDesignerSection;
