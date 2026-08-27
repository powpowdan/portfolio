# Discovery Progression Specification

## Purpose

Turns the terminal's hidden-command layer into a persistent meta-game. Tracks which hidden commands a visitor has actually executed, acknowledges each find, reports progress through a `trophies` command and progression-aware whispers, and rewards finding every hidden command with a one-time transmission and permanent root-mode terminal theming.

## Requirements

### Requirement: Hidden command execution is persisted as discovery
The system SHALL record a hidden command as discovered when the visitor executes it — by canonical name or any registered alias — and SHALL store the canonical command name in client-side persistence under the existing portfolio namespace. Reading about a command (`apropos` results, `man` pages, tab-completion candidate listings, or `cat`-ing its catalogue file) SHALL NOT mark it discovered. Discovery SHALL persist across sessions and SHALL NOT be reset by `clear`, page reloads, or re-execution.

#### Scenario: Executing a hidden command records it
- **WHEN** the visitor runs a hidden command they have not run before
- **THEN** that command's canonical name is recorded as discovered in persistent storage
- **AND** the record survives a page reload

#### Scenario: Alias execution records the canonical name
- **WHEN** the visitor runs a registered alias of a not-yet-discovered hidden command
- **THEN** the canonical command name is recorded, not the alias text

#### Scenario: Reading about a command does not count
- **WHEN** the visitor sees a hidden command named in `apropos` output, a `man` page, a tab-completion list, or a catalogue riddle
- **AND** does not execute it
- **THEN** the command remains undiscovered

### Requirement: First discovery of a hidden command prints a toast
When the visitor executes a not-yet-discovered hidden command, the system SHALL append a single toast line after that command's output, styled in the same muted, italic, whisper-like tier as idle-whisper lines (no accent color), in the form: `✦ new discovery — <category> <found>/<size> · total <x>/<hidden-total>`. When that execution completes a category, the toast SHALL instead read `✦ <category> complete — <size>/<size>` in the same muted style. The toast SHALL NOT print for re-executions of already-discovered commands. Accent colors SHALL remain reserved for terminal chrome and the completion transmission.

#### Scenario: First execution toasts the find
- **WHEN** the visitor executes a not-yet-discovered hidden command
- **THEN** a toast line with the category counts and running total prints after the command output
- **AND** the toast renders in the muted whisper tier, not in an accent color

#### Scenario: Category completion toasts louder
- **WHEN** an execution brings a category to all-found
- **THEN** the toast line names the category as complete with its full size
- **AND** the toast renders in the same muted whisper tier

#### Scenario: Repeat execution stays silent
- **WHEN** the visitor re-executes an already-discovered hidden command
- **THEN** no toast line prints

### Requirement: trophies command reports discovery progress
The visible `trophies` command SHALL print a progress report for the hidden-command categories (lore, films, gags, secrets): per-category rows showing found/total counts, the names of discovered commands, and `???` in place of undiscovered ones, plus an overall total. At zero discoveries the output SHALL show all-`???` rows and SHALL end with a single nudge pointing toward filesystem exploration rather than naming any command. The command SHALL accept the aliases `achievements`, `found`, and `loot`, and SHALL provide `man` documentation.

#### Scenario: Zero-state output
- **WHEN** the visitor runs `trophies` with nothing discovered
- **THEN** each category row shows `???` entries and zero counts
- **AND** the output ends with one exploration nudge that names no hidden command

#### Scenario: Partial-progress output
- **WHEN** the visitor runs `trophies` with some commands discovered
- **THEN** discovered commands appear by name in their category rows
- **AND** undiscovered slots render as `???`

#### Scenario: Alias resolution
- **WHEN** the visitor runs `found` (or `achievements`, `loot`)
- **THEN** the output is identical to running `trophies`

### Requirement: Session nudge whispers the live count once
At the first idle-whisper event of a session, while discovery is incomplete, the whisper line SHALL be the count nudge — a single line of the form `<hidden-total> hidden · <x> found · try \`trophies\`` using live values. The nudge SHALL occur at most once per session; all subsequent idle whispers SHALL come from the normal rotation.

#### Scenario: First idle leads with the nudge
- **WHEN** the prompt goes idle for the first time in a session and discovery is incomplete
- **THEN** the whisper line shows the live hidden/found counts and suggests `trophies`

#### Scenario: Later idles return to normal rotation
- **WHEN** the prompt goes idle again after the nudge has fired
- **THEN** the whisper is drawn from the normal whisper selection and is not the count nudge

### Requirement: Narrator hints supplement whispers with restraint
While discovery is in progress (at least one discovered, not all), idle-whisper selection MAY include narrator-tier hint lines that reference undiscovered categories by category name only — never a hidden command name, alias, or catalogue-file name. Narrator hints SHALL be selected at most one in three idle events, SHALL never occur in consecutive idle events, and the static whisper pool SHALL remain eligible at every idle event. At a high discovery threshold (roughly 17 or more found), a late-game narrator line referencing the remaining count MAY enter selection.

