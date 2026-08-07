'use client'

import { useEffect } from 'react'

const SIGNATURE = String.raw`
██████  ██████
██▓▓▓██ ██▓▓▓██
██▓  ██▓██████▓▓
██▓  ██▓██▓▓▓██
██████▓▓██████▓▓
 ▓▓▓▓▓▓  ▓▓▓▓▓▓

Heyo!  type 'help' to begin.
`

const MESSAGE = `%c${SIGNATURE}
%cyou opened the console. good eye.
try \`apropos secret\` in the terminal. or just type 1111.
— Dan
`

export default function ConsoleSignature() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    // eslint-disable-next-line no-console
    console.log(
      MESSAGE,
      'color: #00d4ff; font-family: monospace; font-size: 14px; line-height: 1.0; font-weight: bold;',
      'color: #888; font-family: monospace;',
    )
  }, [])
  return null
}
