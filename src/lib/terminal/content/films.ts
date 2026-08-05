export const FILM_PAYLOADS: Record<
  string,
  { flavor: string[]; motion?: 'rain' | 'desaturate' | 'wash' | 'countdown' }
> = {
  matrix: {
    flavor: [
      'wake up.',
      'the matrix has you.',
      'follow the white rabbit.',
      '',
      '(knock knock)',
    ],
    motion: 'rain',
  },
  fight: {
    flavor: [
      'the rules of fight club:',
      '1. you do not talk about fight club.',
      '2. you DO NOT talk about fight club.',
      '3. if someone yells stop, goes limp, or taps out, the fight is over.',
      '4. only two guys to a fight.',
      '5. one fight at a time.',
      '6. no shirts, no shoes.',
      '7. fights go on as long as they have to.',
      '8. if this is your first night at fight club, you have to fight.',
    ],
  },
  samurai: {
    flavor: [
      '— from the hagakure —',
      '',
      'the way of the samurai is found in death.',
      'it is a good viewpoint to see the world as a dream.',
      'when you have a problem like a nightmare, you will wake up from the dream.',
      '',
      'life in every breath. that is the way of the warrior.',
    ],
  },
  heat: {
    flavor: [
      '— the doctrine —',
      '',
      'do not let yourself get attached to anything',
      'you are not willing to walk out on in thirty seconds flat',
      'if you feel the heat around the corner.',
      '',
      'for me the action is the juice.',
    ],
    motion: 'countdown',
  },
  bat: {
    flavor: [
      "I've seen things you people wouldn't believe.",
      'attack ships on fire off the shoulder of Orion.',
      'I watched C-beams glitter in the dark near the Tannhauser gate.',
      'All those moments will be lost in time, like tears in rain.',
      'Time to die.',
    ],
  },
  gladiator: {
    flavor: [
      '— maximus —',
      '',
      'hold the line. stay with me.',
      'not yet... not yet.',
      '',
      'if you find yourself alone, riding in green fields with the sun on your face,',
      'do not be troubled — for you are in Elysium, and you are already dead.',
      '',
      'what we do in life echoes in eternity.',
    ],
  },
  wick: {
    flavor: ['excommunicado.', '', 'the table has been informed.'],
    motion: 'desaturate',
  },
  drive: {
    flavor: ['a real human being.', 'and a real hero.'],
    motion: 'wash',
  },
}
