/**
 * AdminTelegramLeads — Table of all Telegram bot captured leads
 * with status management and expanded requirement view.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Phone, Mail, Globe, Bot, Calendar, DollarSign } from 'lucide-react';

interface TelegramLead {
  id: string;
  telegram_user_id: number;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  service: string;
  service_subtype: string | null;
  budget_range: string | null;
  deadline: string | null;
  requirements: Record<string, unknown>;
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'lost';
  admin_notes: string | null;
  created_at: string;
}

interface Props {
  leads: TelegramLead[];
  onStatusUpdate: (leadId: string, status: string) => void;
}

const SERVICE_LABELS: Record<string, string> = {
  website: '🌐 Website',
  mobile_app: '📱 Mobile App',
  ai_chatbot: '🤖 AI Chatbot',
  ui_design: '🎨 UI/UX Design',
  automation: '⚡ Automation',
  database: '🗄 Database',
};

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  contacted: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  quoted: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  converted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  lost: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const AdminTelegramLeads = ({ leads, onStatusUpdate }: Props) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center">
        <Bot size={40} className="mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-muted-foreground font-medium">No Telegram leads yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Leads will appear here when customers complete the bot's requirement flow
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {leads.map((lead, i) => (
        <motion.div
          key={lead.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30"
        >
          {/* Main Row */}
          <div className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              {/* Service Badge */}
              <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary shrink-0">
                {SERVICE_LABELS[lead.service] ?? lead.service}
              </span>

              {/* Customer Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {lead.customer_name ?? `User #${lead.telegram_user_id}`}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                  {lead.customer_phone && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Phone size={9} /> {lead.customer_phone}
                    </span>
                  )}
                  {lead.customer_email && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Mail size={9} /> {lead.customer_email}
                    </span>
                  )}
                  {lead.service_subtype && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Globe size={9} /> {lead.service_subtype}
                    </span>
                  )}
                </div>
              </div>

              {/* Budget + Deadline */}
              <div className="flex gap-3 sm:gap-4 shrink-0 text-xs text-muted-foreground">
                {lead.budget_range && (
                  <span className="flex items-center gap-1">
                    <DollarSign size={11} /> {lead.budget_range}
                  </span>
                )}
                {lead.deadline && (
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {lead.deadline}
                  </span>
                )}
              </div>

              {/* Status Selector */}
              <select
                value={lead.status}
                onChange={(e) => onStatusUpdate(lead.id, e.target.value)}
                className={`rounded-lg border px-2 py-1 text-[11px] font-semibold bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40 shrink-0 ${STATUS_STYLES[lead.status]}`}
              >
                <option value="new">🔵 New</option>
                <option value="contacted">🟡 Contacted</option>
                <option value="quoted">🟣 Quoted</option>
                <option value="converted">🟢 Converted</option>
                <option value="lost">🔴 Lost</option>
              </select>

              {/* Timestamp */}
              <span className="text-[10px] text-muted-foreground shrink-0">
                {new Date(lead.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short',
                })}
              </span>

              {/* Expand Button */}
              <button
                onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground shrink-0"
                aria-label="Toggle details"
              >
                {expanded === lead.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          </div>

          {/* Expanded Requirements */}
          <AnimatePresence>
            {expanded === lead.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-border"
              >
                <div className="p-3 sm:p-4 bg-secondary/30">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Collected Requirements
                  </p>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {Object.entries(lead.requirements)
                      .filter(([k]) => !['service'].includes(k))
                      .map(([key, value]) => (
                        <div key={key} className="flex gap-2 text-xs">
                          <span className="text-muted-foreground capitalize min-w-[100px]">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="text-foreground font-medium">
                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* WhatsApp Quick Action */}
                  {lead.customer_phone && (
                    <a
                      href={`https://wa.me/${lead.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hi ${lead.customer_name ?? ''}! I'm from B2CSolution. I received your request for ${SERVICE_LABELS[lead.service]} via our Telegram bot. Let me know a good time to discuss!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 text-xs font-semibold hover:bg-[#25D366]/20 transition-colors"
                    >
                      💬 Follow up on WhatsApp
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminTelegramLeads;
