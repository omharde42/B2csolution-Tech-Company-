import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const MAX_QUESTIONS = 25;
const RATE_LIMIT_MS = 1500;
const WA_URL =
  'https://api.whatsapp.com/send?phone=919882303030&text=' +
  encodeURIComponent('Hi B2C Solution! I have some questions. Can you help me?');
const TG_URL = 'https://t.me/b2csolution_bot'; // Update with your actual bot username

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ── Quick Prompts ────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  '🌐 Website development',
  '🤖 AI chatbot for my business',
  '📱 Mobile app cost?',
  '💬 Talk to a human',
];

// ── Initial Message ───────────────────────────────────────────────────────────
const INITIAL_MSG: Message = {
  role: 'assistant',
  content:
    "👋 Hi! I'm **B2C Bot** — your AI business assistant.\n\nI can help you with:\n- 💼 Services & pricing\n- 🌐 Website & app development\n- 🤖 AI chatbots & automation\n- 📦 Order tracking & support\n\nWhat would you like to know?",
};

// ── Session Storage Keys ──────────────────────────────────────────────────────
const STORAGE_KEY = 'b2c_chat_history';
const COUNT_KEY = 'b2c_chat_count';

const loadHistory = (): Message[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [INITIAL_MSG];
  } catch {
    return [INITIAL_MSG];
  }
};

