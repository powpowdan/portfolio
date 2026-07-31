'use client'

export default function BackgroundEffects() {
  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none dot-grid"
        aria-hidden="true"
      />
      <div className="noise" aria-hidden="true" />
    </>
  )
}
