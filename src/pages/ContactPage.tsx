import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2, Phone, Mail, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', issue: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || !form.issue) {
      setError('Please fill all required fields.');
      return;
    }
    setSending(true);
    const { error: dbError } = await supabase.from('contacts').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      issue: form.issue,
      message: form.message,
    });
    setSending(false);
    if (dbError) { setError('Failed to submit. Please try again.'); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <CheckCircle size={64} className="text-[hsl(var(--price))] mx-auto mb-4" />
        </motion.div>
        <h1 className="font-display text-2xl font-bold mb-2">Inquiry Submitted!</h1>
        <p className="text-muted-foreground mb-6">We'll get back to you shortly. You can also reach us on WhatsApp.</p>
        <a
           href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2CSOLUTION!%20I%20just%20submitted%20a%20contact%20inquiry.%20Looking%20forward%20to%20your%20response!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[hsl(142,70%,45%)] px-6 py-3 text-sm font-bold text-[hsl(0,0%,100%)]"
        >
          <MessageCircle size={18} /> Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="font-display text-3xl font-bold mb-3">Contact <span className="text-gradient-brand">Us</span></h1>
        <p className="text-muted-foreground">Have a question or need help? Fill out the form below.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-xl border border-border bg-card p-6 md:p-8"
      >
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-2 text-sm text-destructive">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name *</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="John Doe"
                required
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="john@example.com"
                required
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+91 9876543210"
                required
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Issue Type *</label>
              <select
                value={form.issue}
                onChange={e => setForm(p => ({ ...p, issue: e.target.value }))}
                required
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select issue type</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Service Request">Service Request</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Billing Issue">Billing Issue</option>
                <option value="Complaint">Complaint</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Message (Optional)</label>
            <textarea
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              placeholder="Describe your issue or question..."
              rows={4}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-lg bg-accent py-3 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02] glow-accent disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Submit Inquiry
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border grid gap-4 md:grid-cols-3">
          <a href="https://web.whatsapp.com/send?phone=919882303030" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors">
            <Phone size={18} className="text-accent" /> 9882303030
          </a>
          <a href="mailto:omharde300@gmail.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors">
            <Mail size={18} className="text-accent" /> omharde300@gmail.com
          </a>
          <a href="https://www.instagram.com/itzomharde_6/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors">
            <MessageCircle size={18} className="text-accent" /> @itzomharde_6
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