const loadCount = (): number => {
  try {
    return parseInt(sessionStorage.getItem(COUNT_KEY) ?? '0', 10);
  } catch {
    return 0;
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadHistory);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(loadCount);
  const [lastSentAt, setLastSentAt] = useState(0);
  const [unread, setUnread] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [honeypot, setHoneypot] = useState('');

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // ── Focus on open ────────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // ── Gentle nudge after 8s ────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      if (!open && messages.length === 1) setUnread(true);
    }, 8000);
    return () => clearTimeout(t);
  }, [open, messages.length]);

  // ── Persist to sessionStorage ────────────────────────────────────────────
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem(COUNT_KEY, String(questionCount));
  }, [questionCount]);

  // ── Show handoff panel at threshold ─────────────────────────────────────
  useEffect(() => {
    if (questionCount >= 20 && !showHandoff) {
      setShowHandoff(true);
    }
  }, [questionCount, showHandoff]);

  // ─────────────────────────────────────────────────────────────────────────

  const sendText = async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (honeypot) return; // Anti-spam honeypot

    const now = Date.now();
    if (now - lastSentAt < RATE_LIMIT_MS) return;
    setLastSentAt(now);

    const userMsg = text.trim();
    setInput('');

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    // Hard cap
    if (newCount > MAX_QUESTIONS) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: userMsg },
        {
          role: 'assistant',
          content:
            "You've been very thorough! 🙌 Let me connect you with our team for personalised help.\n\n[💬 Chat on WhatsApp](https://wa.me/919882303030) · [🤖 Telegram Bot](" + TG_URL + ")",
        },
      ]);
      return;
    }

    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(updatedMessages);
    setIsLoading(true);

    let assistantContent = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (resp.status === 429) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: "I'm getting a lot of requests right now — please wait a moment and try again." },
        ]);
        return;
      }
      if (resp.status === 402) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'AI is temporarily unavailable. Please reach us on **[WhatsApp](https://wa.me/919882303030)** or **+91 98823 03030**.' },
        ]);
        return;
      }

      if (!resp.ok || !resp.body) throw new Error('Failed to get response');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && prev.length > updatedMessages.length) {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m,
                  );
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch {
            /* partial JSON */
          }
        }
      }
    } catch (e) {
      console.error('Chat error:', e);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I couldn't process that. Please try again or reach us on **[WhatsApp](https://wa.me/919882303030)** at **+91 98823 03030**.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const send = () => sendText(input);

  const handleQuick = (q: string) => {
    if (q.toLowerCase().includes('human')) {
      setShowHandoff(true);
      return;
    }
    sendText(q.replace(/^[🌐🤖📱💬]\s/, ''));
  };

  const reset = () => {
    setMessages([INITIAL_MSG]);
    setQuestionCount(0);
    setShowHandoff(false);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(COUNT_KEY);
  };

  return (
    <>
      {/* ── Floating Launcher ── */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-4 sm:right-6 z-50 group"
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
      >
        <span className="absolute inset-0 rounded-full bg-primary blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
        <span
          className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-2xl transition-transform group-hover:scale-110 ${
            !open ? 'animate-pulse-slow' : ''
          }`}
        >
          {open ? <X size={24} /> : <Bot size={24} />}
        </span>
        {!open && unread && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-lg">
            1
          </span>
        )}
        {!open && (
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:block whitespace-nowrap rounded-lg bg-card border border-border px-3 py-1.5 text-xs font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            Need help? Chat with B2C Bot
          </span>
        )}
      </button>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed bottom-40 right-4 sm:right-6 z-50 flex h-[36rem] max-h-[82vh] w-[calc(100vw-2rem)] sm:w-[24rem] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            role="dialog"
            aria-label="B2C AI Bot chat"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary via-primary to-accent px-4 py-3 overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white_0%,transparent_60%)]" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15 backdrop-blur ring-2 ring-primary-foreground/20">
                    <Bot size={18} className="text-primary-foreground" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--price))] ring-2 ring-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-primary-foreground flex items-center gap-1">
                      B2C Bot <Sparkles size={12} className="text-primary-foreground/80" />
                    </h3>
                    <p className="text-[10px] text-primary-foreground/80">Online · Replies instantly</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Telegram Bot Link */}
                  <a
                    href={TG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open Telegram Bot"
                    className="flex items-center gap-1 text-[10px] font-semibold text-primary-foreground/80 hover:text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 px-2 py-1 rounded-md transition-colors"
                  >
                    📱 Telegram
                  </a>
                  <button
                    onClick={reset}
                    className="text-[10px] font-semibold text-primary-foreground/80 hover:text-primary-foreground underline-offset-2 hover:underline"
                    aria-label="Start new chat"
                  >
                    New chat
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3 bg-background/30">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  {m.role === 'assistant' && (
                    <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <Bot size={13} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                      m.role === 'assistant'
                        ? 'bg-secondary text-secondary-foreground rounded-tl-sm'
                        : 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-tr-sm'
                    }`}
                  >
                    {m.role === 'assistant' ? (
                      <div className="prose prose-sm prose-invert max-w-none text-secondary-foreground [&>p]:m-0 [&>p+p]:mt-1.5 [&>ul]:my-1 [&>ol]:my-1 [&>ul]:pl-4 [&>ol]:pl-4 [&_a]:text-accent [&_a]:underline [&_strong]:text-foreground">
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) => {
                              const isInternal = href?.startsWith('/');
                              if (isInternal) {
                                return (
                                  <Link to={href!} onClick={() => setOpen(false)} className="text-accent underline">
                                    {children}
                                  </Link>
                                );
                              }
                              return (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                                  {children}
                                </a>
                              );
                            },
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Dots */}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <Bot size={13} />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-secondary px-3.5 py-2.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
                  </div>
                </div>
              )}

              {/* Human Handoff Panel */}
              {showHandoff && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-primary/30 bg-primary/5 p-3"
                >
                  <p className="text-xs font-semibold text-foreground mb-2">
                    🙋 Want to speak with our team?
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={WA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 py-1.5 text-[11px] font-semibold hover:bg-[#25D366]/20 transition-colors"
                    >
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                    <a
                      href={TG_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#0088CC]/10 text-[#0088CC] border border-[#0088CC]/30 py-1.5 text-[11px] font-semibold hover:bg-[#0088CC]/20 transition-colors"
                    >
                      📱 Telegram Bot
                    </a>
                  </div>
                  <button
                    onClick={() => setShowHandoff(false)}
                    className="mt-1.5 w-full text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Continue with AI
                  </button>
                </motion.div>
              )}
            </div>

            {/* Quick Replies (first turn only) */}
            {messages.length <= 1 && !isLoading && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuick(q)}
                    className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground hover:bg-primary/5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border bg-card px-2 py-2">
              <div className="flex items-end gap-1.5">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                  placeholder="Ask about services, pricing, support…"
                  disabled={isLoading}
                  aria-label="Type your message"
                  className="flex-1 rounded-lg bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                />
                {/* Honeypot */}
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute -left-[9999px] opacity-0 h-0 w-0"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <button
                  onClick={send}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between px-1">
                <p className="text-[10px] text-muted-foreground">
                  Powered by AI · {Math.max(0, MAX_QUESTIONS - questionCount)} questions left
                </p>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#25D366] hover:underline"
                >
                  <MessageCircle size={10} /> Human <ExternalLink size={8} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
