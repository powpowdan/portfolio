# Whisper Queue Specification

## Purpose

Keeps the idle-whisper cluster fresh during long idle periods: bounds visible whispers with a rolling queue, and occasionally resets the cluster via a ghost-typed purge the terminal performs on itself.

## Requirements

### Requirement: Visible whispers form a rolling queue
The system SHALL display at most four whisper-tier lines at once. Below capacity, each new idle whisper SHALL append at the bottom of the output area. At capacity, a new idle whisper SHALL remove the oldest visible whisper line and append the new line at the bottom, so the four most recent whispers remain visible and no whisper line is immortal. Non-whisper lines (prompt echoes, command output, toasts) SHALL never be evicted by this mechanism.

#### Scenario: Whisper appends below capacity
- **WHEN** an idle whisper fires while fewer than four whisper lines are visible
- **THEN** the new whisper line appears at the bottom and all existing whisper lines remain

#### Scenario: Queue rolls at capacity
- **WHEN** an idle whisper fires while four whisper lines are visible
- **THEN** the oldest whisper line disappears
- **AND** the new whisper line appears at the bottom, leaving exactly four visible

#### Scenario: Command output is never evicted
- **WHEN** the queue rolls while prompt echo or command output lines are interleaved with the whispers
- **THEN** only whisper-tier lines are removed, and all command output remains

### Requirement: Idle whisper cadence continues indefinitely
The idle whisper timer SHALL re-arm after every fire, independent of whether the output area's line count changed. Extended idle periods SHALL keep producing idle events (subject to the discovery-progression selection policy, including near-silence after completion) rather than stalling once the whisper cluster reaches capacity.

#### Scenario: Whispers continue past capacity
- **WHEN** the visitor leaves the terminal idle long after four whispers have accumulated
- **THEN** further idle events keep firing, rolling the queue or purging per the other requirements

### Requirement: Rare ghost purge replaces a queue rollover
When an idle whisper event fires with the queue at capacity, the system SHALL take a roughly 1-in-4 chance to perform a ghost purge instead of rolling the queue. A ghost purge SHALL: render a prompt echo line, type a deletion-style command character-by-character within it, remove every visible whisper line once the typing completes, and print a short punchline output line. The idle whisper that triggered the event SHALL be consumed by the purge (not displayed). Command/output lines SHALL survive the purge.

#### Scenario: Ghost purge types and clears
- **WHEN** the 1-in-4 roll succeeds at a queue rollover
- **THEN** a prompt echo line appears and a deletion-style command types itself character-by-character
- **AND** on completion every whisper line is removed and a short punchline line prints

#### Scenario: Punchline is not a whisper
- **WHEN** the purge completes
- **THEN** the punchline renders as an ordinary output line, not in the muted whisper tier

#### Scenario: Purge leaves command history intact on screen
- **WHEN** a purge runs after the visitor has executed commands
- **THEN** the visitor's prompt echoes and command output remain in the output area

### Requirement: Ghost command is not a real command
The ghost-typed command SHALL NOT be added to the visitor's command history (arrow-key recall SHALL never surface it), SHALL NOT be dispatched through the command registry, and SHALL NOT affect hidden-command discovery. Its prompt echo SHALL reflect the current working directory and root-mode styling (`$`/`#` with matching accent) exactly as a visitor-typed echo would.

#### Scenario: Arrow keys cannot recall the ghost command
- **WHEN** the visitor presses Up arrow after a ghost purge
- **THEN** recall navigates only the visitor's own submitted commands, never the ghost command

#### Scenario: Ghost echo matches current prompt styling
- **WHEN** a purge runs while the cwd is a virtual directory or root mode is active
- **THEN** the ghost echo prefix shows that cwd and the correct prompt character and accent

#### Scenario: Visitor types during the ghost typing
- **WHEN** the visitor submits a command while the ghost command is still typing
- **THEN** the sequence completes without error
- **AND** any whisper lines present are dismissed by the submission as usual
- **AND** the punchline may land after the visitor's command output

### Requirement: Ghost purge copy draws from a curated pool
The system SHALL maintain a curated pool of ghost-purge command and punchline pairs (e.g. `shred whispers.log`, `> /var/log/whispers`, `history -c`, `rm .whisper_cache` with matching one-line punchlines). Selection SHALL be uniform across the pool, and consecutive purges SHOULD be able to differ. The ghost typing SHALL animate character-by-character regardless of the visitor's `prefers-reduced-motion` setting.

#### Scenario: Pool variety
- **WHEN** multiple ghost purges are observed across sessions
- **THEN** the typed command and punchline are drawn from the curated pool and vary in expectation

#### Scenario: Reduced motion does not skip the typing
- **WHEN** the visitor's OS reports `prefers-reduced-motion: reduce`
- **THEN** the ghost command still types character-by-character before the purge clears the whispers
