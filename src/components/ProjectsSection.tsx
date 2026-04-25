import { motion } from 'framer-motion';
import bakery from '@/assets/project-bakery.jpg';
import gym from '@/assets/project-gym.jpg';
import interior from '@/assets/project-interior.jpg';

const projects = [
  {
    img: bakery,
    title: 'Local Bakery',
    desc: 'This website helps a local bakery get more orders directly from WhatsApp.',
  },
  {
    img: gym,
    title: 'Neighborhood Gym',
    desc: 'This website helps a fitness studio get new members through online sign-ups.',
  },
  {
    img: interior,
    title: 'Interior Boutique',
    desc: 'This website helps an interior design studio get more enquiries from new customers.',
  },
];

const ProjectsSection = () => (
  <section className="py-20" id="projects">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-primary">
          Recent Work
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
          Websites that <span className="text-gradient-brand">grow businesses</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Real websites we've built for small businesses just like yours.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="aspect-[4/3] overflow-hidden bg-secondary">
              <img
                src={p.img}
                alt={`${p.title} website example`}
                width={800}
                height={600}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-base font-bold mb-1.5">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
