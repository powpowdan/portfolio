import type { Command } from '../types'
import { getProgress, type CategoryProgress, type Progress } from '../../../../lib/terminal/discovery'

const BAR_WIDTH = 8

function bar(found: number, size: number): string {
  const filled = size === 0 ? 0 : Math.round((found / size) * BAR_WIDTH)
  return '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled)
}

function namesColumn(c: CategoryProgress): string {
  if (c.found.length === 0) return `??? × ${c.missing}`
  const slots = [...c.found, ...Array.from({ length: c.missing }, () => '???')]
  return slots.join(', ')
}

function row(c: CategoryProgress): string {
  return `  ${c.category.padEnd(8, ' ')} ${bar(c.found.length, c.size)}  ${c.found.length}/${c.size}   ${namesColumn(c)}`
}

function trophiesCommand(): Command {
  return {
    name: 'trophies',
    description: 'show discovery progress',
    aliases: ['achievements', 'found', 'loot'],
    keywords: ['trophies', 'trophy', 'achievements', 'achievement', 'progress', 'score', 'status', 'discovered', 'found', 'game', 'collect', 'collection', 'hidden'],
    man: {
      description: 'Show hidden-command discovery progress.',
      lore: 'Some commands are not in `help`. Finding them is one thing. Running them counts.',
    },
    run: () => {
      const p: Progress = getProgress()
      const lines = ['discovery progress:', '']
      for (const c of p.categories) lines.push(row(c))
      lines.push('', `  total ${p.total}/${p.hiddenTotal}`)
      if (p.total === 0) {
        lines.push('', 'the map lives in `ls`. some directories are quieter than others.')
      }
      return lines.join('\n')
    },
  }
}

export const trophiesCommands: Command[] = [trophiesCommand()]
