import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border bg-card mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-display text-lg font-bold text-gradient-brand mb-3">B2C Solution</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Websites that bring customers to your business. Simple, fast, and affordable for small businesses.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-foreground transition-colors">Services</Link></li>
            <li><Link to="/reviews" className="hover:text-foreground transition-colors">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
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
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-3">Connect With Us</h4>
          <div className="flex flex-col gap-2.5">
            <a href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!%20I%20want%20a%20website%20for%20my%20business."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 px-3 py-2 text-sm font-medium text-[#25D366] transition hover:bg-[#25D366]/20 hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
            <a href="https://www.instagram.com/itzomharde_6/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              <Instagram size={16} /> @itzomharde_6
            </a>
            <a href="mailto:b2csolution2436@gmail.com"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              <Mail size={16} /> b2csolution2436@gmail.com
            </a>
            <a href="tel:+919882303030"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              <Phone size={16} /> +91 98823 03030
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} B2C Solution. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