#### Scenario: Hints name categories, not commands
- **WHEN** a narrator hint whisper appears
- **THEN** it references an undiscovered category or the remaining count
- **AND** no hidden command name, alias, or catalogue-file name appears in the line

#### Scenario: Hints are restrained
- **WHEN** idle whispers fire repeatedly during a session with discovery in progress
- **THEN** no two consecutive idle whispers are both narrator hints
- **AND** at least two of every three idle whispers come from the static pool

#### Scenario: Late-game urgency
- **WHEN** the visitor has found roughly 17 or more of the hidden commands
- **THEN** a narrator line referencing how few remain may appear among idle whispers

### Requirement: Completed discovery quiets the whispers
When every hidden command has been discovered, idle whispers SHALL stop firing, except that a rare root-mode line ("root looks good on you." style) MAY appear at most about one in five idle events. Most idle periods SHALL print nothing.

#### Scenario: Near-silence after completion
- **WHEN** the prompt goes idle after all hidden commands are discovered
- **THEN** no whisper prints in most idle events
- **AND** the only permitted line is the occasional root-mode line

### Requirement: Completing all discoveries prints a transmission
When an execution transitions the discovered set to complete, the system SHALL print, after that command's output and toast, a one-time transmission with: a header noting the full count, a warm two-line body ("most visitors skim. you dug." / "that's really the whole hiring pitch."), a sign-off ("thanks for playing. — dan"), a final line "(root granted.)", a maintenance line naming the two maintenance codes (`enterthecode` · `exitthecode`) rendered in the amber root accent at full size, and a closing rm-unlock hint (`rm -rf / — if you mean it.`) rendered in dim red. The transmission SHALL print only at the completion event and SHALL NOT reprint on later visits or re-executions. The maintenance line is the only sanctioned disclosure of the codes, and the rm hint is the only sanctioned nudge toward the deletion ritual: both fire at completion (natural or backdoor) so a root visitor always learns the way out and the way to end it.

#### Scenario: The 19th discovery triggers the transmission
- **WHEN** the visitor executes the final undiscovered hidden command
- **THEN** the toast is followed by the transmission with the body, sign-off, "(root granted.)", the amber maintenance-codes line, and the red rm-unlock hint

#### Scenario: Transmission does not repeat
- **WHEN** the visitor reloads the page or re-runs the last command after completion
- **THEN** the transmission does not print again

### Requirement: Root mode restyles the terminal permanently
When every hidden command has been discovered, the terminal SHALL enter root mode: the title-bar label changes from `dan@portfolio.sh: ~` to `root@portfolio.sh: ~`, the prompt character changes from `$` to `#`, and terminal chrome accents (title bar, dots, window border, glow, prompt prefix) shift from the cyan accent to a warm amber accent. Root mode SHALL be derived from the discovered set being complete rather than a separate stored flag, SHALL persist across visits, and SHALL be applied from first paint for returning root visitors. The transition into root mode SHALL be a soft glow/color shift — not a glitch or static effect — and SHALL change instantly without animation when the visitor has `prefers-reduced-motion: reduce` enabled.

#### Scenario: Root mode engages at completion
- **WHEN** the final hidden command is discovered
- **THEN** the title bar reads `root@portfolio.sh: ~`, the prompt renders `#`, and the terminal chrome accents render in warm amber via a soft glow shift

#### Scenario: Root mode persists across visits
- **WHEN** a root-mode visitor reloads the page
- **THEN** the terminal renders in root mode from first paint without re-completing anything

#### Scenario: Reduced-motion root transition
- **WHEN** root mode engages (or renders on load) with `prefers-reduced-motion: reduce` enabled
- **THEN** the amber styling applies instantly with no transition animation

### Requirement: Root mode flips the sudo response and arms the rm ritual
In root mode, `sudo <anything>` SHALL respond "permission granted. it was always your machine." These replace the pre-root denial responses for root-mode visitors only; visitors without complete discovery continue to receive the existing denial gags. Destructive `rm` forms in root mode SHALL NOT print a gag — they open the deletion ritual defined by the rm -rf requirement below.

#### Scenario: sudo after root
- **WHEN** a root-mode visitor runs `sudo <anything>`
- **THEN** the output is the root-mode grant line and no permission-denied text appears

#### Scenario: rm after root arms the ritual
- **WHEN** a root-mode visitor runs a destructive `rm` form
- **THEN** a delete-everything confirmation prompt appears
- **AND** no gag line prints

#### Scenario: Pre-root gags unchanged
- **WHEN** a visitor without complete discovery runs `sudo` or destructive `rm`
- **THEN** the existing denial gags respond as before

