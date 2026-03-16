import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, Clock, ShoppingBag } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border bg-card mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="font-display text-lg font-bold text-gradient-brand mb-3">B2C Solution</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium custom merchandise and creative design products. T-shirts, mugs, hoodies, phone cases & more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-foreground transition-colors">Products</Link></li>
            <li><Link to="/reviews" className="hover:text-foreground transition-colors">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Working Hours */}
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock size={14} className="text-accent" /> Working Hours
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Mon – Fri: 9:00 AM – 7:00 PM</li>
            <li>Saturday: 10:00 AM – 5:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-3">Connect With Us</h4>
          <div className="flex flex-col gap-2">
            <a href="https://www.instagram.com/itzomharde_6/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent">
              <Instagram size={14} /> @itzomharde_6
            </a>
            <a href="https://api.whatsapp.com/send?phone=919882303030" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent">
              <Phone size={14} /> +91 98823 03030
            </a>
            <a href="mailto:b2csolution@gmail.com"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent">
              <Mail size={14} /> b2csolution@gmail.com
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
