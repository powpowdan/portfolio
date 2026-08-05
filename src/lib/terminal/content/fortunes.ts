export interface Fortune {
  text: string
  attribution: string
}

export const FORTUNES: Fortune[] = [
  { text: 'Be here now.', attribution: 'Ram Dass' },
  {
    text: 'Smile, breathe, and go slowly.',
    attribution: 'Thich Nhat Hanh',
  },
  {
    text: 'Realize deeply that the present moment is the only one you ever have.',
    attribution: 'Eckhart Tolle',
  },
  {
    text: 'The obstacle is the way.',
    attribution: 'Marcus Aurelius',
  },
  {
    text: 'Fall down seven times, stand up eight.',
    attribution: 'Japanese proverb',
  },
  {
    text: 'Ever tried. Ever failed. No matter. Try again. Fail again. Fail better.',
    attribution: 'Samuel Beckett',
  },
  {
    text: 'What we call the beginning is often the end. And to make an end is to make a beginning.',
    attribution: 'T.S. Eliot',
  },
  {
    text: 'The things you own end up owning you.',
    attribution: 'Fight Club',
  },
  {
    text: "It's only after we've lost everything that we're free to do anything.",
    attribution: 'Fight Club',
  },
  {
    text: 'The street finds its own uses for things.',
    attribution: 'William Gibson',
  },
  {
    text: "The future is already here — it's just not very evenly distributed.",
    attribution: 'William Gibson',
  },
  {
    text: 'The sky above the port was the color of television, tuned to a dead channel.',
    attribution: 'William Gibson',
  },
  {
    text: 'Life in every breath. That is the way of the warrior.',
    attribution: 'The Last Samurai',
  },
  {
    text: 'A man does what he can, until his destiny is revealed to him.',
    attribution: 'The Last Samurai',
  },
  {
    text: 'What we do in life echoes in eternity.',
    attribution: 'Gladiator',
  },
  {
    text: 'Death smiles at us all. All we can do is smile back.',
    attribution: 'Gladiator',
  },
  {
    text: 'Strength and honor.',
    attribution: 'Gladiator',
  },
  {
    text: 'There is no spoon.',
    attribution: 'The Matrix',
  },
  {
    text: "I can only show you the door. You're the one that has to walk through it.",
    attribution: 'The Matrix',
  },
  {
    text: 'All those moments will be lost in time, like tears in rain.',
    attribution: 'Blade Runner',
  },
  {
    text: 'A real human being. And a real hero.',
    attribution: 'Drive',
  },
  {
    text: 'Once you understand the way broadly, you see it in everything.',
    attribution: 'Miyamoto Musashi',
  },
  {
    text: 'The two most powerful warriors are patience and time.',
    attribution: 'Leo Tolstoy',
  },
  {
    text: 'Synchronicity is an ever-present reality for those who have eyes to see.',
    attribution: 'Carl Jung',
  },
  {
    text: 'Do not go gentle into that good night. Rage, rage against the dying of the light.',
    attribution: 'Dylan Thomas',
  },
  {
    text: 'The cave you fear to enter holds the treasure you seek.',
    attribution: 'Joseph Campbell',
  },
]

export function randomFortune(): Fortune {
  return FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
}
