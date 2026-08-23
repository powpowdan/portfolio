'use client'

import { useEffect, useRef } from 'react'

interface PromptProps {
  value: string
  bootComplete: boolean
  cwd: string
  root?: boolean
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
  root,
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
    <div className="flex items-center">
      <span
        className={`${root ? 'text-accentRoot' : 'text-accent'} font-mono text-sm sm:text-base mr-3 select-none`}
        aria-hidden="true"
      >
        {cwd}{root ? ' #' : ' $'}{' '}
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
          className={`w-full h-7 p-0 bg-transparent border-0 outline-none font-mono text-sm sm:text-base text-white/90 ${value === '' ? 'caret-transparent' : root ? 'caret-accentRoot' : 'caret-accent'}`}
        />
        {value === '' && bootComplete && (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 inline-block w-[8px] h-[1.2em] animate-blink ${root ? 'bg-accentRoot' : 'bg-accent'}`}
          />
        )}
      </div>
    </div>
  )
}
