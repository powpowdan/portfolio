# Responsive Navigation Specification

## Purpose

Provides section navigation that adapts to the viewport so visitors can jump between portfolio sections on every device size.

## Requirements

### Requirement: Navigation adapts to breakpoint
The system SHALL render section navigation that provides access to the about, projects, and skills sections on all viewport sizes. Below the `lg` breakpoint the system SHALL show a fixed bottom navigation bar; at `lg` and above it SHALL show the left sidebar. The interactive terminal SHALL additionally offer `cd <section>`, `cat <section>`, and `ls` as alternative navigation paths; the existing nav dots and bottom bar SHALL remain unchanged so non-typing visitors are unaffected.

#### Scenario: Small viewport shows bottom navigation
- **WHEN** the page is viewed on a viewport narrower than 1024px
- **THEN** a fixed bottom navigation bar with links to about, projects, and skills is visible
- **AND** the left sidebar is hidden

#### Scenario: Desktop viewport shows sidebar
- **WHEN** the page is viewed on a viewport 1024px or wider
- **THEN** the left sidebar navigation is visible
- **AND** the bottom navigation bar is hidden

#### Scenario: Navigating via terminal command
- **WHEN** the visitor runs `cd projects` in the interactive terminal
- **THEN** the page scrolls to the projects section
- **AND** the sidebar or bottom nav highlights projects as active (depending on viewport)
- **AND** the existing nav UI remains functional for visitors who do not use the terminal

### Requirement: Active section is indicated
The system SHALL visually indicate the currently active section in both navigation layouts. Active-section changes triggered by terminal `cd` commands SHALL update the nav indicators identically to scroll-driven changes.

#### Scenario: Active section highlight
- **WHEN** the user scrolls to a section
- **THEN** the corresponding navigation link SHALL be highlighted

#### Scenario: Following a nav link scrolls to a section
- **WHEN** the user taps or clicks a navigation link
- **THEN** the page scrolls to that section
- **AND** the navigation shows that section as active

#### Scenario: Terminal-driven section change updates nav
- **WHEN** the visitor runs `cd skills` in the terminal
- **THEN** the navigation indicators reflect skills as the active section

### Requirement: Bottom navigation respects safe areas
The bottom navigation SHALL pad its content to avoid notched-device home indicators and on-screen navigation bars.

#### Scenario: Notched device
- **WHEN** the page is rendered on a device with a home indicator
- **THEN** the bottom navigation content is offset by the safe-area inset

### Requirement: Bottom navigation provides adequate touch targets
Each bottom navigation link SHALL provide a touch target of at least 44 by 44 CSS pixels.

#### Scenario: Touch target sizing
- **WHEN** a user attempts to tap a bottom navigation link
- **THEN** the tappable area is at least 44 by 44 CSS pixels
