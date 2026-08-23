import type { ReactNode } from 'react'
import type { ActiveOverlay, OverlayKind, OverlayProps } from './registry/types'
import { MAX_WHISPERS, otherWhisper } from '../../lib/terminal/content/whispers'

export interface ShellLine {
  id: string
  kind: 'prompt' | 'output' | 'whisper' | 'toast'
  text?: string
  node?: ReactNode
  cwd?: string
  root?: boolean
}

export interface ShellState {
  lines: ShellLine[]
  input: string
  history: string[]
  historyCursor: number
  activeOverlay: ActiveOverlay | null
  bootComplete: boolean
  bootVisible: boolean
  signalBurst: boolean
  cwd: string
  pendingConfirm: { prompt: string } | null
}

export const initialState: ShellState = {
  lines: [],
  input: '',
  history: [],
  historyCursor: -1,
  activeOverlay: null,
  bootComplete: false,
  bootVisible: true,
  signalBurst: false,
  cwd: '~',
  pendingConfirm: null,
}

let lineIdCounter = 0
export function nextLineId(): string {
  lineIdCounter += 1
  return `l${lineIdCounter}`
}

export type Action =
  | { type: 'SET_INPUT'; value: string }
  | { type: 'SUBMIT'; text: string; root?: boolean }
  | { type: 'PUSH_OUTPUT'; node: ReactNode }
  | { type: 'PUSH_OUTPUT_TEXT'; text: string }
  | { type: 'PUSH_TOAST'; text: string }
  | { type: 'PUSH_WHISPER'; text: string }
  | { type: 'REQUEST_CONFIRM'; prompt: string }
  | { type: 'RESOLVE_CONFIRM' }
  | { type: 'DISMISS_WHISPERS' }
  | { type: 'CLEAR' }
  | { type: 'RECALL_HISTORY'; direction: 'up' | 'down' }
  | { type: 'SET_OVERLAY'; kind: OverlayKind | null; props?: OverlayProps }
  | { type: 'CLEAR_OVERLAY' }
  | { type: 'SET_BOOT_COMPLETE'; complete: boolean }
  | { type: 'SET_SIGNAL_BURST'; active: boolean }
  | { type: 'SET_CWD'; dir: string }
  | { type: 'APPEND_BOOT_LINES'; nodes: ReactNode[] }

export function shellReducer(state: ShellState, action: Action): ShellState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: action.value }

    case 'SUBMIT': {
      const promptLine: ShellLine = {
        id: nextLineId(),
        kind: 'prompt',
        text: action.text,
        cwd: state.cwd,
        root: action.root ?? false,
      }
      const filtered = action.text.trim() === '' ? state.history : [...state.history, action.text]
      return {
        ...state,
        lines: [...state.lines, promptLine],
        input: '',
        history: filtered,
        historyCursor: -1,
      }
    }

    case 'PUSH_OUTPUT': {
      const line: ShellLine = { id: nextLineId(), kind: 'output', node: action.node }
      return { ...state, lines: [...state.lines, line] }
    }

    case 'PUSH_OUTPUT_TEXT': {
      const line: ShellLine = { id: nextLineId(), kind: 'output', text: action.text }
      return { ...state, lines: [...state.lines, line] }
    }

    case 'PUSH_TOAST': {
      const line: ShellLine = { id: nextLineId(), kind: 'toast', text: action.text }
      return { ...state, lines: [...state.lines, line] }
    }

    case 'REQUEST_CONFIRM': {
      const line: ShellLine = { id: nextLineId(), kind: 'output', text: action.prompt }
      return { ...state, lines: [...state.lines, line], pendingConfirm: { prompt: action.prompt } }
    }

    case 'RESOLVE_CONFIRM':
      return { ...state, pendingConfirm: null }

    case 'PUSH_WHISPER': {
      const whisperIndices: number[] = []
      state.lines.forEach((l, i) => {
        if (l.kind === 'whisper') whisperIndices.push(i)
      })
      if (whisperIndices.length >= MAX_WHISPERS) {
        const lastIdx = whisperIndices[whisperIndices.length - 1]
        const last = state.lines[lastIdx]
        const nextText = action.text && action.text !== last.text ? action.text : otherWhisper(last.text)
        const replaced: ShellLine = { id: nextLineId(), kind: 'whisper', text: nextText }
        const lines = state.lines.slice()
        lines[lastIdx] = replaced
        return { ...state, lines }
      }
      const line: ShellLine = { id: nextLineId(), kind: 'whisper', text: action.text }
      return { ...state, lines: [...state.lines, line] }
    }

    case 'DISMISS_WHISPERS':
      return { ...state, lines: state.lines.filter((l) => l.kind !== 'whisper') }

    case 'CLEAR':
      return { ...state, lines: [], bootVisible: false }

    case 'RECALL_HISTORY': {
      if (state.history.length === 0) return state
      if (action.direction === 'up') {
        const next = state.historyCursor < 0
          ? state.history.length - 1
          : Math.max(0, state.historyCursor - 1)
        return {
          ...state,
          historyCursor: next,
          input: state.history[next] ?? '',
        }
      }
      if (state.historyCursor < 0) return { ...state, input: '' }
      const next = state.historyCursor + 1
      if (next >= state.history.length) {
        return { ...state, historyCursor: -1, input: '' }
      }
      return {
        ...state,
        historyCursor: next,
        input: state.history[next],
      }
    }

    case 'SET_OVERLAY':
      return {
        ...state,
        activeOverlay: action.kind === null ? null : { kind: action.kind, props: action.props },
      }

    case 'CLEAR_OVERLAY':
      return { ...state, activeOverlay: null }

    case 'SET_BOOT_COMPLETE':
      return { ...state, bootComplete: action.complete }

    case 'SET_SIGNAL_BURST':
      return { ...state, signalBurst: action.active }

    case 'SET_CWD':
      return { ...state, cwd: action.dir }

    case 'APPEND_BOOT_LINES': {
      const newLines: ShellLine[] = action.nodes.map((node) => ({
        id: nextLineId(),
        kind: 'output',
        node,
      }))
      return { ...state, lines: [...state.lines, ...newLines] }
    }

    default:
      return state
  }
}
