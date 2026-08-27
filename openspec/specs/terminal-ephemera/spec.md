# Terminal Ephemera Specification

## Purpose

Makes the site feel inhabited rather than static by varying content per load and over time. Pulls from curated pools (fortune, last-login formats, whisper lines, boot variants) and injects real build metadata (git SHA) so returning visitors notice small differences. Also anchors the author's identity persistently in the chrome so the portfolio always names its owner.

## Requirements

### Requirement: Fortune pool serves curated lines
The system SHALL maintain a curated fortune pool of roughly 20-30 lines drawn from literature, zen and stoic tradition, and cinema (Heat, The Last Samurai, Gladiator, The Matrix, Fight Club, Blade Runner, Drive, Ghost Dog, Musashi, Jung, et al.). On each boot the system SHALL select one fortune at random and print it as the boot MOTD line. Selection SHALL be uniform across the pool.

#### Scenario: Fortune printed on boot
- **WHEN** the boot sequence runs
- **THEN** a single line from the fortune pool is printed as `motd: <line> — <attribution>` (or equivalent formatting)
- **AND** the line differs across reloads in expectation

#### Scenario: Fortune pool composition
- **WHEN** the fortune pool is inspected
- **THEN** it contains lines spanning the literary, zen, stoic, and cinematic sources named above
- **AND** weights the selection toward soulful-cool rather than pure edge

### Requirement: Last-login line includes an 11:11 breadcrumb
The boot sequence SHALL print a `last login <weekday> <month> <day> <time> on ttys001` style line. The timestamp SHALL be randomized per load, but SHALL occasionally (roughly 1 in 11 loads) use `11:11` as the time to seed the 11:11 thread without being obvious.

#### Scenario: Standard last-login
- **WHEN** the boot sequence runs on a non-11:11 roll
- **THEN** a last-login line is printed with a plausible randomized weekday and time

#### Scenario: 11:11 breadcrumb
- **WHEN** the boot sequence runs on the 1-in-11 roll
- **THEN** the last-login line's time reads `11:11`

### Requirement: Footer shows real build-time git SHA
The system SHALL compute the current git commit SHA at build time and expose it in the site footer as `build <short-sha>`. The SHA SHALL reflect the actual deployed commit and SHALL change with each deployment.

#### Scenario: Footer reflects the deployed commit
- **WHEN** the site is built and deployed
- **THEN** the footer renders `build <short-sha>` where `<short-sha>` matches the git commit being built

### Requirement: Terminal title bar persistently names the author
The terminal window's title bar SHALL display an author-identifying label in unix flavor (`dan@portfolio.sh: ~`) at all times. The label SHALL be visible on first paint before the boot sequence runs and SHALL remain visible regardless of boot state, command output, or `clear`. When hidden-command discovery is complete, the label SHALL read `root@portfolio.sh: ~` instead, per the discovery-progression capability, and the root label SHALL likewise be visible on first paint and unaffected by `clear`.

#### Scenario: Title bar visible before boot
- **WHEN** the page first paints
- **THEN** the terminal title bar shows the author-identifying label without waiting for the boot sequence to type

#### Scenario: Title bar survives clear
- **WHEN** the visitor runs `clear` or any command that empties the output area
- **THEN** the title bar continues to show the author-identifying label unchanged (either `dan@portfolio.sh: ~` or `root@portfolio.sh: ~` per progression state)

#### Scenario: Root label for returning root visitors
- **WHEN** a visitor with complete discovery loads the page
- **THEN** the title bar renders `root@portfolio.sh: ~` from first paint

### Requirement: Page exposes a real heading for accessibility and SEO
The hero SHALL include a visually-hidden `<h1>` element that identifies the page (e.g. `Dan Brown — Full-Stack Developer`). The heading SHALL be present in the initial HTML so assistive technology and search engines can use it without waiting for client-side effects.

#### Scenario: Screen reader announces the page heading
- **WHEN** a screen reader encounters the page
- **THEN** the visually-hidden `<h1>` is announced as the page's main heading

#### Scenario: Heading present in server-rendered HTML
- **WHEN** the page is rendered on the server before any client-side JavaScript runs
- **THEN** the `<h1>` element with the author's name and role is present in the HTML

### Requirement: Idle whisper pool provides hint lines
The system SHALL maintain a curated whisper pool of short, atmospheric one-liners drawn from the same cinematic and literary sources as the fortune pool (e.g. "there is no spoon.", "follow the white rabbit.", "not yet... not yet.", "for me the action is the juice."). The idle-whisper behavior SHALL draw from this pool. The pool SHALL additionally contain a narrator tier of progression-aware lines (session count nudge, category-level hints, a late-game line, and a rare root-mode line) that become eligible only under the selection policy and restraint rules defined by the discovery-progression capability. The static cinematic/literary lines SHALL remain in the pool, unchanged and eligible at every idle event regardless of progression state.

#### Scenario: Whisper pool composition
- **WHEN** the whisper pool is inspected
- **THEN** it contains the short one-liners from the named cinematic and literary sources, unchanged
- **AND** each line is short enough to render on a single muted line

#### Scenario: Narrator tier supplements the pool
- **WHEN** the whisper pool is inspected
- **THEN** it also contains the progression-aware narrator lines
- **AND** those lines are selected only as permitted by the discovery-progression capability's policy

#### Scenario: Static lines always eligible
- **WHEN** an idle whisper fires at any progression state short of completion
- **THEN** lines from the static cinematic/literary pool remain possible picks

### Requirement: Tab title swaps on visibility change
When the document becomes hidden (the visitor tabs away) the system SHALL change the browser tab title to a value drawn from a curated pool (e.g. "be here now", "strength and honor", "the matrix has you", "missed me?"). When the document becomes visible again the system SHALL restore the original title.

#### Scenario: Tabbing away
- **WHEN** the visitor switches to another browser tab
- **THEN** the document title changes to a randomly selected line from the curated away-title pool

#### Scenario: Returning to the tab
- **WHEN** the visitor returns to the tab
- **THEN** the document title is restored to its original value

### Requirement: Rare boot variant rewards repeat visitors
On roughly 1 in 50 loads the boot sequence SHALL, instead of printing the normal MOTD, type out a longer curated cinematic monologue (the Blade Runner "I've seen things you people wouldn't believe... tears in rain" passage) as the boot MOTD. The variant is a deep-cut reward for repeat visitors and does not change any other boot behavior.

#### Scenario: Normal boot
- **WHEN** the boot sequence runs on a non-variant roll
- **THEN** the standard fortune MOTD is used

#### Scenario: Variant boot
- **WHEN** the boot sequence runs on the 1-in-50 roll
- **THEN** the Roy Batty monologue is typed character-by-character as the MOTD
- **AND** the rest of the boot sequence proceeds normally
