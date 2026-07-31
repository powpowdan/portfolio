'use client'

import { motion } from 'framer-motion'
import TypedHeading from './TypedHeading'

export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-8 py-16 sm:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl mx-auto w-full"
      >
        <TypedHeading command="cat about.txt" />

        <div className="space-y-5 text-base sm:text-lg leading-relaxed text-muted">
          <p>
            I&apos;m a Senior Full-Stack Web Developer with 4+ years of experience
            engineering secure, high-availability web solutions in the federal
            government. I architect automation tools, manage complex deployments,
            and build systems that can handle millions of users without breaking a
            sweat.
          </p>
          <p>
            I served as <span className="text-white/70">Co-Lead Developer</span> for 4
            Federal Budgets and Fall Economic Statements — managing rapid-response
            code updates under strict embargo conditions, working directly with the
            Minister&apos;s Office to ensure flawless delivery.
          </p>
          <p>
            I&apos;m equally comfortable building a Python automation generator,
            wrangling a React front end, or setting up Git workflows for an entire
            team. Always learning, always shipping.
          </p>
        </div>

        <div className="mt-8 flex items-center gap-4 text-sm font-mono text-muted">
          <span className="text-accent">clearance</span>
          <span className="text-white/40">secret</span>
          <span className="text-white/10">|</span>
          <span className="text-accent">location</span>
          <span className="text-white/40">Ottawa, ON</span>
        </div>
      </motion.div>
    </section>
  )
}
