export const SYNONYMS: Record<string, string[]> = {
  calm: ['breathe', 'meditate', 'relax', 'still', 'peace', 'slow', 'breath', 'breathe'],
  fight: ['train', 'martial', 'combat', 'box', 'muay', 'gym', 'strong', 'body', 'fight'],
  past: ['kitchen', 'old', 'before', 'chef', 'food', 'cooking', 'history', 'life', 'story'],
  secret: ['1111', 'wish', 'sign', 'sync', 'magic', 'luck', 'hidden'],
  fun: ['matrix', 'game', 'hack', 'cool', 'easter', 'joke'],
  hack: ['sudo', 'admin', 'root', 'danger', 'delete', 'matrix', 'code'],
  help: ['help', 'list', 'find', 'how', 'what', 'commands'],
  hidden: ['secret', 'easter', 'all', 'more', 'hidden'],
  info: ['neofetch', 'system', 'specs', 'about', 'computer', 'setup', 'whoami'],
  now: ['today', 'current', 'doing', 'life'],
  quote: ['fortune', 'wisdom', 'words', 'say'],
}

export function expandKeyword(term: string): string[] {
  const lower = term.toLowerCase()
  const expanded = new Set<string>([lower])
  for (const [canonical, list] of Object.entries(SYNONYMS)) {
    if (canonical === lower || list.includes(lower)) {
      expanded.add(canonical)
      list.forEach((s) => expanded.add(s))
    }
  }
  return Array.from(expanded)
}
