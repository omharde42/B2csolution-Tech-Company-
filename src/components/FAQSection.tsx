import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'How do I place an order?', a: 'Simply browse our services, add items to your cart, and proceed to checkout. You can also reach us directly on WhatsApp for custom requests.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI payments (Google Pay, PhonePe, Paytm). Payment details are shown at checkout.' },
  { q: 'How long does a website take to build?', a: 'A standard website takes 5–10 business days. AI-powered websites can be delivered in 2–3 days. Complex projects may take longer.' },
  { q: 'Do you offer refunds?', a: 'Yes, we offer a full refund if work hasn't started. Partial refunds are available based on completion stage.' },
  { q: 'Can I track my order?', a: 'Yes! After placing an order, you'll receive an Order ID. Use it on the Order Tracking page or ask us on WhatsApp.' },
  { q: 'Do you provide remote support?', a: 'Absolutely. Most software, security, and document services can be handled remotely via screen sharing.' },
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
