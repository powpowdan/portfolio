'use client'

import { motion } from 'framer-motion'
import ScrambleHeading from './terminal/effects/ScrambleHeading'

type Project = {
  title: string
  name: string
  description: string
  tags: string[]
  links: {
    github: string
    live?: string
  }
}

const projects: Project[] = [
  {
    title: 'The Meditation App',
    name: 'Simply Meditation',
    description:
      'A minimalist, offline mobile meditation application built with React Native. Features customizable ambient soundscapes, audio controls, curated tracks, profile management and a clean interface.',
    tags: ['React Native',
    'TypeScript',
    'Track Player',
    'AsyncStorage',
    'Android (Gradle)',],
    links: {
      github: 'https://github.com/powpowdan/simplymeditation',
      live: ''
    },
  },
  {
    title: 'The Global Camera Network',
    name: 'Cam-Spy',
    description:
      'An interactive world map aggregating 30,000+ publicly accessible webcams from dozens of open data agencies, with search, filtering, and location-based discovery.',
    tags: ['JSX', 'React 19 + Vite', 'Leaflet +openStreet', 'React compiler'],
    links: {
      github: 'https://github.com/powpowdan/can-spy',
      live: 'https://global-cam.vercel.app/',
    },
  },
  {
    title: 'The Class Builder',
    name: 'Cadence',
    description:
      'A cross-platform tool for coaches to organize drills, sparring rounds, and training blocks. Build and manage sessions on desktop or mobile, share saved classes, and automatically generate your session runner directly from your structure.',
    tags: ['React 19', 'Vite 7', 'Supabase'],
    links: {
      github: 'https://github.com/powpowdan/zenntrainer',
      live: 'https://zenntrainer.vercel.app/',
    },
  },
  {
    title: 'The Workout Tracker',
    name: 'Atlas',
    description:
      'A flexible, local-first workout tracker for logging exercises, sets, and progress across custom routines. Built for progressive overload - it surfaces your last and best performance so every set is you vs you.',
    tags: ['React Native', 'Expo', 'SQLite', 'TypeScript', 'Zustland' ],
    links: {
      github: 'https://github.com/powpowdan/atlas',
      live: '',
    },
  },
]

export default function Projects() {
  return (
    <section
      id="projects"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-8 py-16 sm:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl mx-auto w-full"
      >
        <ScrambleHeading command="ls -la projects/" />

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="card group flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-accent/60" />
                <h3 className="font-mono text-sm text-white/80 tracking-wide">
                  {project.title}
                </h3>
              </div>

              <p className="text-xs font-mono text-accent/80 -mt-3 mb-4">
                ↳ {project.name}
              </p>

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

              <div className="flex gap-4 mt-auto">
                <a
                  href={project.links.github}
                  className="tap-target text-xs font-mono text-muted hover:text-accent transition-colors duration-200"
                >
                  github →
                </a>
                {project.links.live ? (
                  <a
                    href={project.links.live}
                    className="tap-target text-xs font-mono text-muted hover:text-accent transition-colors duration-200"
                  >
                    live demo →
                  </a>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
