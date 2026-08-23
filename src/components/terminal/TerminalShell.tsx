'use client'

import { useCallback, useEffect, useReducer, useRef, useState, type ReactNode } from 'react'
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
import { AWAY_TITLES } from '../../lib/terminal/content/whispers'
import {
  getProgress,
  isRoot,
  recordAll,
  recordDiscovery,
  resetDiscovery,
  subscribe,
  HIDDEN_TOTAL,
} from '../../lib/terminal/discovery'
import {
  discoveryToast,
  nextWhisper,
  transmissionCopy,
} from '../../lib/terminal/content/discovery'
import { DELETION_CANCEL_LINE } from '../../lib/terminal/content/deletion'

const NOT_FOUND_VARIANTS = [
  (name: string) => `command not found: ${name} — try 'help' or 'apropos <keyword>'`,
  (name: string) => `no such command: ${name}. try 'help'`,
  (name: string) => `${name}? never heard of it. try 'apropos'`,
  (name: string) => `command not found: ${name}. type 'help' for the list`,
] as const

const BACKDOOR = 'enterthecode'
const BACKDOOR_EXIT = 'exitthecode'

function transmissionNode(): ReactNode {
  const copy = transmissionCopy(HIDDEN_TOTAL)
  return (
    <div className="font-mono text-sm sm:text-base leading-relaxed my-1">
      <div className="text-accentRoot/90">{copy.header}</div>
      <div className="text-white/70 mt-1">{copy.body[0]}</div>
      <div className="text-white/70">{copy.body[1]}</div>
      <div className="text-white/60 mt-1">{copy.signoff}</div>
      <div className="text-accentRoot/80 mt-1">{copy.root}</div>
      <div className="text-accentRoot/80 mt-2">{copy.maintenance}</div>
      <div className="text-red-400/70 mt-1">{copy.rmHint}</div>
    </div>
  )
}

interface TerminalShellProps {
  onCommandSubmitted?: () => void
}

export default function TerminalShell({ onCommandSubmitted }: TerminalShellProps) {
  const [state, dispatch] = useReducer(shellReducer, initialState)
  const reduceMotion = useReducedMotion() ?? false
  const [rootMode, setRootMode] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef<() => void>(() => {})
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const originalTitleRef = useRef<string | null>(null)
  const awayTitleSetRef = useRef(false)
  const oneOneOneFiredRef = useRef(false)
  const nudgeFiredRef = useRef(false)
  const lastNarratorRef = useRef(false)
  const lastWhisperRef = useRef<string | undefined>(undefined)
  const trophiesRunRef = useRef(false)

  useEffect(() => subscribe(() => setRootMode(isRoot())), [])

  const armIdle = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    if (!state.bootComplete) return
    idleTimerRef.current = setTimeout(() => {
      const pickResult = nextWhisper(
        {
          nudgeFired: nudgeFiredRef.current,
          lastWasNarrator: lastNarratorRef.current,
          trophiesRun: trophiesRunRef.current,
          lastWhisper: lastWhisperRef.current,
        },
        getProgress(),
      )
      nudgeFiredRef.current = true
      if (!pickResult) return
      lastNarratorRef.current = pickResult.narrator
      lastWhisperRef.current = pickResult.text
      dispatch({ type: 'PUSH_WHISPER', text: pickResult.text })
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
    if (!state.bootComplete || state.signalBurst) return
    if (Math.random() >= 1 / 50) return
    const t = setTimeout(() => dispatch({ type: 'SET_SIGNAL_BURST', active: true }), 1200)
    return () => clearTimeout(t)
  }, [state.bootComplete, state.signalBurst])

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
      dispatch({ type: 'SUBMIT', text: value, root: rootMode })
      dispatch({ type: 'DISMISS_WHISPERS' })
      onCommandSubmitted?.()
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }

      if (value === '') {
        if (state.pendingConfirm) {
          dispatch({ type: 'RESOLVE_CONFIRM' })
          dispatch({ type: 'PUSH_OUTPUT_TEXT', text: DELETION_CANCEL_LINE })
        }
        armIdle()
        return
      }

      const parsed = parseInput(value)

      if (state.pendingConfirm) {
        const answer = parsed.name.toLowerCase()
        dispatch({ type: 'RESOLVE_CONFIRM' })
        if (answer === 'y' || answer === 'yes') {
          dispatch({ type: 'SET_OVERLAY', kind: 'deletion' })
        } else {
          dispatch({ type: 'PUSH_OUTPUT_TEXT', text: DELETION_CANCEL_LINE })
        }
        armIdle()
        return
      }

      if (parsed.name.toLowerCase() === BACKDOOR) {
        if (isRoot()) {
          dispatch({ type: 'PUSH_OUTPUT_TEXT', text: 'you already have root.' })
        } else {
          recordAll()
          dispatch({ type: 'PUSH_OUTPUT_TEXT', text: 'backdoor accepted.' })
          dispatch({ type: 'PUSH_OUTPUT', node: transmissionNode() })
        }
        armIdle()
        return
      }

      if (parsed.name.toLowerCase() === BACKDOOR_EXIT) {
        if (resetDiscovery()) {
          dispatch({ type: 'PUSH_OUTPUT_TEXT', text: 'backdoor closed. the hunt resumes.' })
        } else {
          dispatch({ type: 'PUSH_OUTPUT_TEXT', text: 'nothing to reset. the hunt has not begun.' })
        }
        armIdle()
        return
      }

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

      if (command.name === 'trophies') {
        trophiesRunRef.current = true
        nudgeFiredRef.current = true
      }
      const discovery = command.hidden ? recordDiscovery(command.name) : null

      const ctx = {
        args: parsed.args,
        raw: parsed.raw,
        history: state.history,
        reduceMotion,
        allCommands: ALL_COMMANDS,
        cwd: state.cwd,
        setCwd: (dir: string) => dispatch({ type: 'SET_CWD', dir }),
        triggerOverlay: (overlay: ActiveOverlay) =>
          dispatch({ type: 'SET_OVERLAY', kind: overlay.kind, props: overlay.props }),
        clearOverlay: () => dispatch({ type: 'CLEAR_OVERLAY' }),
        triggerGlitch: () => dispatch({ type: 'SET_SIGNAL_BURST', active: true }),
        requestConfirm: (prompt: string) => dispatch({ type: 'REQUEST_CONFIRM', prompt }),
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
      if (discovery) {
        dispatch({ type: 'PUSH_TOAST', text: discoveryToast(discovery) })
        if (discovery.allFound) {
          dispatch({ type: 'PUSH_OUTPUT', node: transmissionNode() })
        }
      }
      armIdle()
    },
    [state.input, state.history, state.cwd, state.pendingConfirm, reduceMotion, rootMode, armIdle, onCommandSubmitted, focusPrompt],
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
        cwd={state.cwd}
        root={rootMode}
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
