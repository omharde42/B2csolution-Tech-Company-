import { motion } from 'framer-motion';
import { MessageCircle, Send, Users, Megaphone, ArrowRight, Zap, Gift, Bell } from 'lucide-react';
import SEO from '@/components/SEO';

const channels = [
  {
    name: 'WhatsApp Channel',
    desc: 'Get instant updates on new services, offers, and tech tips directly on WhatsApp.',
    link: 'https://whatsapp.com/channel/0029Vb8HtnB2Jl8HIHklh51b',
    icon: MessageCircle,
    color: 'from-[hsl(142,70%,45%)] to-[hsl(142,70%,35%)]',
    btnText: 'Join WhatsApp Channel',
    features: ['Service updates', 'Exclusive offers', 'Tech tips & tricks', 'Priority support access'],
  },
  {
    name: 'Telegram Channel',
    desc: 'Join our Telegram community for detailed tech guides, announcements, and direct support.',
    link: 'https://t.me/boost/B2CSolutioncompany',
    icon: Send,
    color: 'from-[hsl(200,80%,50%)] to-[hsl(200,80%,40%)]',
    btnText: 'Join Telegram Channel',
    features: ['In-depth tech guides', 'Company announcements', 'Community discussions', 'Early access to features'],
  },
];

const benefits = [
  { icon: Bell, title: 'Instant Updates', desc: 'Be the first to know about new services and features.' },
  { icon: Gift, title: 'Exclusive Offers', desc: 'Get special discounts only available to channel members.' },
  { icon: Zap, title: 'Priority Support', desc: 'Community members get faster response times.' },
  { icon: Users, title: 'Join 500+ Members', desc: 'Be part of a growing tech-savvy community.' },
];

const JoinCommunity = () => (
  <div className="min-h-screen">
    <SEO
      title="Join the B2C Solution Community — WhatsApp & Telegram"
      description="Join the B2C Solution WhatsApp and Telegram channels for exclusive offers, tech tips, updates, and priority support."
      path="/community"
    />
    {/* Hero */}
    <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent mb-6">
            <Megaphone size={14} /> Join Our Community
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black mb-4">
            Stay Connected with <span className="text-gradient-brand">B2C Solution</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Join our channels for exclusive updates, tech tips, special offers, and direct access to our support team.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Channel Cards */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {channels.map((ch, i) => {
            const Icon = ch.icon;
            return (
              <motion.div
                key={ch.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl border border-border bg-card p-8 flex flex-col"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ch.color} flex items-center justify-center mb-6`}>
                  <Icon size={32} className="text-white" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">{ch.name}</h2>
                <p className="text-muted-foreground mb-6">{ch.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {ch.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight size={14} className="text-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={ch.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full rounded-xl bg-gradient-to-r ${ch.color} py-3.5 text-center text-sm font-bold text-white transition-transform hover:scale-[1.02] flex items-center justify-center gap-2`}
                >
                  <Icon size={18} />
                  {ch.btnText}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-display text-3xl font-bold text-center mb-12">
          Why <span className="text-gradient-brand">Join Us</span>?
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display font-bold mb-1">{b.title}</h3>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Ad Banner */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-r from-primary to-accent p-10 text-center text-white max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl font-black mb-3">🚀 Need Tech Solutions?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            From website development to AI tools, we build smart digital solutions for modern businesses. Get started today!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/services" className="rounded-xl bg-white text-primary px-8 py-3 text-sm font-bold transition-transform hover:scale-105">
              View Services
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2CSOLUTION!%20I%20saw%20your%20community%20page%20and%20I%27m%20interested%20in%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border-2 border-white px-8 py-3 text-sm font-bold transition-transform hover:scale-105"
            >
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  </div>
);

export default JoinCommunity;
