'use client'

import { motion } from 'framer-motion'
import ScrambleHeading from './terminal/effects/ScrambleHeading'

const skillGroups = [
  {
    label: 'Languages',
    skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'Bash', 'SQL'],
  },
  {
    label: 'Frontend',
    skills: ['React', 'Next.js', 'HTML5', 'CSS3/SASS', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    label: 'Backend & Tools',
    skills: ['Git', 'REST APIs', 'Node.js', 'Power Automate', 'Azure', 'Vercel'],
  },
  {
    label: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQL Server', 'Oracle'],
  },
  {
    label: 'CMS & Platforms',
    skills: ['AEM', 'SharePoint', 'Drupal', 'WordPress', 'WET 4'],
  },
  {
    label: 'Standards & Analytics',
    skills: ['WCAG 2.2', 'GA4', 'Adobe Analytics', 'Siteimprove', 'Power BI'],
  },
]

export default function Skills() {
  return (
    <section
      id="skills"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-8 py-16 sm:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl mx-auto w-full"
      >
        <ScrambleHeading command="cat skills.json" />

        <div className="grid gap-8 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <h3 className="font-mono text-xs text-accent uppercase tracking-widest mb-3">
                {'// '}{group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span key={skill} className="tech-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
