# Easter Eggs Specification

## Purpose

Rewards curious visitors with hidden commands, film homages, and non-command surprises (devtools console signature, themed 404). Easter eggs are discoverable via the layered help system but never advertised on the surface, so finding them feels earned.
## Requirements
### Requirement: breathe command opens a breathing overlay
The hidden `breathe` command SHALL open a fullscreen breathing overlay with a soft cyan circle expanding and contracting at a meditative cadence. The command SHALL accept a `--calm` flag (default) using a slow ~6-breaths-per-minute cadence and a `--fight` flag using a fighter's round-breathing cadence. Pressing **Escape** or clicking the overlay SHALL dismiss it and return the visitor to the prompt. The overlay animates at its full cadence regardless of the visitor's `prefers-reduced-motion` setting.

#### Scenario: Default calm breathing
- **WHEN** the visitor runs `breathe` (or `breathe --calm`)
- **THEN** a fullscreen overlay appears with a circle breathing at the calm cadence
- **AND** a soft label indicates the phase (inhale / exhale)

#### Scenario: Fighter breathing
- **WHEN** the visitor runs `breathe --fight`
- **THEN** the overlay uses the fighter's round-breathing cadence instead

#### Scenario: Dismissing the overlay
- **WHEN** the visitor presses Escape (or clicks the overlay) while it is visible
- **THEN** the overlay closes and focus returns to the prompt

#### Scenario: Reduced motion enabled
- **WHEN** the visitor has `prefers-reduced-motion: reduce` enabled
- **THEN** the overlay still appears and animates at the chosen cadence (reduced-motion no longer softens it)

### Requirement: 1111 command reveals a secret transmission
The hidden `1111` command SHALL print a curated secret transmission (a personal line, a wish, or a link to something the author loves). The transmission content SHALL be deterministic per session but may vary across deployments as the author refreshes it.

#### Scenario: Running 1111
- **WHEN** the visitor runs `1111`
- **THEN** a short secret transmission is printed in a distinct visual style
- **AND** no error is raised

### Requirement: Visiting at 11:11 local time activates a subtle effect
When the visitor's local time is within the 11:11 minute (11:11:00 through 11:11:59) and the page is loaded or focused during that window, the system SHALL activate a subtle visual effect (e.g. the background dot-grid pulses once softly, or a hidden line appears briefly in the terminal output area).

#### Scenario: Loading during the 11:11 minute
- **WHEN** the page loads or refocuses during the 11:11 minute in the visitor's local timezone
- **THEN** a single subtle 11:11-themed visual moment occurs
- **AND** the effect does not repeat until the next 11:11 minute

### Requirement: kitchen command reveals chef-to-dev lore
The hidden `kitchen` command SHALL print flavor text revealing the author's prior career as a chef, that the kitchen was left roughly 6 years ago, and a short note connecting kitchen craft to dev craft. Family details SHALL NOT appear in this or any other command's output.

#### Scenario: Running kitchen
- **WHEN** the visitor runs `kitchen` (or discovers it via `apropos past`)
- **THEN** the output prints the chef-to-dev lore passage
- **AND** the passage references the discipline shared between kitchen and code craft
- **AND** no family information is present in the output

### Requirement: train command reveals muay thai lore
The hidden `train` command SHALL print flavor text revealing the author trains muay thai fighters, framed in a way that connects to the discipline and breath through-line of the site.

#### Scenario: Running train
- **WHEN** the visitor runs `train` (or discovers it via `apropos fight`)
- **THEN** the output prints the muay thai training lore passage
- **AND** the passage references breath, discipline, and craft

