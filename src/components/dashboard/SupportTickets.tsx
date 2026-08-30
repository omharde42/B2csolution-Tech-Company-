import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, LifeBuoy, Plus, Send, ChevronDown, ChevronUp } from 'lucide-react';

interface Ticket {
  id: string;
  ticket_no: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  order_id: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-accent/10 text-accent border-accent/30',
  in_progress: 'bg-primary/10 text-primary border-primary/30',
  resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  closed: 'bg-secondary text-muted-foreground border-border',
};

const SupportTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [reply, setReply] = useState('');
  const [form, setForm] = useState({ subject: '', description: '', category: 'general', priority: 'normal', order_id: '' });

  const loadTickets = async () => {
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    setTickets((data as Ticket[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadTickets();
  }, [user]);

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.subject.trim() || !form.description.trim()) return;
    setCreating(true);
    const { error } = await supabase.from('support_tickets').insert({
      user_id: user.id,
      subject: form.subject.trim(),
      description: form.description.trim(),
      category: form.category,
      priority: form.priority,
      order_id: form.order_id.trim() || null,
    });
    setCreating(false);
    if (!error) {
      setForm({ subject: '', description: '', category: 'general', priority: 'normal', order_id: '' });
      setShowForm(false);
      loadTickets();
    }
  };

  const toggle = async (id: string) => {
    if (expanded === id) return setExpanded(null);
    setExpanded(id);
    if (!messages[id]) {
      const { data } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true });
      setMessages((prev) => ({ ...prev, [id]: data || [] }));
    }
  };

  const sendReply = async (ticketId: string) => {
    if (!user || !reply.trim()) return;
    const body = reply.trim();
    setReply('');
    const { data } = await supabase
      .from('ticket_messages')
      .insert({ ticket_id: ticketId, user_id: user.id, author_role: 'user', body })
      .select()
      .single();
    if (data) setMessages((prev) => ({ ...prev, [ticketId]: [...(prev[ticketId] || []), data] }));
    await supabase.from('support_tickets').update({ status: 'open' }).eq('id', ticketId);
    loadTickets();
  };

  const updateStatus = async (ticketId: string, status: string) => {
    await supabase.from('support_tickets').update({ status }).eq('id', ticketId);
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status } : t)));
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" size={28} /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LifeBuoy size={18} className="text-accent" />
          <h2 className="font-display text-lg font-semibold">Support Tickets</h2>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-foreground hover:opacity-90"
        >
          <Plus size={13} /> New ticket
        </button>
      </div>

      {showForm && (
        <form onSubmit={createTicket} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Subject"
            required
            className="w-full rounded-lg bg-secondary border border-border px-3 py-2 text-sm"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your issue…"
            required
            rows={4}
            className="w-full rounded-lg bg-secondary border border-border px-3 py-2 text-sm"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-lg bg-secondary border border-border px-3 py-2 text-sm"
            >
              <option value="general">General</option>
              <option value="order">Order</option>
              <option value="payment">Payment</option>
              <option value="technical">Technical</option>
            </select>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="rounded-lg bg-secondary border border-border px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            <input
              value={form.order_id}
              onChange={(e) => setForm({ ...form, order_id: e.target.value })}
              placeholder="Order ID (optional)"
              className="rounded-lg bg-secondary border border-border px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {creating ? 'Creating…' : 'Create ticket'}
          </button>
        </form>
      )}

      {tickets.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No support tickets yet. Create one above or from the chatbot.
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button onClick={() => toggle(t.id)} className="w-full text-left p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{t.ticket_no}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[t.status] || STATUS_STYLES.open}`}>
                      {t.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">{t.priority} priority</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-foreground truncate">{t.subject}</p>
                  <p className="text-[11px] text-muted-foreground">Updated {new Date(t.updated_at).toLocaleString()}</p>
                </div>
                {expanded === t.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {expanded === t.id && (
                <div className="border-t border-border p-4 space-y-3">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{t.description}</p>

                  <div className="space-y-2">
                    {(messages[t.id] || []).map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-lg px-3 py-2 text-sm ${
                          m.author_role === 'user' ? 'bg-primary/10 text-foreground' : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">
                          {m.author_role === 'user' ? 'You' : 'Support'}
                        </p>
                        {m.body}
                      </div>
                    ))}
                  </div>

                  {t.status !== 'closed' && (
                    <div className="flex gap-2">
                      <input
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Add a reply…"
                        className="flex-1 rounded-lg bg-secondary border border-border px-3 py-2 text-sm"
                      />
                      <button
                        onClick={() => sendReply(t.id)}
                        aria-label="Send reply"
                        className="rounded-lg bg-accent px-3 text-accent-foreground"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {t.status !== 'closed' ? (
                      <button
                        onClick={() => updateStatus(t.id, 'closed')}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                      >
                        Close ticket
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(t.id, 'open')}
                        className="rounded-lg border border-accent/30 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10"
                      >
                        Reopen ticket
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
