'use client'

import { useCallback, useEffect, useReducer, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import Prompt from './Prompt'
import OutputLine from './OutputLine'
import BootSequence from './BootSequence'
import OverlayHost from './overlays/OverlayHost'
import SignalBurst from './overlays/SignalBurst'
import { shellReducer, initialState } from './shellReducer'
import { resolveCommand, allCommandNames, ALL_COMMANDS } from './registry'
import { parseInput, type CommandOutput, type ActiveOverlay } from './registry/types'
import Typing from './Typing'
import { isTypingStream, drainStream } from './utils'
import { pick } from '../../lib/terminal/random'
import { IDLE_WHISPERS, AWAY_TITLES } from '../../lib/terminal/content/whispers'

const NOT_FOUND_VARIANTS = [
  (name: string) => `command not found: ${name} — try 'help' or 'apropos <keyword>'`,
  (name: string) => `no such command: ${name}. try 'help'`,
  (name: string) => `${name}? never heard of it. try 'apropos'`,
  (name: string) => `command not found: ${name}. type 'help' for the list`,
] as const

interface TerminalShellProps {
  onCommandSubmitted?: () => void
}

export default function TerminalShell({ onCommandSubmitted }: TerminalShellProps) {
  const [state, dispatch] = useReducer(shellReducer, initialState)
  const reduceMotion = useReducedMotion() ?? false
  const outputRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef<() => void>(() => {})
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const originalTitleRef = useRef<string | null>(null)
  const awayTitleSetRef = useRef(false)
  const oneOneOneFiredRef = useRef(false)

  const armIdle = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    if (!state.bootComplete) return
    idleTimerRef.current = setTimeout(() => {
      dispatch({ type: 'PUSH_WHISPER', text: IDLE_WHISPERS[Math.floor(Math.random() * IDLE_WHISPERS.length)] })
    }, 25000)
  }, [state.bootComplete])

  useEffect(() => {
    armIdle()
  }, [armIdle, state.lines.length])

  useEffect(() => {
    const el = outputRef.current
    if (!el) return
    const observer = new MutationObserver(() => {
      el.scrollTop = el.scrollHeight
    })
    observer.observe(el, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function onGlitch() {
      dispatch({ type: 'SET_SIGNAL_BURST', active: true })
    }
    window.addEventListener('terminal:glitch', onGlitch)
    return () => window.removeEventListener('terminal:glitch', onGlitch)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    if (!state.bootComplete || state.signalBurst) return
    if (Math.random() >= 1 / 50) return
    const t = setTimeout(() => dispatch({ type: 'SET_SIGNAL_BURST', active: true }), 1200)
    return () => clearTimeout(t)
  }, [state.bootComplete, state.signalBurst, reduceMotion])

  useEffect(() => {
    originalTitleRef.current = document.title
    function onVisibility() {
      if (document.hidden) {
        if (!awayTitleSetRef.current) {
          document.title = AWAY_TITLES[Math.floor(Math.random() * AWAY_TITLES.length)]
          awayTitleSetRef.current = true
        }
      } else if (awayTitleSetRef.current) {
        if (originalTitleRef.current) document.title = originalTitleRef.current
        awayTitleSetRef.current = false
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    function check1111() {
      if (oneOneOneFiredRef.current) return
      const now = new Date()
      if (now.getHours() === 11 && now.getMinutes() === 11) {
        oneOneOneFiredRef.current = true
        dispatch({ type: 'PUSH_WHISPER', text: '11:11 — make the wish.' })
      }
    }
    check1111()
    const interval = setInterval(check1111, 30_000)
    return () => clearInterval(interval)
  }, [])

  const focusPrompt = useCallback(() => focusRef.current(), [])

  const handleSubmit = useCallback(
    async (text?: string) => {
      const value = (text ?? state.input).trim()
      dispatch({ type: 'SUBMIT', text: value })
      dispatch({ type: 'DISMISS_WHISPERS' })
      onCommandSubmitted?.()
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }

      if (value === '') {
        armIdle()
        return
      }

      const parsed = parseInput(value)
      const command = resolveCommand(parsed.name)
      if (!command) {
        const typed = parsed.name.toLowerCase()
        const keywordMatches = ALL_COMMANDS
          .filter((cmd) =>
            [cmd.name, ...(cmd.aliases ?? []), ...(cmd.keywords ?? [])]
              .some((w) => w.toLowerCase() === typed),
          )
          .map((cmd) => cmd.name)

        if (keywordMatches.length > 0) {
          dispatch({
            type: 'PUSH_OUTPUT_TEXT',
            text: `did you mean: ${keywordMatches.map((m) => `\`${m}\``).join(', ')} ?`,
          })
        } else {
          dispatch({
            type: 'PUSH_OUTPUT_TEXT',
            text: pick(NOT_FOUND_VARIANTS)(parsed.name),
          })
        }
        armIdle()
        return
      }

      const ctx = {
        args: parsed.args,
        raw: parsed.raw,
        history: state.history,
        reduceMotion,
        allCommands: ALL_COMMANDS,
        triggerOverlay: (overlay: ActiveOverlay) =>
          dispatch({ type: 'SET_OVERLAY', kind: overlay.kind, props: overlay.props }),
        clearOverlay: () => dispatch({ type: 'CLEAR_OVERLAY' }),
        triggerGlitch: () => dispatch({ type: 'SET_SIGNAL_BURST', active: true }),
        scrollToSection: (id: string) => {
          const el = document.getElementById(id)
          if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
        },
        clearScreen: () => {
          dispatch({ type: 'CLEAR' })
          if (outputRef.current) outputRef.current.scrollTop = 0
          window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
          focusPrompt()
        },
      }

      try {
        const output: CommandOutput = await command.run(ctx)
        if (output !== null && output !== undefined) {
          if (isTypingStream(output)) {
            const drained = await drainStream(output as Parameters<typeof drainStream>[0])
            dispatch({ type: 'PUSH_OUTPUT', node: <Typing chunks={drained} /> })
          } else {
            dispatch({ type: 'PUSH_OUTPUT', node: output as React.ReactNode })
          }
        }
      } catch (err) {
        dispatch({
          type: 'PUSH_OUTPUT_TEXT',
          text: `error: ${err instanceof Error ? err.message : String(err)}`,
        })
      }
      armIdle()
    },
    [state.input, state.history, reduceMotion, armIdle, onCommandSubmitted, focusPrompt],
  )

  const handleTab = useCallback(() => {
    const value = state.input
    const tokens = value.split(/\s+/)
    if (tokens.length > 1) return
    const prefix = value.trim().toLowerCase()
    if (!prefix) return
    const matches = allCommandNames().filter((n) => n.startsWith(prefix))
    if (matches.length === 1) {
      dispatch({ type: 'SET_INPUT', value: `${matches[0]} ` })
    } else if (matches.length > 1) {
      dispatch({ type: 'PUSH_OUTPUT_TEXT', text: matches.join('   ') })
    }
  }, [state.input])

  useEffect(() => {
    focusPrompt()
  }, [focusPrompt, state.bootComplete])

  return (
    <div className="space-y-3 relative">
      {state.bootVisible && (
        <BootSequence onComplete={() => dispatch({ type: 'SET_BOOT_COMPLETE', complete: true })} />
      )}
      <div
        ref={outputRef}
        aria-live="polite"
        aria-label="terminal output"
        className={`terminal-scroll space-y-1.5 max-h-56 overflow-y-auto ${state.lines.length > 0 ? 'mt-1' : ''}`}
      >
        {state.lines.map((line) => (
          <OutputLine key={line.id} line={line} />
        ))}
      </div>
      <Prompt
        value={state.input}
        bootComplete={state.bootComplete}
        onChange={(v) => dispatch({ type: 'SET_INPUT', value: v })}
        onSubmit={() => handleSubmit()}
        onArrowUp={() => dispatch({ type: 'RECALL_HISTORY', direction: 'up' })}
        onArrowDown={() => dispatch({ type: 'RECALL_HISTORY', direction: 'down' })}
        onTab={handleTab}
        registerFocus={(f) => {
          focusRef.current = f
        }}
      />

      {state.activeOverlay && (
        <OverlayHost
          overlay={state.activeOverlay}
          onDismiss={() => dispatch({ type: 'CLEAR_OVERLAY' })}
        />
      )}
      {state.signalBurst && (
        <SignalBurst onDone={() => dispatch({ type: 'SET_SIGNAL_BURST', active: false })} />
      )}
    </div>
  )
}
