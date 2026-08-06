export const MAX_WHISPERS = 4

export const IDLE_WHISPERS: string[] = [
  'there is no spoon.',
  'follow the white rabbit.',
  'not yet... not yet.',
  'for me the action is the juice.',
  "you're the one that has to walk through it.",
  'strength and honor.',
  'life in every breath.',
  'try `apropos calm`.',
  'try `apropos fight`.',
  'try `apropos past`.',
  'something remains undiscovered.',
  'type `help` if you are lost.',
]

export const AWAY_TITLES: string[] = [
  'be here now',
  'strength and honor',
  'the matrix has you',
  'missed me?',
  'attached to nothing',
  'come back',
]

export const ROY_BATTY_MONOLOGUE: string =
  "I've seen things you people wouldn't believe. Attack ships on fire off the shoulder of Orion. " +
  'I watched C-beams glitter in the dark near the Tannhauser gate. ' +
  'All those moments will be lost in time, like tears in rain. Time to die.'

export function otherWhisper(currentText?: string): string {
  if (IDLE_WHISPERS.length <= 1) return IDLE_WHISPERS[0]
  let pick = IDLE_WHISPERS[Math.floor(Math.random() * IDLE_WHISPERS.length)]
  let guard = 0
  while (pick === currentText && guard < 8) {
    pick = IDLE_WHISPERS[Math.floor(Math.random() * IDLE_WHISPERS.length)]
    guard += 1
  }
  return pick
}
