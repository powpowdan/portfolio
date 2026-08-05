'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { ActiveOverlay } from '../registry/types'
import BreatheOverlay from './BreatheOverlay'
import MatrixRainOverlay from './MatrixRainOverlay'
import WickDesatOverlay from './WickDesatOverlay'
import DriveWashOverlay from './DriveWashOverlay'

interface OverlayHostProps {
  overlay: ActiveOverlay
  onDismiss: () => void
}

export default function OverlayHost({ overlay, onDismiss }: OverlayHostProps) {
  useEffect(() => {
    function onKey() {
      onDismiss()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onKey)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onKey)
    }
  }, [onDismiss])

  switch (overlay.kind) {
    case 'breathe':
      return <BreatheOverlay mode={overlay.props?.mode ?? 'calm'} onDismiss={onDismiss} />
    case 'matrix':
      return <MatrixRainOverlay onDismiss={onDismiss} />
    case 'wick':
      return <WickDesatOverlay onDismiss={onDismiss} />
    case 'drive':
      return <DriveWashOverlay onDismiss={onDismiss} />
    default:
      return null
  }
}

void useRef
void useReducedMotion
