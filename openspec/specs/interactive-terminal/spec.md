# Interactive Terminal Specification

## Purpose

Turns the hero terminal from decorative chrome into a real shell visitors can type into, fulfilling the metaphor the design already promises. A boot sequence runs on load and drops the visitor at a working prompt backed by a command registry; the existing scroll sections remain as the non-typist fallback.
## Requirements
### Requirement: Boot sequence runs on first load
The system SHALL run a boot sequence inside the terminal window that prints, in order: a randomized last-login line, a fortune from the curated pool, a status line, and a "type 'help' for commands" hint, then presents an interactive prompt. The boot sequence SHALL be skippable on return visits via a client-side persistence flag. The identity reveal above the terminal runs independently and is not part of the boot. The boot types character-by-character regardless of the visitor's `prefers-reduced-motion` setting.

#### Scenario: First visit
- **WHEN** a visitor loads the page for the first time (no persistence flag)
- **THEN** the boot sequence prints character-by-character at a readable cadence
- **AND** ends with a working prompt and a hint to type `help`

#### Scenario: Return visit
- **WHEN** a visitor reloads the page after having completed a prior boot sequence
- **THEN** the boot sequence either runs in an accelerated form or is skipped
- **AND** the prompt is presented immediately

#### Scenario: Reduced motion enabled
- **WHEN** the visitor's OS reports `prefers-reduced-motion: reduce`
- **THEN** the boot sequence still types character-by-character (reduced-motion no longer makes it print instantly)

### Requirement: Hero identity reveal precedes the terminal
The hero section SHALL render an identity reveal element ABOVE the terminal window (not inside it). The reveal SHALL type `Hello World`, hold briefly, delete back to `Hello `, then type `I'm Dan` to end at `Hello, I'm Dan`. The reveal SHALL be sized as the page's dominant heading (`text-2xl sm:text-4xl md:text-5xl lg:text-6xl`). The terminal window SHALL render below the reveal as a visually subordinate element. The reveal SHALL NOT be part of the boot sequence and SHALL NOT be cleared by the `clear` command. The reveal animates regardless of the visitor's `prefers-reduced-motion` setting. The reveal SHALL play its full typing/mutation animation on every visit — there is no return-visit skip.

#### Scenario: First-visit reveal
- **WHEN** a first-time visitor loads the page (no persistence flag)
- **THEN** the reveal types `Hello World`, pauses, mutates to `Hello, I'm Dan`
- **AND** the terminal window below renders its chrome immediately while the boot types independently

#### Scenario: Return-visit reveal
- **WHEN** a return visitor reloads the page (persistence flag set)
- **THEN** the reveal plays the full typing/mutation animation as on a first visit
- **AND** does not jump to the final state

#### Scenario: Reduced motion reveal
- **WHEN** the visitor's OS reports `prefers-reduced-motion: reduce`
- **THEN** the reveal still types and mutates as usual (reduced-motion no longer makes it render instantly)

#### Scenario: Clear does not affect the reveal
- **WHEN** the visitor runs `clear` inside the terminal
- **THEN** the reveal above the terminal remains visible and unchanged
- **AND** only the terminal's output area is cleared

### Requirement: Real prompt accepts typed input
The system SHALL render a working prompt where the visitor can type a command and submit it with the Enter key. Submitted commands SHALL echo to the output area as a `<prompt> $ <input>` line — where `<prompt>` reflects the current working directory (e.g. `~` at root or `~/rituals` inside a virtual directory) — followed by the command's output. When hidden-command discovery is complete (root mode, per the discovery-progression capability), the prompt character SHALL render as `#` instead of `$`, in both the live prompt and the echoed prompt lines, with the prompt prefix rendered in the warm amber root accent.

#### Scenario: Submitting a known command
- **WHEN** the visitor types `ls` and presses Enter
- **THEN** the input is echoed as `~ $ ls` (or the current cwd prefix)
- **AND** the output of `ls` is rendered below it

#### Scenario: Root-mode prompt echo
- **WHEN** a visitor with complete discovery submits `ls`
- **THEN** the input is echoed as `~ # ls`
- **AND** the prompt prefix and `#` render in the warm amber root accent

