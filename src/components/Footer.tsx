import { Instagram, Github, MessageCircle, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="font-display text-lg font-bold text-gradient-brand mb-3">B2CSOLUTION</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted partner for digital services and solutions. Quality work, delivered on time.
            </p>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-accent" /> Address
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              B2CSOLUTION HQ<br />
              123 Business Park, Suite 456<br />
              Tech City, IN 411001
            </p>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock size={16} className="text-accent" /> Working Hours
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Mon – Fri: 9:00 AM – 7:00 PM</li>
              <li>Saturday: 10:00 AM – 5:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3">Connect With Us</h4>
            <div className="flex flex-col gap-2">
              <a href="https://www.instagram.com/itzomharde_6/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent">
                <Instagram size={16} /> @itzomharde_6
              </a>
              <a href="https://github.com/omharde42" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent">
                <Github size={16} /> omharde42
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle size={16} /> Discord: om041817
              </div>
              <a href="https://wa.me/919882303030" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent">
                <Phone size={16} /> Om Harde – 9882303030
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} B2CSOLUTION. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
