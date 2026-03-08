import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const botResponses: Record<string, string> = {
  'hello': 'Hi there! 👋 Welcome to B2CSOLUTION. How can I help you today?',
  'hi': 'Hey! 👋 How can I assist you?',
  'hey': 'Hello! 👋 What can I do for you?',
  'services': 'We offer Web Development, AI Website Builder, Typewriting, PPT Making, PDF to Excel, Windows/Linux Installation, Virus Removal, Antivirus Setup, Data Recovery, Laptop Repair, Printer Setup, WiFi Setup, Software Installation, Email Setup, and PC Optimization. Check our Services page!',
  'price': 'Our prices vary by service — from ₹45 for PDF to Excel to ₹4999 for Web Development. Visit our Services page for detailed pricing!',
  'pricing': 'Check out our Services page for complete pricing. Prices range from ₹45 to ₹4999 depending on the service.',
  'payment': 'We accept UPI payments. You can pay via QR code during checkout using omharde300@oksbi or 9882303030@fam.',
  'upi': 'Our UPI IDs are omharde300@oksbi and 9882303030@fam. You\'ll see a QR code at checkout.',
  'contact': 'You can reach Om Harde on WhatsApp at 9882303030, Instagram @itzomharde_6, or Discord om041817. Or use our Contact page!',
  'order': 'You can track your orders from the Dashboard. Sign in first, then go to Dashboard.',
  'track': 'Go to Dashboard to see all your order history and tracking info.',
  'help': 'I can help with: services, pricing, payment methods, contact info, order tracking, and more. Just ask!',
  'refund': 'For refund requests, please contact us directly on WhatsApp at 9882303030.',
  'delivery': 'Delivery timelines depend on the service. Most digital services are delivered within 2-5 business days.',
  'time': 'Our working hours are Mon-Fri 9AM-7PM, Saturday 10AM-5PM. Sunday is closed.',
  'hours': 'We\'re open Mon-Fri 9AM-7PM, Saturday 10AM-5PM. Closed on Sunday.',
  'website': 'We build custom websites starting from ₹4999. Our AI Website Builder starts from ₹2540!',
  'web': 'Web Development costs ₹4999 for a custom responsive website. AI Website Builder is ₹2540.',
  'virus': 'Virus Removal costs ₹300. We do a complete malware and virus cleanup on your device.',
  'laptop': 'Laptop Repair starts at ₹600. We handle hardware diagnosis and repair.',
  'wifi': 'WiFi Setup costs ₹250. We configure your router and network.',
  'windows': 'Windows Installation costs ₹500. Fresh Windows 10/11 with drivers.',
  'linux': 'Linux Installation costs ₹400. Ubuntu/Fedora setup.',
  'thanks': 'You\'re welcome! Feel free to ask if you need anything else. 😊',
  'thank': 'Happy to help! Let me know if you have more questions. 😊',
  'bye': 'Goodbye! 👋 Have a great day!',
  'how are you': 'I\'m doing great! Thanks for asking. How can I help you today?',
};

const getResponse = (msg: string): string => {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(botResponses)) {
    if (lower.includes(key)) return val;
  }
  return "I'm not sure about that one. Try asking about our services, pricing, payment, or contact info. Type 'help' to see what I can help with!";
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
  const [questionCount, setQuestionCount] = useState(0);
  const [redirected, setRedirected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    if (newCount >= 10 && !redirected) {
      setRedirected(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "You've asked quite a few questions! 🤔 For more detailed help, please connect with our admin directly. Redirecting you to WhatsApp now...", 
          isBot: true 
        }]);
        setTimeout(() => {
          window.open('https://web.whatsapp.com/send?phone=919882303030&text=' + encodeURIComponent("Hi, I have some questions about B2CSOLUTION services."), '_blank');
        }, 2000);
      }, 500);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: getResponse(userMsg), isBot: true }]);
      }, 500);
    }
  };

  return (
    <>
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
