import { motion } from 'framer-motion';
import { Globe, Smartphone, Bot, BarChart3, Layers, Code2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  { icon: Globe, title: 'Website Development', desc: 'Modern responsive websites for businesses, startups, and brands built with cutting-edge frameworks.', tag: 'Popular' },
  { icon: Smartphone, title: 'Ecommerce Development', desc: 'Full-featured online stores and digital selling platforms with payment integration.', tag: 'Hot' },
  { icon: Bot, title: 'AI Tool Development', desc: 'Custom AI tools, chatbots, and intelligent automation systems for your business.', tag: 'New' },
  { icon: BarChart3, title: 'Web Applications', desc: 'Dashboards, SaaS tools, CRM systems, and custom business management platforms.' },
  { icon: Layers, title: 'Automation Solutions', desc: 'Streamline business workflows with smart integrations and process automation.' },
  { icon: Code2, title: 'Custom Software', desc: 'Tailored software solutions designed to solve your unique business challenges.' },
];

const BestSellers = () => (
  <section className="py-20" id="services-overview">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-primary">
          What We Build
        </span>
        <h2 className="font-display text-3xl font-bold mb-3">Our <span className="text-gradient-brand">Services</span></h2>
        <p className="text-muted-foreground max-w-md mx-auto">Professional digital solutions to grow your business and establish a powerful online presence.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
          >
            {s.tag && (
              <span className="absolute right-4 top-4 rounded-full bg-accent/10 border border-accent/30 px-3 py-0.5 text-[10px] font-bold text-accent">
                {s.tag}
              </span>
            )}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <s.icon size={26} />
            </div>
            <h3 className="font-display text-base font-bold mb-2">{s.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/services" className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3 font-display text-sm font-bold text-foreground transition-colors hover:bg-secondary">
          View All Services <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </section>
);

export default BestSellers;
