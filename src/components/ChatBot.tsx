import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const botResponses: Record<string, string> = {
  'hello': 'Hi there! 👋 Welcome to B2CSOLUTION. How can I help you today?',
  'hi': 'Hey! 👋 How can I assist you?',
  'services': 'We offer Web Development, App Development, Graphic Design, SEO, Social Media Marketing, and Video Editing. Browse our homepage to add services to your cart!',
  'price': 'Our prices vary by service. Check our homepage for detailed pricing on each service.',
  'payment': 'We accept UPI payments. You can pay via QR code during checkout using omharde300@oksbi or 9882303030@fam.',
  'contact': 'You can reach Om Harde on WhatsApp at 9882303030, Instagram @itzomharde_6, or Discord om041817.',
  'order': 'You can track your orders from the Dashboard. Click on your profile icon to access it.',
  'track': 'Go to Dashboard → Order Tracking to see the status of your orders.',
  'help': 'I can help with: services, pricing, payment, contact info, and order tracking. Just ask!',
};

const getResponse = (msg: string): string => {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(botResponses)) {
    if (lower.includes(key)) return val;
  }
  return "Thanks for your message! For detailed help, please contact us on WhatsApp at 9882303030. Type 'help' to see what I can assist with.";
};

interface Message {
  text: string;
  isBot: boolean;
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! 👋 I'm B2C Bot. How can I help you? Type 'help' for options.", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { text: getResponse(userMsg), isBot: true }]);
    }, 500);
  };

  return (
    <>
      {/* Chat toggle - positioned above WhatsApp button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 glow-primary"
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
              <h3 className="font-display text-sm font-bold text-primary-foreground">B2C Support Bot</h3>
              <p className="text-xs text-primary-foreground/70">Ask me anything!</p>
            </div>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.isBot ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex border-t border-border p-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button onClick={send} className="rounded-lg p-2 text-primary transition-colors hover:bg-secondary">
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
