'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface ScrambleHeadingProps {
  command: string
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________01'

export default function ScrambleHeading({ command }: ScrambleHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const fullText = `$ ${command}`
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isInView || done) return

    let frame = 0
    const totalFrames = fullText.length * 4
    const FRAME_INTERVAL_MS = 30
    let timer: ReturnType<typeof setTimeout>

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
      timer = setTimeout(step, FRAME_INTERVAL_MS)
    }
    timer = setTimeout(step, FRAME_INTERVAL_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView])

  return (
    <div ref={ref} className="section-heading chromatic-hover" data-testid="scramble-heading">
      <span className="text-accent">{displayed}</span>
      {!done && isInView && (
        <span className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-middle animate-blink" />
      )}
    </div>
  )
}
