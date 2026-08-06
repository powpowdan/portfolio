import type { Command } from '../types'
import { expandKeyword } from '../../../../lib/terminal/keywords'
import { pick } from '../../../../lib/terminal/random'

const HELP_INTROS = [
  'available commands:',
  "here's what works:",
  'try these:',
  'core command set:',
] as const

const CD_SUCCESS = [
  (s: string) => `→ ${s}`,
  (s: string) => `jumping to ${s}`,
  (s: string) => `~ ${s}`,
] as const

const CONCEPT_CATEGORIES = [
  'searchable concepts:',
  '',
  '  calm      breathe, meditate, still',
  '  fight     train, martial, combat',
  '  past      kitchen, chef, old life',
  '  secret    secrets, 1111, hidden rituals',
  '  fun       matrix, games, easter eggs',
  '  hack      sudo, glitch, break things',
  '  info      system, specs, whoami',
  '  quote     fortune, wisdom, words',
  '',
  'try: apropos <concept>',
]

function visibleCommands(ctx: { allCommands: readonly Command[] }) {
  return ctx.allCommands.filter((c) => !c.hidden)
}

function hiddenCount(ctx: { allCommands: readonly Command[] }) {
  return ctx.allCommands.filter((c) => c.hidden).length
}

function helpCommand(): Command {
  return {
    name: 'help',
    description: 'list core commands',
    aliases: ['?', 'commands'],
    keywords: ['help', 'list', 'find', 'how', 'what', 'commands', 'menu'],
    man: {
      description: 'List the core command set with one-line descriptions.',
      lore: 'Lists core commands only. Try `alias` for shortcuts or `apropos <keyword>` to discover more.',
    },
    run: (ctx) => {
      const intro = pick(HELP_INTROS)
      const lines = visibleCommands(ctx).map((c) => `  ${c.name.padEnd(12, ' ')} ${c.description}`)
      const hidden = hiddenCount(ctx)
      const footer = hidden > 0
        ? `\n\n${hidden} command${hidden === 1 ? '' : 's'} hidden. try \`apropos <keyword>\` to discover more.`
        : ''
      return `${intro}\n${lines.join('\n')}${footer}`
    },
  }
}

function aliasCommand(): Command {
  return {
    name: 'alias',
    description: 'list shortcuts',
    aliases: ['aliases'],
    keywords: ['alias', 'aliases', 'shortcut', 'shortcuts'],
    man: { description: 'List registered command aliases and the count of hidden commands.' },
    run: (ctx) => {
      const pairs: string[] = []
      for (const c of ctx.allCommands) {
        if (!c.aliases?.length) continue
        for (const a of c.aliases) {
          pairs.push(`  ${a.padEnd(10, ' ')} → ${c.name}`)
        }
      }
      const hidden = hiddenCount(ctx)
      const footer = hidden > 0
        ? `\n\n...${hidden} command${hidden === 1 ? '' : 's'} remain undiscovered.`
        : ''
      return pairs.join('\n') + footer
    },
  }
}

function displayDescription(c: Command): string {
  if (c.description && c.description !== '—') return c.description
  return c.man?.description ?? '—'
}

function aproposCommand(): Command {
  return {
    name: 'apropos',
    description: 'find commands by concept',
    aliases: ['find', 'search'],
    keywords: ['apropos', 'find', 'search', 'discover', 'keyword', 'concept'],
    man: {
      description: 'Search command keywords by everyday concept.',
      args: '<keyword>',
      lore: 'Try concepts like: calm, fight, past, secret, fun, hack, info, quote.',
    },
    run: (ctx) => {
      const term = ctx.args[0]
      if (!term) {
        return CONCEPT_CATEGORIES.join('\n')
      }
      const expanded = Array.from(new Set(expandKeyword(term)))
      const matches: Command[] = []
      for (const c of ctx.allCommands) {
        const haystack = [c.name, ...(c.aliases ?? []), ...(c.keywords ?? [])].map((s) => s.toLowerCase())
        for (const e of expanded) {
          if (haystack.some((h) => h.includes(e) || e.includes(h))) {
            matches.push(c)
            break
          }
        }
      }
      if (matches.length === 0) {
        return `nothing found for "${term}". try: apropos (with no args) to see concepts.`
      }
      const lines = matches.map((c) => `  ${c.name.padEnd(12, ' ')} ${displayDescription(c)}`)
      return `${term} —\n${lines.join('\n')}`
    },
  }
}

function manCommand(): Command {
  return {
    name: 'man',
    description: 'manual for a command',
    aliases: ['manual', 'info'],
    keywords: ['man', 'manual', 'docs', 'help', 'info'],
    man: { description: 'Print full documentation for a command.', args: '<command>' },
    run: (ctx) => {
      const target = ctx.args[0]
      if (!target) return 'usage: man <command>'
      const cmd = ctx.allCommands.find((c) => c.name === target || c.aliases?.includes(target))
      if (!cmd) return `no manual for ${target}. try \`help\`.`
      const lines = [
        `${cmd.name} — ${cmd.description}`,
      ]
      if (cmd.aliases?.length) lines.push(`aliases: ${cmd.aliases.join(', ')}`)
      if (cmd.man?.args) lines.push(`usage: ${cmd.name} ${cmd.man.args}`)
      if (cmd.man?.lore) lines.push('', cmd.man.lore)
      return lines.join('\n')
    },
  }
}

function secretsCommand(): Command {
  return {
    name: 'secrets',
    description: '—',
    hidden: true,
    keywords: ['secret', 'secrets', 'hidden', 'easter', 'egg', 'ritual', 'mystery', 'undiscovered'],
    man: {
      description: 'A nudge toward the hidden.',
      lore: 'Some files are not in `help`. The filesystem holds more than the sections.',
    },
    run: () =>
      [
        'some files are not in `help`.',
        '`ls` shows the map. `cd` somewhere quiet. `cat` what you find.',
      ].join('\n'),
  }
}

export function cdSuccessVariant(section: string): string {
  return pick(CD_SUCCESS)(section)
}

export const discoverabilityCommands: Command[] = [
  helpCommand(),
  aliasCommand(),
  aproposCommand(),
  manCommand(),
  secretsCommand(),
]
