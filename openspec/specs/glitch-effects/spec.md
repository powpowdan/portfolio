# Glitch Effects Specification

## Purpose

Adds a warm, lo-fi glitch layer to the site (text-scramble-decode, soft chromatic aberration, rare signal-burst) that feels like the visual register of chillhop rather than harsh digital noise. Every effect is gated behind `prefers-reduced-motion` so reduced-motion visitors get a calm, instant experience.
## Requirements
### Requirement: Section headings use scramble-decode on view
Section headings SHALL animate via a scramble-decode effect when they enter the viewport: each character rapidly cycles through random glyphs before resolving to its target character, producing a decryption-like reveal. The scramble plays regardless of the visitor's `prefers-reduced-motion` setting; a CSS `prefers-reduced-motion` layer provides soft accommodation only and does not suppress the effect.

#### Scenario: Heading enters viewport
- **WHEN** a section heading scrolls into view
- **THEN** the heading text scrambles briefly and resolves to its final value
- **AND** the effect runs once per heading per page load

#### Scenario: Reduced motion enabled
- **WHEN** the visitor has `prefers-reduced-motion: reduce` enabled
- **THEN** the scramble still plays and the heading resolves as usual (reduced-motion no longer suppresses it)

### Requirement: Soft chromatic aberration on hover
Specific chrome elements (the terminal window title bar, the resume/footer link, and section heading glyphs) SHALL exhibit a brief, soft chromatic aberration (subtle cyan/magenta channel offset) on pointer hover. The effect SHALL be subtle rather than aggressive, in keeping with the lo-fi register.

#### Scenario: Hovering a chromatic-aberration target
- **WHEN** a pointer hovers over a registered target element
- **THEN** the element displays a brief, soft channel-offset effect
- **AND** the effect resolves when the pointer leaves

#### Scenario: Reduced motion or touch device
- **WHEN** the visitor has `prefers-reduced-motion: reduce` enabled or is on a touch-only device
- **THEN** the chromatic aberration effect is disabled

### Requirement: Rare signal-burst glitch
The system SHALL, on roughly 1 in 50 page loads, play a brief full-viewport signal-burst effect (a one-frame static tear lasting roughly 150ms) shortly after the boot sequence completes. The `hack` command SHALL trigger the same effect on demand. The effect plays regardless of the visitor's `prefers-reduced-motion` setting.

#### Scenario: Random signal-burst
- **WHEN** the page loads on the 1-in-50 roll
- **THEN** a single brief signal-burst plays shortly after boot
- **AND** no further burst plays for the rest of the session

#### Scenario: Triggered by hack command
- **WHEN** the visitor runs the `hack` command
- **THEN** the signal-burst effect plays on demand
- **AND** the command output references the glitch in flavor text

#### Scenario: Reduced motion enabled
- **WHEN** the visitor has `prefers-reduced-motion: reduce` enabled
- **THEN** both the random and `hack`-triggered signal-burst still play (reduced-motion no longer suppresses them)

### Requirement: Signal-burst renders at the document level
The signal-burst effect SHALL render at the document-body level — outside any terminal-ancestor containing block — so its full-viewport styling is resolved against the viewport rather than the terminal window. This SHALL hold regardless of any `transform`, `filter`, `backdrop-filter`, `will-change`, or `contain` value applied to an ancestor of the terminal.

#### Scenario: Signal-burst covers the viewport
- **WHEN** the signal-burst plays (the random 1-in-50 boot roll, or triggered by the `hack` command)
- **THEN** the effect covers the full browser viewport
- **AND** is not clipped to or constrained within the terminal window

#### Scenario: Signal-burst escapes ancestor containing blocks
- **WHEN** the terminal's host element has `backdrop-filter` or a non-`none` computed `transform` applied
- **AND** the signal-burst plays
- **THEN** the effect still covers the full viewport
- **AND** the ancestor styling does not trap or clip the effect