### Requirement: Film homage commands summon cinematic moments
The system SHALL provide hidden commands that each render a small interactive homage to a specific film: `matrix` (green character rain overlay, Escape or click to exit), `fight` (prints the rules of Fight Club in flavor), `samurai` (prints Hagakure or bushido passages), `heat` (prints the McCauley doctrine with a brief countdown), `bat` (types Roy Batty's "tears in rain" monologue slowly), `gladiator` (prints Maximus-themed lines including the "not yet" and "green fields" passages), `wick` (a brief desaturation gag with "excommunicado"), and `drive` (a slow color wash with "a real human being. and a real hero."). Motion-based commands (`matrix`, `drive`, `wick`, `heat`) play their motion regardless of the visitor's `prefers-reduced-motion` setting.

#### Scenario: matrix rain overlay
- **WHEN** the visitor runs `matrix`
- **THEN** a green character rain overlay covers the viewport
- **AND** Escape or a click dismisses the overlay and returns the visitor to the prompt

#### Scenario: bat monologue
- **WHEN** the visitor runs `bat`
- **THEN** the Roy Batty "tears in rain" monologue is typed character-by-character into the output area

#### Scenario: gladiator passages
- **WHEN** the visitor runs `gladiator`
- **THEN** the output includes the "not yet... not yet" line and the "riding in green fields" Elysium passage

#### Scenario: heat countdown
- **WHEN** the visitor runs `heat`
- **THEN** the output prints the McCauley attachment doctrine
- **AND** a brief countdown (referencing "if you feel the heat around the corner") plays in flavor

#### Scenario: Reduced motion handling for film commands
- **WHEN** the visitor has `prefers-reduced-motion: reduce` enabled
- **THEN** motion-based film commands (`matrix`, `drive`, `wick`, `heat`) still play their motion at full effect
- **AND** purely textual commands (`bat`, `samurai`, `fight`, `gladiator`) behave the same as without reduced motion

### Requirement: Shell gag commands respond with flavor
The system SHALL provide gag responses for canonical shell misuses: `sudo <anything>` SHALL respond with a permission-denied message in cyberpunk flavor (referencing the visitor not being authorized); `rm -rf /` SHALL respond with an anti-piracy-style gag; `vim` and `emacs` SHALL respond with editor-war flavor text. None of these SHALL actually perform destructive or blocking actions. Exceptions when hidden-command discovery is complete (root mode, per the discovery-progression capability): `sudo <anything>` SHALL respond "permission granted. it was always your machine.", and destructive `rm` forms SHALL open the deletion-confirmation ritual as defined by the discovery-progression capability instead of the anti-piracy gag. The editor gags are unaffected by root mode.

#### Scenario: sudo gag
- **WHEN** the visitor runs `sudo <anything>`
- **THEN** the output prints a permission-denied message in cyberpunk flavor
- **AND** no privileged action is attempted

#### Scenario: rm -rf gag
- **WHEN** the visitor runs `rm -rf /` (or a similar destructive variant)
- **THEN** the output prints an anti-piracy-style gag line
- **AND** no file or state is modified

#### Scenario: sudo gag after root
- **WHEN** a visitor with complete discovery runs `sudo <anything>`
- **THEN** the output is "permission granted. it was always your machine."
- **AND** no permission-denied text appears

#### Scenario: rm after root opens the ritual
- **WHEN** a visitor with complete discovery runs a destructive `rm` form
- **THEN** the deletion confirmation opens per the discovery-progression capability
- **AND** the anti-piracy gag does not print

### Requirement: DevTools console displays a crafted signature
When a visitor opens the browser developer tools console, the system SHALL have printed a hand-crafted ASCII art signature with a short message. The console output SHALL be benign and SHALL NOT mimic security warnings or system errors.

#### Scenario: Opening devtools
- **WHEN** a visitor opens the browser console on the site
- **THEN** an ASCII art signature and a short message are visible in the console
- **AND** the content is clearly decorative and not a fake system warning

### Requirement: Themed 404 page
The system SHALL render a themed 404 page for unknown routes, styled to match the terminal aesthetic and including a flavor line (e.g. "there is no spoon. (also, no page.)") plus a way back to the home page or shell.

#### Scenario: Navigating to an unknown route
- **WHEN** the visitor navigates to a path that does not exist
- **THEN** a terminal-styled 404 page is rendered
- **AND** a flavor line and a return link are visible

### Requirement: Ritual overlays render at the document level
The `breathe`, `matrix`, `wick`, and `drive` overlays SHALL render at the document-body level — outside any terminal-ancestor containing block — so that their fullscreen `position: fixed` styling is resolved against the viewport rather than the terminal window. This SHALL hold regardless of any `transform`, `filter`, `backdrop-filter`, `will-change`, or `contain` value applied to an ancestor of the terminal. Without this, the overlays' fullscreen/viewport-covering behavior (specified by the existing ritual requirements in this capability) is silently broken.

#### Scenario: Overlay covers the viewport
- **WHEN** the visitor runs `breathe` (or `matrix`, `wick`, `drive`)
- **THEN** the overlay covers the full browser viewport
- **AND** is not clipped to or constrained within the terminal window
- **AND** dismisses on Escape or click as specified by each ritual's existing requirement

#### Scenario: Overlay escapes ancestor containing blocks
- **WHEN** the terminal's host element has `backdrop-filter` or a non-`none` computed `transform` applied
- **AND** the visitor runs an overlay command
- **THEN** the overlay still covers the full viewport
- **AND** the ancestor styling does not trap or clip the overlay

