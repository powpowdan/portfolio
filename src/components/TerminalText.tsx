'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const TYPING_SPEED = 80
const DELETING_SPEED = 40
const PAUSE_AFTER_TYPE = 1200
const PAUSE_AFTER_DELETE = 300

type Phase = 'typing-hello' | 'pausing-hello' | 'deleting' | 'typing-name' | 'done'

export default function TerminalText() {
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<Phase>('typing-hello')
  const [showCursor, setShowCursor] = useState(true)
  const reduceMotion = useReducedMotion()

  const helloWorld = 'Hello World'
  const namePart = "Hello, I'm Dan"

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(namePart)
      setPhase('done')
      return
    }

    let timeout: NodeJS.Timeout

    if (phase === 'typing-hello') {
      if (displayed.length < helloWorld.length) {
        timeout = setTimeout(() => {
          setDisplayed(helloWorld.slice(0, displayed.length + 1))
        }, TYPING_SPEED)
      } else {
        timeout = setTimeout(() => setPhase('pausing-hello'), PAUSE_AFTER_TYPE)
      }
    } else if (phase === 'pausing-hello') {
      timeout = setTimeout(() => setPhase('deleting'), 200)
    } else if (phase === 'deleting') {
      if (displayed.length > 'Hello '.length) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1))
        }, DELETING_SPEED)
      } else {
        timeout = setTimeout(() => setPhase('typing-name'), PAUSE_AFTER_DELETE)
      }
    } else if (phase === 'typing-name') {
      if (displayed.length < namePart.length) {
        timeout = setTimeout(() => {
          setDisplayed(namePart.slice(0, displayed.length + 1))
        }, TYPING_SPEED)
      } else {
        timeout = setTimeout(() => setPhase('done'), 200)
      }
    }

    return () => clearTimeout(timeout)
  }, [phase, displayed, helloWorld, namePart, reduceMotion])

  useEffect(() => {
    if (phase !== 'done' || reduceMotion) return
    const interval = setInterval(() => {
      setShowCursor((c) => !c)
    }, 530)
    return () => clearInterval(interval)
  }, [phase, reduceMotion])

  return (
    <div className="inline-flex items-baseline">
      <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-light tracking-tight">
        {displayed}
      </span>
      {phase === 'done' ? (
        <span
          className={`inline-block w-[3px] h-[1em] bg-accent ml-1 self-center transition-opacity duration-100 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <motion.span
          className="inline-block w-[3px] h-[1em] bg-accent ml-1 self-center"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </div>
  )
}
