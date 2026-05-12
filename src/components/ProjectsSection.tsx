import { motion } from 'framer-motion';
import { Github, ExternalLink, User } from 'lucide-react';

const GITHUB = 'https://github.com/omharde42';

const projects = [
  {
    title: 'B2C Solution Website',
    desc: 'The official B2C Solution business website — services, pricing, and customer flow built for conversions.',
    repo: `${GITHUB}/b2c-solution`,
    tag: 'Business Website',
  },
  {
    title: 'Jarvis AI Assistant',
    desc: 'A personal AI assistant inspired by Jarvis — voice commands, automation, and smart task handling.',
    repo: `${GITHUB}/jarvis-ai`,
    tag: 'AI Assistant',
  },
  {
    title: 'Payment Tracker',
    desc: 'Track payments, dues, and customer balances in one clean dashboard built for small businesses.',
    repo: `${GITHUB}/payment-tracker`,
    tag: 'Finance Tool',
  },
  {
    title: 'ID Card Generator',
    desc: 'Generate professional ID cards instantly from a simple form — print-ready and customizable.',
    repo: `${GITHUB}/id-card-generator`,
    tag: 'Utility Tool',
  },
  {
    title: 'Real Estate Website',
    desc: 'A modern real estate listing website with property search, gallery, and enquiry workflow.',
    repo: `${GITHUB}/real-estate-website`,
    tag: 'Real Estate',
  },
];

const ProjectsSection = () => (
  <section className="py-16 sm:py-20" id="projects">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 sm:mb-12"
      >
        <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-primary">
          Real Projects · Real Code
        </span>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          Projects we've <span className="text-gradient-brand">actually built</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          Live work from our GitHub — websites, tools, and AI products shipped end-to-end.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Github size={18} />
              </div>
              <span className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider text-muted-foreground">
                {p.tag}
              </span>
            </div>
            <h3 className="font-display text-base font-bold mb-1.5">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{p.desc}</p>

            <div className="flex flex-col sm:flex-row gap-2 mt-auto">
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${p.title} repository on GitHub in a new tab`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs sm:text-sm font-display font-bold text-primary-foreground transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Github size={14} aria-hidden="true" /> View Repo <ExternalLink size={12} aria-hidden="true" />
              </a>
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open omharde42 GitHub profile in a new tab"
                className="sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-xs sm:text-sm font-display font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <User size={14} aria-hidden="true" /> Profile
              </a>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href={GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-display font-bold text-primary hover:underline"
        >
          <Github size={16} /> See all projects on GitHub
        </a>
      </div>
    </div>
  </section>
);

export default ProjectsSection;
