import { motion } from 'framer-motion';
import { Instagram, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const ContactSocial = () => (
  <section className="py-20 bg-secondary/30" id="contact-social">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold mb-3">Get In <span className="text-gradient-brand">Touch</span></h2>
        <p className="text-muted-foreground">We'd love to hear from you. Reach out anytime!</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Phone, title: 'Call / WhatsApp', value: '+91 98823 03030', href: 'https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!' },
          { icon: Mail, title: 'Email', value: 'b2csolution2436@gmail.com', href: 'mailto:b2csolution2436@gmail.com' },
          { icon: Instagram, title: 'Instagram', value: '@itzomharde_6', href: 'https://www.instagram.com/itzomharde_6/' },
          { icon: MapPin, title: 'Location', value: 'India', href: '#' },
        ].map((c, i) => (
          <motion.a
            key={c.title}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:glow-primary"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <c.icon size={22} />
            </div>
            <h3 className="font-display text-xs font-bold mb-1">{c.title}</h3>
            <span className="text-sm text-muted-foreground">{c.value}</span>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default ContactSocial;
