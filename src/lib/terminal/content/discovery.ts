import type { Category, CategoryProgress, DiscoveryResult, Progress } from '../discovery'
import { pick } from '../random'
import { otherWhisper } from './whispers'

export function discoveryToast(r: DiscoveryResult): string {
  if (r.completed) {
    return `✦ ${r.category} complete — ${r.size}/${r.size}`
  }
  return `✦ new discovery — ${r.category} ${r.found}/${r.size} · total ${r.total}/${r.hiddenTotal}`
}

export interface TransmissionCopy {
  header: string
  body: string[]
  signoff: string
  root: string
  maintenance: string
  rmHint: string
}

export function transmissionCopy(hiddenTotal: number): TransmissionCopy {
  return {
    header: `✦ ${hiddenTotal} of ${hiddenTotal} — every stone turned`,
    body: ['most visitors skim. you dug.', "that's really the whole hiring pitch."],
    signoff: 'thanks for playing. — dan',
    root: '(root granted.)',
    maintenance: 'maintenance codes: enterthecode · exitthecode',
    rmHint: 'rm -rf / — if you mean it.',
  }
}

export function nudgeLine(p: Progress): string {
  return `${p.hiddenTotal} hidden · ${p.total} found · try \`trophies\``
}

export const CATEGORY_HINTS: Record<Category, string> = {
  lore: 'the lore holds more than two stories.',
  films: 'films somewhere in here',
  gags: 'terminals love jokes.',
  secrets: 'a secret is still being kept.',
}

export function lateGameLine(remaining: number): string {
  return `so close. ${remaining} left. breathe.`
}

export const ROOT_WHISPER = 'root looks good on you.'

export interface WhisperSession {
  nudgeFired: boolean
  lastWasNarrator: boolean
  trophiesRun: boolean
  lastWhisper?: string
  whisperedCategories: ReadonlySet<Category>
}

export interface WhisperPick {
  text: string
  narrator: boolean
  category?: Category
}

export function nextWhisper(session: WhisperSession, p: Progress): WhisperPick | null {
  if (p.total >= p.hiddenTotal) {
    return Math.random() < 0.2 ? { text: ROOT_WHISPER, narrator: true } : null
  }
  if (!session.nudgeFired && !session.trophiesRun) {
    return { text: nudgeLine(p), narrator: true }
  }
  const remaining = p.hiddenTotal - p.total
  const narratorEligible = p.total >= 1 && !session.lastWasNarrator && Math.random() < 1 / 3
  if (narratorEligible) {
    if (remaining <= p.hiddenTotal - 17) {
      return { text: lateGameLine(remaining), narrator: true }
    }
    const unwhispered: CategoryProgress[] = p.categories.filter(
      (c) => c.missing > 0 && !session.whisperedCategories.has(c.category),
    )
    if (unwhispered.length > 0 && Math.random() < 0.5) {
      const c = pick(unwhispered)
      return { text: CATEGORY_HINTS[c.category], narrator: true, category: c.category }
    }
  }
  return { text: otherWhisper(session.lastWhisper), narrator: false }
}
