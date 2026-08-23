import { readSet, writeSet, storageKey } from './storage'

export type Category = 'lore' | 'films' | 'gags' | 'secrets'

const DISCOVERED_KEY = 'discovered'

export const CATEGORY_ROSTERS: Record<Category, readonly string[]> = {
  lore: ['kitchen', 'train', '1111', 'breathe'],
  films: ['matrix', 'fight', 'samurai', 'heat', 'bat', 'gladiator', 'wick', 'drive'],
  gags: ['sudo', 'rm', 'vim', 'emacs', 'nano', 'hack'],
  secrets: ['secrets'],
}

const ALL_HIDDEN: readonly string[] = Object.values(CATEGORY_ROSTERS).flat()

export const HIDDEN_TOTAL = ALL_HIDDEN.length

const listeners = new Set<() => void>()

let discovered = new Set<string>(readSet(DISCOVERED_KEY))

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== storageKey(DISCOVERED_KEY)) return
    discovered = new Set(readSet(DISCOVERED_KEY))
    notify()
  })
}

function notify(): void {
  listeners.forEach((listener) => listener())
}

function persist(): void {
  writeSet(DISCOVERED_KEY, discovered)
}

export function categoryOf(name: string): Category | undefined {
  for (const [category, roster] of Object.entries(CATEGORY_ROSTERS) as [Category, readonly string[]][]) {
    if (roster.includes(name)) return category
  }
  return undefined
}

export function isDiscovered(name: string): boolean {
  return discovered.has(name)
}

export interface DiscoveryResult {
  category: Category
  found: number
  size: number
  completed: boolean
  total: number
  hiddenTotal: number
  allFound: boolean
}

export function recordDiscovery(name: string): DiscoveryResult | null {
  const category = categoryOf(name)
  if (!category || discovered.has(name)) return null
  discovered.add(name)
  persist()
  notify()
  const roster = CATEGORY_ROSTERS[category]
  const found = roster.filter((n) => discovered.has(n)).length
  return {
    category,
    found,
    size: roster.length,
    completed: found === roster.length,
    total: discovered.size,
    hiddenTotal: HIDDEN_TOTAL,
    allFound: discovered.size >= HIDDEN_TOTAL,
  }
}

export function recordAll(): boolean {
  const wasComplete = discovered.size >= HIDDEN_TOTAL
  discovered = new Set(ALL_HIDDEN)
  persist()
  notify()
  return !wasComplete
}

export function resetDiscovery(): boolean {
  const hadProgress = discovered.size > 0
  discovered = new Set()
  persist()
  notify()
  return hadProgress
}

export interface CategoryProgress {
  category: Category
  found: string[]
  missing: number
  size: number
}

export interface Progress {
  categories: CategoryProgress[]
  total: number
  hiddenTotal: number
}

export function getProgress(): Progress {
  const categories = (Object.entries(CATEGORY_ROSTERS) as [Category, readonly string[]][]).map(
    ([category, roster]) => {
      const found = roster.filter((n) => discovered.has(n))
      return { category, found, missing: roster.length - found.length, size: roster.length }
    },
  )
  return { categories, total: discovered.size, hiddenTotal: HIDDEN_TOTAL }
}

export function isRoot(): boolean {
  return discovered.size >= HIDDEN_TOTAL
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  listener()
  return () => {
    listeners.delete(listener)
  }
}
