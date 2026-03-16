import { motion } from 'framer-motion';
import { Paintbrush, Upload, MessageCircle, Sparkles } from 'lucide-react';

const steps = [
  { icon: MessageCircle, step: '01', title: 'Share Your Idea', desc: 'Tell us your design concept via WhatsApp or our contact form.' },
  { icon: Upload, step: '02', title: 'We Create Mockup', desc: 'Our designers create a professional mockup for your approval.' },
  { icon: Paintbrush, step: '03', title: 'Finalize Design', desc: 'Review, request changes, and approve the final design.' },
  { icon: Sparkles, step: '04', title: 'Receive Product', desc: 'We print and deliver your custom merchandise to your door.' },
];

const CustomDesignService = () => (
  <section className="py-20" id="custom-design">
    <div className="container mx-auto px-4">
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-card via-card to-accent/5 p-8 md:p-14">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-accent">
            Custom Orders
          </span>
          <h2 className="font-display text-3xl font-bold mb-3">Your Design, <span className="text-gradient-brand">Your Product</span></h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Got a unique idea? We'll bring it to life on any product — T-shirts, mugs, hoodies, phone cases, and more.</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <s.icon size={28} />
              </div>
              <span className="font-display text-xs font-bold text-primary tracking-widest">STEP {s.step}</span>
              <h3 className="font-display text-sm font-bold mt-2 mb-2">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8 border-t border-dashed border-border" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!%20I%20want%20to%20place%20a%20custom%20design%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-105 glow-accent"
          >
            <MessageCircle size={16} /> Request Custom Design
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default CustomDesignService;
