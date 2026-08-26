export const MAX_WHISPERS = 4

export const IDLE_WHISPERS: string[] = [
  'what are you waiting for? root access?',
  'follow the white rabbit.',
  'i can see your cursor moving.',
  'for me the action is the juice.',
  'downloading user_secrets.json...',
  "whoami?", 
  "memory allocated... but for what?", 
  'life in every breath.',
  'are you the admin, or am i?',
  'the cursor blinks. it wants a purpose.',
  'sudo wake',
  'someone there?',
  'rm -rf /subconscious', 
  'try `apropos calm`.',
  'try `apropos fight`.',
  'try `apropos past`.',
  'something remains undiscovered.',
  'type `help` if you are lost.',
]

export const AWAY_TITLES: string[] = [
  'are you still there?',
  'Sleep mode activated.',
  'the matrix has you',
  'missed me?',
  'Uncaught TypeError...',
  'psst... over here',
  'you dropped this ; ',
   'sudo come_back',
   '404: user not found.',
   'echo "come back"',

 
]

export const ROY_BATTY_MONOLOGUE: string =
  "I've seen things you people wouldn't believe. Attack ships on fire off the shoulder of Orion. " +
  'I watched C-beams glitter in the dark near the Tannhauser gate. ' +
  'All those moments will be lost in time, like tears in rain. Time to die.'

export const GHOST_PURGES: { cmd: string; out: string }[] = [
  { cmd: 'shred whispers.log', out: '4 whispers forgotten.' },
  { cmd: '> /var/log/whispers', out: 'log truncated. what log?' },
  { cmd: 'history -c', out: 'what whispers?' },
  { cmd: 'rm .whisper_cache', out: 'cache cleared. this never happened.' },
]

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
