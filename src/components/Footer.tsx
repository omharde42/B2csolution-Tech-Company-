import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, Clock, MessageCircle, ShieldCheck, Zap, Heart } from 'lucide-react';
import b2cLogo from '@/assets/b2csolution-logo.png';

const Footer = () => (
  <footer className="relative border-t border-border bg-card mt-20 overflow-hidden">
    {/* subtle top gradient line */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    {/* decorative blob */}
    <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[80%] rounded-full bg-primary/10 blur-3xl" />

    <div className="container relative mx-auto px-4 py-12">
      {/* Trust badges */}
      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 backdrop-blur">
          <ShieldCheck size={18} className="text-[hsl(var(--price))]" />
          <div>
            <p className="text-xs font-semibold text-foreground">Secure Payments</p>
            <p className="text-[10px] text-muted-foreground">UPI · Razorpay</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 backdrop-blur">
          <Zap size={18} className="text-accent" />
          <div>
            <p className="text-xs font-semibold text-foreground">Fast Delivery</p>
            <p className="text-[10px] text-muted-foreground">2–3 day turnaround</p>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1 flex items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 backdrop-blur">
          <Heart size={18} className="text-accent" />
          <div>
            <p className="text-xs font-semibold text-foreground">90+ Happy Clients</p>
            <p className="text-[10px] text-muted-foreground">Across India</p>
          </div>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={b2cLogo} alt="B2C Solution" className="h-8 w-8 object-contain" />
            <h3 className="font-display text-lg font-bold text-gradient-brand">B2C Solution</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Websites, AI tools, and digital services for growing businesses. Simple, fast, and affordable.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-foreground transition-colors">Services</Link></li>
            <li><Link to="/reviews" className="hover:text-foreground transition-colors">Reviews</Link></li>
            <li><Link to="/team" className="hover:text-foreground transition-colors">Team</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            <li><Link to="/community" className="hover:text-accent transition-colors">Join Community</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock size={14} className="text-accent" /> Working Hours
          </h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>Mon – Fri: 9:00 AM – 7:00 PM</li>
            <li>Saturday: 10:00 AM – 5:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
          <p className="mt-4 text-[11px] text-muted-foreground/80">
            WhatsApp replies usually within 30 minutes during working hours.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-3">Connect With Us</h4>
          <div className="flex flex-col gap-2.5">
            <a
              href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!%20I%20want%20a%20website%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 px-3 py-2 text-sm font-medium text-[#25D366] transition hover:bg-[#25D366]/20 hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
            <a
              href="https://www.instagram.com/itzomharde_6/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              <Instagram size={16} /> @itzomharde_6
            </a>
            <a
              href="mailto:b2csolution2436@gmail.com"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              <Mail size={16} /> b2csolution2436@gmail.com
            </a>
            <a
              href="tel:+919882303030"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              <Phone size={16} /> +91 98823 03030
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} B2C Solution. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Built with <Heart size={11} className="text-accent fill-accent" /> for small businesses in India
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
