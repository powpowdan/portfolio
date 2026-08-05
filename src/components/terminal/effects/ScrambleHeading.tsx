'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

interface ScrambleHeadingProps {
  command: string
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________01'

export default function ScrambleHeading({ command }: ScrambleHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion() ?? false
  const fullText = `$ ${command}`
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(fullText)
      setDone(true)
      return
    }
    if (!isInView || done) return

    let frame = 0
    const totalFrames = fullText.length * 3
    let raf = 0

    const step = () => {
      frame += 1
      const revealed = Math.floor((frame / totalFrames) * fullText.length)
      let out = ''
      for (let i = 0; i < fullText.length; i += 1) {
        if (i < revealed) {
          out += fullText[i]
        } else if (fullText[i] === ' ') {
          out += ' '
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
      }
      setDisplayed(out)
      if (frame >= totalFrames) {
        setDisplayed(fullText)
        setDone(true)
        return
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, reduceMotion])

  return (
    <div ref={ref} className="section-heading chromatic-hover" data-testid="scramble-heading">
      <span className="text-accent">{displayed}</span>
      {!done && isInView && !reduceMotion && (
        <span className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-middle animate-blink" />
      )}
    </div>
  )
}
