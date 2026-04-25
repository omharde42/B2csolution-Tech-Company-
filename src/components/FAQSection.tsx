import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'How long does it take to get my website?', a: 'Most websites are ready within 2–3 days. Simple one-page sites can even be delivered within 24 hours.' },
  { q: 'How many revisions do I get?', a: 'You get unlimited revisions until you are happy with the design. We work together until it looks exactly right.' },
  { q: 'Will WhatsApp be integrated on my website?', a: 'Yes. Every Business and Advanced package includes a WhatsApp chat button so visitors can message you directly.' },
  { q: 'How do I pay?', a: 'We accept UPI (Google Pay, PhonePe, Paytm). Half payment to start, half on delivery. No extra charges.' },
  { q: 'What do you need from me to start?', a: 'Just your business name, a few photos, and what you want to say. We handle everything else.' },
  { q: "What if I don't like the design?", a: "We revise it for free until you love it. In the rare case you change your mind before work starts, we offer a full refund." },
];

const FAQSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold mb-3">Frequently Asked <span className="text-gradient-brand">Questions</span></h2>
        <p className="text-muted-foreground">Got questions? We've got answers.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border bg-card px-5">
              <AccordionTrigger className="text-sm font-medium text-foreground hover:text-accent hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQSection;
