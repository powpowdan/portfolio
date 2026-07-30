'use client'

import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Meditation App',
    description:
      'A full-stack meditation and mindfulness application with guided sessions, progress tracking, and ambient soundscapes.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'MongoDB'],
    links: {
      github: '#',
      live: '#',
    },
  },
  {
    title: 'Public Camera World Map',
    description:
      'An interactive world map visualizing publicly accessible webcams, with search, filtering, and location-based discovery.',
    tags: ['TypeScript', 'Next.js', 'Mapbox', 'REST API'],
    links: {
      github: '#',
      live: '#',
    },
  },
]

export default function Projects() {
  return (
    <section
      id="projects"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-8 py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl mx-auto w-full"
      >
        <h2 className="section-heading">
          <span className="text-accent">$</span> ls -la projects/
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="card group"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-accent/60" />
                <h3 className="font-mono text-sm text-white/80 tracking-wide">
                  {project.title}
                </h3>
              </div>

              <p className="text-sm text-muted leading-relaxed mb-5">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-1 rounded
                               border border-white/5 text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <a
                  href={project.links.github}
                  className="text-xs font-mono text-muted hover:text-accent transition-colors duration-200"
                >
                  github →
                </a>
                <a
                  href={project.links.live}
                  className="text-xs font-mono text-muted hover:text-accent transition-colors duration-200"
                >
                  live demo →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 pt-6 border-t border-white/[0.04] flex gap-4 text-xs font-mono">
          <a href="#about" className="text-muted hover:text-accent transition-colors duration-200 uppercase tracking-wider">
            about
          </a>
          <span className="text-muted/30">/</span>
          <span className="text-accent">projects</span>
          <span className="text-muted/30">/</span>
          <a href="#skills" className="text-muted hover:text-accent transition-colors duration-200 uppercase tracking-wider">
            skills
          </a>
        </div>
      </motion.div>
    </section>
  )
}
