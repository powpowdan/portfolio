import type { Command } from '../types'
import { pick } from '../../../../lib/terminal/random'

const CLEAR_BREADCRUMBS = [
  'cleared.',
  '(blank slate)',
  'screen wiped.',
  'history remains, the screen does not.',
  'gone.',
] as const

function clearCommand(): Command {
  return {
    name: 'clear',
    description: 'clear the screen',
    aliases: ['cls', 'reset'],
    keywords: ['clear', 'wipe', 'reset', 'empty'],
    man: { description: 'Clear the terminal output area.' },
    run: (ctx) => {
      ctx.clearScreen()
      return Math.random() < 0.5 ? pick(CLEAR_BREADCRUMBS) : null
    },
  }
}

function historyCommand(): Command {
  return {
    name: 'history',
    description: 'list prior commands',
    aliases: ['hist'],
    keywords: ['history', 'prior', 'past', 'commands', 'log'],
    man: { description: 'List commands submitted in the current session in order.' },
    run: (ctx) => {
      if (ctx.history.length === 0) return 'no history yet.'
      return ctx.history.map((h, i) => `  ${String(i + 1).padStart(3, ' ')}  ${h}`).join('\n')
    },
  }
}

export const shellCommands: Command[] = [clearCommand(), historyCommand()]