### Requirement: rm -rf as root deletes the construct
When a root-mode visitor runs a destructive `rm` form, the system SHALL print a confirmation prompt (`delete everything? [y/N]`) and route the next submitted input to confirmation resolution instead of command dispatch. Only `y` or `yes` SHALL confirm; an empty submission (shell default N), `n`, or any other input SHALL cancel with the line "wise. restraint is root too." and return the prompt to normal command mode. On confirmation, a fullscreen deletion sequence SHALL play at the document-body level: a typed uninstall log (removing the section files, the whispers, the construct, then `you (guest)`), a CRT power-off collapse to black, then a black screen holding a blinking cursor and the final line "what we do in life echoes in eternity." until the visitor presses any key or clicks, which reloads the page. The ritual is theater: reloading SHALL preserve the discovered set and root mode. Escape SHALL not dismiss the sequence once confirmed. Non-root visitors SHALL never see the prompt or the sequence.

#### Scenario: Declining the deletion
- **WHEN** the confirmation prompt is visible and the visitor submits `n` (or presses Enter on empty input, or types anything other than y/yes)
- **THEN** the line "wise. restraint is root too." prints
- **AND** the next input is dispatched as a normal command

#### Scenario: Confirming the deletion
- **WHEN** the confirmation prompt is visible and the visitor submits `y`
- **THEN** the uninstall log types out over a fading page
- **AND** the CRT power-off collapse plays, leaving a black screen
- **AND** the final line and a blinking cursor remain until any key or click

#### Scenario: Reload preserves state
- **WHEN** the page reloads after the deletion sequence
- **THEN** discovery progress and root mode are intact (no reset occurred)

#### Scenario: Ritual is root-only
- **WHEN** a visitor without complete discovery runs a destructive `rm` form
- **THEN** the anti-piracy gag responds and no confirmation prompt appears

### Requirement: enterthecode backdoor completes discovery instantly
The input `enterthecode` SHALL mark every hidden command discovered at once, print a one-line acknowledgment followed by the completion transmission (including the maintenance-codes line), and engage root mode — an end state identical to natural completion. The backdoor SHALL be absent from every discoverable surface: it SHALL NOT appear in `help` output, `apropos` results for any term (including "code", "secret", or "cheat"), `alias` listings, tab-completion candidates, or any hidden/undiscovered command count, and SHALL have no catalogue file. Beyond the completion transmission's maintenance line, the code SHALL NOT be disclosed elsewhere. When discovery is already complete, running it SHALL print a brief acknowledgment that root is already held and SHALL NOT repeat the transmission.

#### Scenario: Backdoor skips to the end
- **WHEN** the visitor types `enterthecode` with discovery incomplete
- **THEN** every hidden command becomes discovered
- **AND** a one-line acknowledgment and the completion transmission print
- **AND** root mode engages exactly as with natural completion

#### Scenario: Backdoor leaves no discoverable trace
- **WHEN** the visitor inspects `help`, `alias`, tab-completion candidates, or `apropos` output for any term
- **THEN** `enterthecode` never appears in any listing, result, or count

#### Scenario: Backdoor when already root
- **WHEN** a root-mode visitor types `enterthecode`
- **THEN** a brief already-root acknowledgment prints
- **AND** the transmission does not repeat

### Requirement: exitthecode backdoor resets discovery
The input `exitthecode` SHALL clear the discovered set entirely, restoring the pre-game state: root mode disengages (title bar, prompt character, and accents return to their default cyan forms), whisper progression resets, and the terminal renders as it would for a visitor with no discoveries. The reset SHALL be absent from every discoverable surface under the same zero-trace rules as `enterthecode`; beyond the completion transmission's maintenance line, it SHALL NOT be disclosed elsewhere. With zero discoveries, running it SHALL print a brief nothing-to-reset acknowledgment and change nothing.

#### Scenario: Reset from root
- **WHEN** a root-mode visitor types `exitthecode`
- **THEN** the discovered set is cleared and persisted as empty
- **AND** the terminal exits root mode (default title bar, `$` prompt, cyan accents)
- **AND** a brief reset acknowledgment prints

#### Scenario: Reset from partial progress
- **WHEN** a visitor with partial discoveries types `exitthecode`
- **THEN** the discovered set is cleared
- **AND** a brief reset acknowledgment prints

#### Scenario: Nothing to reset
- **WHEN** a visitor with zero discoveries types `exitthecode`
- **THEN** a brief nothing-to-reset acknowledgment prints
- **AND** no state changes

#### Scenario: Reset leaves no discoverable trace
- **WHEN** the visitor inspects `help`, `alias`, tab-completion candidates, or `apropos` output for any term
- **THEN** `exitthecode` never appears in any listing, result, or count
