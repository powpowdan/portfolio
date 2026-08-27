# Mobile UX Specification

## Purpose

Makes the portfolio comfortable to use on phones and tablets through touch-friendly tap targets, responsive spacing and typography, safe-area handling, and reduced-motion support.

## Requirements

### Requirement: Touch-friendly tap targets
Interactive elements such as navigation links, section links, contact links, and project links SHALL provide a minimum touch target of 44 by 44 CSS pixels on touch devices, either through visual size or an increased hit area.

#### Scenario: Tapping a small link
- **WHEN** a user taps a text link on a touch device
- **THEN** the tap is registered reliably because the effective hit area is at least 44 by 44 CSS pixels

### Requirement: Responsive section spacing and typography
Sections SHALL scale vertical padding and text sizes so content is comfortable on small screens without cramped layout or excessive scroll.

#### Scenario: Narrow viewport
- **WHEN** the page is viewed on a viewport narrower than 640px
- **THEN** sections use reduced vertical padding
- **AND** text remains legible with no horizontal overflow

#### Scenario: Mobile landscape
- **WHEN** the page is viewed in landscape orientation on a phone
- **THEN** all sections remain fully reachable with no content clipped or unreachable

### Requirement: No horizontal overflow
The page SHALL NOT overflow horizontally on any viewport width from 320px upward. The interactive terminal, its output area, and any easter-egg overlays SHALL respect this constraint, wrapping long lines and clipping or scaling wide content rather than producing horizontal scroll.

#### Scenario: Minimum width
- **WHEN** the page is rendered at 320px wide
- **THEN** no horizontal scrolling occurs
- **AND** long terminal output lines wrap rather than overflow

#### Scenario: Easter-egg overlay on narrow viewport
- **WHEN** a fullscreen easter-egg overlay (such as the breathing overlay) is open at 320px wide
- **THEN** the overlay fits within the viewport with no horizontal scroll

### Requirement: Reduced motion respected
When the user's operating system requests reduced motion, typing and scroll-triggered animations SHALL be disabled or minimized. This SHALL additionally cover all glitch effects (text-scramble-decode, chromatic aberration, signal-burst), the boot sequence (which SHALL print instantly), and any motion-based film homage commands (matrix rain, drive color wash, wick desaturation, heat countdown), which SHALL fall back to instant or text-only equivalents.

#### Scenario: prefers-reduced-motion enabled
- **WHEN** the user has `prefers-reduced-motion` enabled
- **THEN** typing animations complete instantly or show a static state
- **AND** scroll-triggered entrance animations do not move content
- **AND** glitch effects do not engage and signal-burst does not play
- **AND** motion-based easter-egg commands fall back to text-only or instant equivalents
