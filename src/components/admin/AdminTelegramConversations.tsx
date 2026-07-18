/**
 * AdminTelegramConversations — View full bot conversation histories
 * with message bubbles, user details, and status management.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, ChevronDown, ChevronUp, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface TelegramConversation {
  id: string;
  telegram_user_id: number;
  status: 'active' | 'handed_off' | 'closed';
  service_interest: string | null;
  message_count: number;
  started_at: string;
  updated_at: string;
  telegram_users?: {
    username: string | null;
    first_name: string;
    last_name: string | null;
  };
}

interface TelegramMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  message_type: string;
  created_at: string;
}

interface Props {
  conversations: TelegramConversation[];
  messages: Record<string, TelegramMessage[]>; // keyed by conversation_id
  onLoadMessages: (conversationId: string) => void;
}

const STATUS_CONFIG = {
  active: { label: 'Active', icon: CheckCircle, class: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  handed_off: { label: 'Handed Off', icon: AlertCircle, class: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  closed: { label: 'Closed', icon: Clock, class: 'text-muted-foreground bg-secondary border-border' },
};

const AdminTelegramConversations = ({ conversations, messages, onLoadMessages }: Props) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (convId: string) => {
    if (expanded === convId) {
      setExpanded(null);
    } else {
      setExpanded(convId);
      if (!messages[convId]) {
        onLoadMessages(convId);
      }
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center">
        <MessageSquare size={40} className="mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-muted-foreground font-medium">No conversations yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Conversations will appear here once users start chatting with the Telegram bot
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {conversations.map((conv, i) => {
        const user = conv.telegram_users;
        const displayName = user
          ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
          : `User #${conv.telegram_user_id}`;
        const username = user?.username ? `@${user.username}` : null;
        const statusCfg = STATUS_CONFIG[conv.status] ?? STATUS_CONFIG.active;
        const convMessages = messages[conv.id] ?? [];

        return (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all"
          >
            {/* Header Row */}
            <div
              className="flex items-center gap-3 p-3 sm:p-4 cursor-pointer"
              onClick={() => toggleExpand(conv.id)}
            >
              {/* Avatar */}
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {displayName[0]?.toUpperCase()}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{displayName}</p>
                <p className="text-[11px] text-muted-foreground">
                  {username ?? `ID: ${conv.telegram_user_id}`}
                  {conv.service_interest && ` · ${conv.service_interest}`}
                </p>
              </div>

              {/* Message Count */}
              <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <MessageSquare size={12} />
                {conv.message_count}
              </span>

              {/* Status */}
              <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusCfg.class} shrink-0`}>
                <statusCfg.icon size={9} />
                {statusCfg.label}
              </span>

              {/* Date */}
              <span className="text-[10px] text-muted-foreground shrink-0">
                {new Date(conv.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>

              {/* Expand */}
              <button className="text-muted-foreground shrink-0">
                {expanded === conv.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>

            {/* Message History */}
            <AnimatePresence>
              {expanded === conv.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="max-h-80 overflow-y-auto p-3 sm:p-4 space-y-2 bg-secondary/20">
                    {convMessages.length === 0 ? (
                      <p className="text-center text-xs text-muted-foreground py-4">
                        Loading messages…
                      </p>
                    ) : (
                      convMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-2 ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                        >
                          {msg.role === 'bot' && (
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground shrink-0 mt-0.5">
                              <Bot size={12} />
                            </div>
                          )}
                          <div
                            className={`max-w-[75%] rounded-xl px-3 py-2 text-xs ${
                              msg.role === 'bot'
                                ? 'bg-secondary text-secondary-foreground rounded-tl-sm'
                                : 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-tr-sm'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            <p className={`mt-1 text-[9px] ${msg.role === 'bot' ? 'text-muted-foreground' : 'text-primary-foreground/60'}`}>
                              {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {msg.role === 'user' && (
                            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                              <User size={12} />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AdminTelegramConversations;