#### Scenario: Submitting an unknown command
- **WHEN** the visitor types a command that is not in the registry
- **THEN** the system prints a `command not found` style message
- **AND** suggests `help` or `apropos`

#### Scenario: Submitting an empty line
- **WHEN** the visitor presses Enter with an empty input
- **THEN** a new empty prompt line is rendered with no error

### Requirement: Command registry resolves input to behavior
The system SHALL resolve submitted input against a command registry that maps command names to a runnable behavior. Each registry entry SHALL define its name, a short description, an optional list of aliases, and a run function that receives parsed arguments and returns output (string, JSX, or an async typing stream).

#### Scenario: cd accepts both bare names and filenames
- **WHEN** the visitor runs `cd about.txt`
- **THEN** the system normalizes `about.txt` to `about` and scrolls to the about section
- **AND** the same holds for `projects/`, `skills.json`, and `contact.vcf`

#### Scenario: Command with arguments
- **WHEN** the visitor types `cd about`
- **THEN** the registry parses `cd` as the command and `about` as an argument
- **AND** the `cd` command's run function receives `about` and scrolls to the about section

#### Scenario: Alias resolution
- **WHEN** the visitor types a registered alias of a command
- **THEN** the underlying command's run function is invoked as if the canonical name had been typed

### Requirement: Core command set is available
The system SHALL provide a core command set covering navigation, identity, contact, shell housekeeping, curated content, and discovery progress: `ls` (list sections), `cd <section>` (jump to section), `cat <section>` (print section content inline), `whoami`, `pwd`, `now`, `neofetch`, `fortune` (random curated line), `resume` (download résumé), `email`, `github`, `linkedin`, `clear`, `history`, and `trophies` (show hidden-command discovery progress). Both `cd` and `cat` SHALL accept either the bare section name (`about`) or the filename variant shown by `ls` (`about.txt`, `projects/`, `skills.json`, `contact.vcf`). The `trophies` command's output and progression behavior SHALL be as defined by the discovery-progression capability.

#### Scenario: ls lists sections
- **WHEN** the visitor runs `ls`
- **THEN** the output lists the navigable sections as if they were files in the current directory

#### Scenario: cat prints a section inline
- **WHEN** the visitor runs `cat about`
- **THEN** the about content is rendered inline in the terminal output area
- **AND** the page does not scroll to the section (the inline content is the response)

#### Scenario: resume downloads the résumé
- **WHEN** the visitor runs `resume`
- **THEN** the résumé file download is triggered (replacing the existing `$ wget resume` link behavior)

#### Scenario: trophies reports discovery progress
- **WHEN** the visitor runs `trophies`
- **THEN** the output shows per-category hidden-command discovery progress as defined by the discovery-progression capability
- **AND** `trophies` appears in the `help` listing as a normal one-line entry

#### Scenario: clear empties the output area
- **WHEN** the visitor runs `clear`
- **THEN** the output area is emptied and only a fresh prompt is shown

#### Scenario: history lists prior commands
- **WHEN** the visitor runs `history`
- **THEN** the output lists the commands submitted in the current session in order

### Requirement: Command history is navigable from the prompt
The system SHALL let the visitor recall previously submitted commands using the Up and Down arrow keys when the prompt is focused, mimicking standard shell behavior.

#### Scenario: Recalling a previous command
- **WHEN** the visitor presses Up arrow at an empty prompt after submitting at least one command
- **THEN** the most recent prior command fills the input
- **AND** pressing Up again recalls the one before it

#### Scenario: Returning to a fresh input
- **WHEN** the visitor presses Down arrow past the most recent command
- **THEN** the input returns to empty

### Requirement: Output region is accessible
The terminal output area SHALL be an `aria-live="polite"` region so assistive technology announces new output. The prompt input SHALL be a real focusable input field with an accessible label. The visitor SHALL be able to Tab out of the terminal to the page's other content.

#### Scenario: Screen reader announces command output
- **WHEN** a command produces output
- **THEN** the output is announced by assistive technology via the live region

#### Scenario: Keyboard escape from the terminal
- **WHEN** the visitor presses Tab from the prompt
- **THEN** focus moves to the next focusable page element outside the terminal
- **AND** the terminal does not trap keyboard focus

