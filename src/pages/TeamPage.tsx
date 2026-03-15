import { motion } from 'framer-motion';
import { Crown, ShoppingBag, Rocket, Instagram, Github, Linkedin, Users } from 'lucide-react';
import b2cDesignerLogo from '@/assets/b2cdesigner-logo.png';

const team = [
  {
    name: 'Om Harde',
    role: 'Founder & CEO',
    badge: 'Main Founder',
    icon: Crown,
    bio: 'Visionary tech entrepreneur and the main founder of B2CSOLUTION Tech Company. Passionate about delivering premium digital services and making technology accessible to businesses of all sizes.',
    highlight: 'Soon launching B2C Designer — a creative design company under the B2CSOLUTION umbrella.',
    highlightIcon: Rocket,
    highlightImage: b2cDesignerLogo,
    socials: [
      { icon: Instagram, url: 'https://www.instagram.com/itzomharde_6/', label: '@itzomharde_6' },
      { icon: Github, url: 'https://github.com/omharde42', label: 'omharde42' },
    ],
  },
  {
    name: 'Raj Bonlawar',
    role: 'Team Member & Partner',
    badge: 'Partner',
    icon: ShoppingBag,
    bio: 'Key team member handling product management on Shopify and Printify platforms. Raj brings e-commerce expertise and operational efficiency to B2CSOLUTION.',
    highlight: 'Soon handling the social media strategy and operations for B2CSOLUTION.',
    highlightIcon: Rocket,
    highlightImage: null,
    socials: [
      { icon: Instagram, url: 'https://www.instagram.com/raj_bon09/', label: '@raj_bon09' },
    ],
  },
];

const TeamPage = () => (
  <div className="container mx-auto px-4 py-10 max-w-4xl">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Users size={28} />
      </div>
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Our <span className="text-gradient-brand">Team</span></h1>
      <p className="text-muted-foreground max-w-lg mx-auto">Meet the people behind B2CSOLUTION — dedicated to delivering top-tier tech services.</p>
    </motion.div>

    <div className="grid gap-8 md:grid-cols-2">
      {team.map((member, i) => (
        <motion.div
          key={member.name}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="rounded-2xl border border-border bg-card p-8 flex flex-col"
        >
          {/* Avatar & Badge */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <member.icon size={32} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">{member.name}</h2>
              <p className="text-xs text-muted-foreground">{member.role}</p>
              <span className="mt-1 inline-block rounded-full bg-accent/10 border border-accent/30 px-3 py-0.5 text-[10px] font-bold text-accent uppercase tracking-wider">
                {member.badge}
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{member.bio}</p>

          {/* Highlight */}
          <div className="rounded-xl bg-secondary/60 border border-border p-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <member.highlightIcon size={16} className="text-accent" />
              <span className="font-display text-xs font-bold text-accent uppercase tracking-wider">Coming Soon</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{member.highlight}</p>
            {member.highlightImage && (
              <img src={member.highlightImage} alt="B2CDesigner" className="w-32 rounded-lg shadow-md" loading="lazy" />
            )}
          </div>

          {/* Socials */}
          {member.socials.length > 0 && (
            <div className="flex gap-3">
              {member.socials.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors">
                  <s.icon size={14} /> {s.label}
                </a>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>

    {/* Collaboration Highlight */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center"
    >
      <h3 className="font-display text-xl font-bold mb-2">
        B2CSOLUTION × <span className="text-gradient-brand">Raj Bonlawar</span>
      </h3>
      <p className="text-sm text-muted-foreground max-w-lg mx-auto">
        A powerful collaboration driving product management, e-commerce solutions, and social media growth for the B2CSOLUTION brand.
      </p>
    </motion.div>
  </div>
);

export default TeamPage;
