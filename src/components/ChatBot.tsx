import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const MAX_QUESTIONS = 15;
const RATE_LIMIT_MS = 1500; // min time between messages

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! 👋 I'm B2C Bot — your AI assistant. Ask me about our services, pricing, or anything else!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [lastSentAt, setLastSentAt] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Honeypot field for bot protection
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;

    // Bot protection: honeypot check
    if (honeypot) return;

    // Rate limiting
    const now = Date.now();
    if (now - lastSentAt < RATE_LIMIT_MS) return;
    setLastSentAt(now);

    const userMsg = input.trim();
    setInput('');

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    if (newCount >= MAX_QUESTIONS) {
      setMessages(prev => [
        ...prev,
        { role: 'user', content: userMsg },
        { role: 'assistant', content: "You've been chatting a lot! 🤔 For more detailed help, let me connect you with our admin directly on WhatsApp..." }
      ]);
      setTimeout(() => {
        window.open('https://api.whatsapp.com/send?phone=919882303030&text=' + encodeURIComponent("Hi B2CSOLUTION! I have some questions. Can you help me?"), '_blank');
      }, 2000);
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
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm receiving too many requests right now. Please wait a moment and try again." }]);
        return;
      }
      if (resp.status === 402) {
        setMessages(prev => [...prev, { role: 'assistant', content: "AI service is temporarily unavailable. Please contact us on WhatsApp at +91 9882303030." }]);
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
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && prev.length > updatedMessages.length) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch { /* partial JSON, wait */ }
        }
      }
    } catch (e) {
      console.error('Chat error:', e);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that. Please try again or contact us on WhatsApp at +91 9882303030." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 glow-primary"
        aria-label="Open AI Chat"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-40 right-6 z-50 flex h-96 w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          >
            <div className="bg-gradient-primary px-4 py-3">
              <h3 className="font-display text-sm font-bold text-primary-foreground">B2C AI Bot</h3>
              <p className="text-xs text-primary-foreground/70">Powered by AI • Ask me anything!</p>
            </div>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === 'assistant' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
                    {m.role === 'assistant' ? (
                      <div className="prose prose-sm prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-secondary px-3 py-2">
                    <Loader2 size={16} className="animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex border-t border-border p-2">
              {/* Honeypot - hidden from humans */}
              <input
                type="text"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                className="absolute -left-[9999px] opacity-0 h-0 w-0"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type a message..."
                disabled={isLoading}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
              />
              <button onClick={send} disabled={isLoading} className="rounded-lg p-2 text-primary transition-colors hover:bg-secondary disabled:opacity-50">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