### Requirement: Mobile prompt remains usable
On touch devices the prompt SHALL remain a usable input with a visible caret and the device's soft keyboard. The scroll sections SHALL remain the canonical navigation path on mobile so visitors who do not type can still reach all content.

#### Scenario: Typing on a touch device
- **WHEN** a visitor on a phone taps the prompt
- **THEN** the soft keyboard appears and typing works as on desktop
- **AND** the output area scrolls to keep the prompt in view

#### Scenario: Refusing to type on mobile
- **WHEN** a mobile visitor does not engage with the prompt
- **THEN** all sections remain reachable by scrolling and by the existing bottom navigation bar

### Requirement: Working directory tracks virtual-directory navigation
The system SHALL track a current working directory (`cwd`) that begins at the root (`~`). The `cd` command SHALL accept a virtual-directory name (`rituals`, `films`, `lore`, `gags`) and update the cwd to `~/<dir>` without scrolling the page. The `cd ..` and `cd ~` forms, and a bare `cd`, SHALL reset the cwd to `~`. The live prompt and the echoed prompt SHALL display the cwd as a prefix (e.g. `~/rituals $`). The `pwd` command SHALL print the real cwd path and SHALL NOT print a random flavor string.

#### Scenario: cd into a virtual directory
- **WHEN** the visitor runs `cd rituals`
- **THEN** the cwd becomes `~/rituals`
- **AND** the live prompt prefix changes to `~/rituals $`
- **AND** the page does not scroll

#### Scenario: cd back to root
- **WHEN** the visitor runs `cd ..`, `cd ~`, or `cd` (no argument) from inside a virtual directory
- **THEN** the cwd resets to `~`
- **AND** the live prompt prefix returns to `~ $`

#### Scenario: pwd reports the real path
- **WHEN** the visitor runs `pwd` from inside a virtual directory
- **THEN** the output is the current cwd path (e.g. `~/lore`)
- **AND** the output is deterministic, not a random flavor variant

### Requirement: ls and cat resolve against the working directory
The `ls` command SHALL list the contents of the current working directory: the section files and the four virtual directories at the root, or the cryptic catalogue files inside a virtual directory. The `cat` command SHALL resolve a filename against the current working directory first, then fall back to a path-prefixed argument (`cat rituals/<file>`) from the root. `cat` of an unknown file SHALL print a not-found error. The existing section-file behavior of `cd` (scrolling to the section) and `cat` (rendering section content inline) SHALL remain unchanged when the argument is a section name or section file; a section-targeted `cd` SHALL additionally reset the cwd to `~`.

#### Scenario: ls at root
- **WHEN** the visitor runs `ls` with cwd at `~`
- **THEN** the output lists the section files and the four virtual directories
- **AND** a hint line suggests exploring quieter directories

#### Scenario: ls inside a virtual directory
- **WHEN** the visitor runs `ls` with cwd inside a virtual directory
- **THEN** the output lists that directory's catalogue files only

#### Scenario: ls with a directory argument
- **WHEN** the visitor runs `ls <virtual-dir>` from the root
- **THEN** the output lists that directory's catalogue files
- **AND** the cwd is unchanged

#### Scenario: cat resolves by cwd
- **WHEN** the visitor runs `cat breathe.metric` with cwd at `~/rituals`
- **THEN** the output is that catalogue file's riddle and command name

#### Scenario: cat with a path prefix from root
- **WHEN** the visitor runs `cat rituals/breathe.metric` with cwd at `~`
- **THEN** the output is that catalogue file's riddle and command name

#### Scenario: cat unknown file
- **WHEN** the visitor runs `cat <unknown>` that resolves to neither a section file nor a catalogue file
- **THEN** the output prints a not-found error in the established flavor

#### Scenario: Section scroll behavior preserved
- **WHEN** the visitor runs `cd about` from any cwd
- **THEN** the page scrolls to the about section
- **AND** the cwd resets to `~`

#### Scenario: Section cat behavior preserved
- **WHEN** the visitor runs `cat about` (or `cat about.txt`) from any cwd
- **THEN** the about section content is rendered inline in the output area
- **AND** the page does not scroll

