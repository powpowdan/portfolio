import type { Command } from '../types'
import { pick } from '../../../../lib/terminal/random'
import { cdSuccessVariant } from './discoverability'

const SECTIONS = ['about', 'projects', 'skills', 'contact'] as const
type Section = (typeof SECTIONS)[number]

const SECTION_FILES: Record<Section, string> = {
  about: 'about.txt',
  projects: 'projects/',
  skills: 'skills.json',
  contact: 'contact.vcf',
}

const CAT_CONTENT: Record<Section, string> = {
  about: [
    'day   — building large-scale web apps, automation, infrastructure.',
    'night — linux, ai, automations, custom software for the world.',
    '',
    'focus: full-stack · devops · automation · ai/llms · accessibility',
    '',
    'role       full-stack developer',
    'location   ottawa, on',
    'clearance  secret',
    'stack      linux · ai · cloud',
  ].join('\n'),
  projects: [
    'meditation app       react · next.js · mongodb',
    'public camera map    typescript · mapbox · rest api',
    '',
    '(use `cd projects` to view full cards)',
  ].join('\n'),
  skills: [
    'languages    python · java · js · ts · bash · sql',
    'frontend     react · next.js · tailwind · bootstrap',
    'backend      git · node · azure · vercel',
    'databases    postgres · mongo · mysql · oracle',
    'platforms    aem · sharepoint · drupal · wordpress',
    'standards    wcag 2.2 · ga4 · adobe analytics · power bi',
  ].join('\n'),
  contact: [
    'email     daniel.brown.gov@gmail.com',
    'github    powpowdan',
    '',
    '(use `email` or `github` for direct links)',
  ].join('\n'),
}

function isSection(value: string): value is Section {
  return (SECTIONS as readonly string[]).includes(value)
}

function normalizeSection(input: string): Section | null {
  const lower = input.toLowerCase().replace(/\/+$/, '').trim()
  if (isSection(lower)) return lower
  for (const s of SECTIONS) {
    if (SECTION_FILES[s].replace(/\/+$/, '') === lower) return s
    if (lower.startsWith(s + '.')) return s
  }
  return null
}

const LS_HINTS = [
  '(use `cd <section>` or `cat <section>` to read)',
  '(try: cat about.txt)',
  '(these are your files)',
  '(cd into a section to explore)',
  '(read with cat, jump with cd)',
] as const

const CD_HERE = ['/home/dan', '~', '/home/dan/portfolio.sh'] as const

const CD_ERRORS = [
  (arg: string) => `no such directory: ${arg}. try one of: ${SECTIONS.join(', ')}`,
  (arg: string) => `cd: ${arg}: not a section. ls to see what's here`,
  (arg: string) => `${arg}? nothing there. ls for the map`,
] as const

const CAT_ERRORS = [
  (arg: string) => `cat: ${arg}: no such file. try one of: ${SECTIONS.map((s) => SECTION_FILES[s]).join(', ')}`,
  (arg: string) => `cat: ${arg}: not found. ls to see the files`,
  (arg: string) => `${arg} doesn't exist here. ls for options`,
] as const

async function* lsOutput() {
  yield { text: 'about.txt      projects/      skills.json      contact.vcf', delayMs: 60 }
  yield { text: '', newline: true, delayMs: 120 }
  yield { text: pick(LS_HINTS), delayMs: 200, className: 'text-muted/60' }
}

function cdCommand(): Command {
  return {
    name: 'cd',
    description: 'jump to a section',
    aliases: ['open', 'go'],
    keywords: ['go', 'jump', 'section', 'scroll', 'navigate', 'open'],
    man: { description: 'Jump to a section by scrolling the page to it.', args: '<section: about|projects|skills|contact>' },
    run: (ctx) => {
      const arg = ctx.args[0] ?? ''
      if (arg === '' || arg === '.' || arg === '..' || arg === '~') {
        return pick(CD_HERE)
      }
      const target = normalizeSection(arg)
      if (!target) {
        return pick(CD_ERRORS)(arg)
      }
      ctx.scrollToSection(target)
      return cdSuccessVariant(target)
    },
  }
}

function catCommand(): Command {
  return {
    name: 'cat',
    description: 'read a section inline',
    aliases: ['read', 'show'],
    keywords: ['read', 'show', 'view', 'inline', 'print'],
    man: { description: 'Print a section content inline without scrolling.', args: '<section: about|projects|skills|contact>' },
    run: (ctx) => {
      const arg = ctx.args[0] ?? ''
      const target = normalizeSection(arg)
      if (!target) {
        return pick(CAT_ERRORS)(arg)
      }
      return CAT_CONTENT[target]
    },
  }
}

function lsCommand(): Command {
  return {
    name: 'ls',
    description: 'list sections',
    aliases: ['list', 'dir'],
    keywords: ['list', 'files', 'sections', 'dir', 'show'],
    man: { description: 'List the navigable sections as if they were files.' },
    run: () => lsOutput(),
  }
}

export const navigationCommands: Command[] = [lsCommand(), cdCommand(), catCommand()]
