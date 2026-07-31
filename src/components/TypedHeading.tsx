'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

interface TypedHeadingProps {
  command: string
}

export default function TypedHeading({ command }: TypedHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  const fullText = `$ ${command}`

  useEffect(() => {
    if (!isInView || done) return

    if (displayed.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayed(fullText.slice(0, displayed.length + 1))
      }, 30)
      return () => clearTimeout(timeout)
    } else {
      setDone(true)
    }
  }, [isInView, displayed, done, fullText])

  return (
    <div ref={ref} className="section-heading">
      <span className="text-accent">{displayed}</span>
      {!done && isInView && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </div>
  )
}
