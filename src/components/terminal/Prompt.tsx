'use client'

import { useEffect, useRef } from 'react'

interface PromptProps {
  value: string
  bootComplete: boolean
  cwd: string
  onChange: (value: string) => void
  onSubmit: () => void
  onArrowUp: () => void
  onArrowDown: () => void
  onTab: () => void
  registerFocus: (focus: () => void) => void
}

export default function Prompt({
  value,
  bootComplete,
  cwd,
  onChange,
  onSubmit,
  onArrowUp,
  onArrowDown,
  onTab,
  registerFocus,
}: PromptProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    registerFocus(() => inputRef.current?.focus())
  }, [registerFocus])

  useEffect(() => {
    if (bootComplete) inputRef.current?.focus()
  }, [bootComplete])

  return (
    <div className="flex items-start">
      <span
        className="text-accent font-mono text-sm sm:text-base mt-2.5 mr-3 select-none"
        aria-hidden="true"
      >
        {cwd}{' $'}{' '}
      </span>
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSubmit()
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              onArrowUp()
            } else if (e.key === 'ArrowDown') {
              e.preventDefault()
              onArrowDown()
            } else if (e.key === 'Tab') {
              e.preventDefault()
              onTab()
            }
          }}
          aria-label="terminal prompt"
          aria-autocomplete="none"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className={`w-full bg-transparent border-0 outline-none font-mono text-base sm:text-lg text-white/90 ${value === '' ? 'caret-transparent' : 'caret-accent'}`}
        />
        {value === '' && bootComplete && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 inline-block w-[8px] h-[1.2em] mt-2.5 bg-accent animate-blink"
          />
        )}
      </div>
    </div>
  )
}
