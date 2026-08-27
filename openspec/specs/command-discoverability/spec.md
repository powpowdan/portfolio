# Command Discoverability Specification

## Purpose

Lets casual visitors use the terminal via a flat `help` listing while letting curious visitors discover hidden commands and depth through layered tools (`alias`, `apropos`, `man`, idle whispers, tab-completion). Depth is earned, never advertised all at once.
## Requirements
### Requirement: help lists core commands only
The `help` command SHALL list only the core command set with one-line descriptions. It SHALL NOT list hidden commands. The help output SHALL end with a hint that additional commands exist and that `apropos` can find them.

#### Scenario: Running help
- **WHEN** the visitor runs `help`
- **THEN** the output lists each core command name with a short description
- **AND** a footer line indicates a count of commands not shown
- **AND** suggests `apropos <keyword>` as the way to discover more

### Requirement: alias reveals shortcuts and a hidden count
The `alias` command SHALL list registered command aliases alongside their canonical names, and SHALL print the count of commands that remain undiscovered. It SHALL NOT reveal the names of hidden commands.

#### Scenario: Running alias
- **WHEN** the visitor runs `alias`
- **THEN** the output lists each alias and the command it resolves to
- **AND** a footer line states the number of commands that remain undiscovered without naming them

### Requirement: apropos finds commands by everyday keyword
The `apropos <keyword>` command SHALL accept a free-form keyword and return candidate command names whose keyword index contains the term or a close synonym. The keyword index SHALL include both technical terms and everyday concepts (e.g. `calm`, `fight`, `past`, `secret`, `fun`, `music`, `game`, `hidden`) so non-technical visitors can discover depth by intent.

#### Scenario: Matching a hidden command by intent
- **WHEN** the visitor runs `apropos calm`
- **THEN** the output suggests `breathe` as a candidate command
- **AND** does not auto-run it

#### Scenario: Matching multiple commands
- **WHEN** the visitor runs `apropos past`
- **THEN** the output suggests `kitchen` and any other commands indexed under concepts related to history or prior life

#### Scenario: No match
- **WHEN** the visitor runs `apropos <term>` and no command's keyword index contains the term or a close synonym
- **THEN** the output prints a friendly not-found line
- **AND** suggests trying `help` or browsing via `alias`

### Requirement: man provides per-command documentation
The `man <command>` command SHALL print a longer documentation block for the named command including its description, aliases, accepted arguments, and any associated lore or flavor text.

#### Scenario: Reading a command's manual
- **WHEN** the visitor runs `man breathe`
- **THEN** the output prints the full documentation for `breathe` including its `--calm` and `--fight` arguments

#### Scenario: Manual for an unknown command
- **WHEN** the visitor runs `man <unknown>`
- **THEN** the output prints a no-manual message and suggests `help`

### Requirement: Tab completion reveals command names while typing
When the visitor presses Tab at the prompt, the system SHALL attempt to complete the current token against the set of all registered command names (including hidden ones). If multiple commands share the prefix, the system SHALL either list the candidates or complete the common prefix.

#### Scenario: Unique prefix completes
- **WHEN** the visitor types `bre` and presses Tab
- **THEN** the input completes to `breathe`

#### Scenario: Ambiguous prefix lists candidates
- **WHEN** the visitor types a prefix shared by multiple commands and presses Tab
- **THEN** the matching command names are printed below the prompt
- **AND** the input retains the typed prefix

### Requirement: Idle whispers hint at depth after inactivity
After a configurable period of prompt inactivity (defaulting to roughly 25 seconds) with no command output in progress, the system SHALL print a faint, dismissible hint line drawn from a curated whisper pool. Any keypress or input SHALL dismiss the current whisper and reset the idle timer. Whisper line selection SHALL follow the discovery-progression policy: the first idle event of a session may lead with the count nudge while discovery is incomplete; while discovery is in progress, narrator-tier hints may supplement the curated pool within that capability's restraint rules; once discovery is complete, whispers fall to near-silence per that capability.

#### Scenario: Idle hint appears
- **WHEN** the prompt has been inactive for the idle period
- **THEN** a single hint line appears in a visually muted style (e.g. `// hint: try 'breathe'`)
- **AND** the line is drawn from the curated whisper pool subject to the discovery-progression selection policy

#### Scenario: Whisper dismissed on input
- **WHEN** the visitor presses any key while a whisper is visible
- **THEN** the whisper is removed from the output area
- **AND** the idle timer resets

#### Scenario: Session nudge leads the first idle
- **WHEN** the prompt goes idle for the first time in a session and hidden-command discovery is incomplete
- **THEN** the whisper line is the count nudge as defined by the discovery-progression capability

#### Scenario: Reduced motion enabled
- **WHEN** the visitor has `prefers-reduced-motion: reduce` enabled
- **THEN** idle whispers are still allowed (they are not motion) but appear without fade animation

### Requirement: Hidden commands are catalogued in an explorable filesystem
The system SHALL surface every hidden command as a cryptically-named file inside one of four virtual directories (`rituals/`, `films/`, `lore/`, `gags/`) reachable from the root directory listing. Each virtual directory SHALL be visible in the root `ls` output. Each catalogue file SHALL be `cat`-able and SHALL print a one-line riddle that evokes the command plus the literal command name to type. The catalogue SHALL NOT auto-run the command on `cat`; the visitor MUST type the command themselves. Catalogue file names SHALL be evocative rather than literal (they SHALL NOT spell out the command verbatim).

#### Scenario: Root ls reveals virtual directories
- **WHEN** the visitor runs `ls` at the root directory
- **THEN** the output lists the navigable section files plus the four virtual directories
- **AND** a hint line suggests that some directories are quieter than others and that `cd` explores them

#### Scenario: Listing a virtual directory
- **WHEN** the visitor runs `ls` inside a virtual directory (or `ls <virtual-dir>` from the root)
- **THEN** the output lists the cryptically-named catalogue files for that category
- **AND** no command names are shown directly in the listing

#### Scenario: Catting a catalogue file
- **WHEN** the visitor runs `cat <catalogue-file>` resolved against its virtual directory
- **THEN** the output prints a one-line riddle evoking the hidden command
- **AND** the output ends with a line revealing the command name to type (e.g. `type \`matrix\` to wake up`)
- **AND** the command is not auto-run

#### Scenario: Every hidden command is reachable
- **WHEN** the visitor explores all four virtual directories
- **THEN** every hidden command in the registry has at least one catalogue file mapping to it
- **AND** no hidden command requires guessing without a filesystem entry

### Requirement: secrets command hints at exploration
The hidden `secrets` command SHALL print a short, non-spoiler nudge (two lines or fewer) that points the visitor toward filesystem exploration. It SHALL NOT list command names, riddles, or catalogue-file names. It SHALL be discoverable via `apropos` under concepts like `secret`, `hidden`, `easter`, `egg`, `ritual`, and `mystery`.

#### Scenario: Running secrets
- **WHEN** the visitor runs `secrets`
- **THEN** the output prints at most two lines
- **AND** the lines reference `ls`, `cd`, or `cat` as the way to find hidden things
- **AND** no hidden command name or catalogue-file name appears in the output

#### Scenario: Discovering secrets via apropos
- **WHEN** the visitor runs `apropos secret` (or a related concept)
- **THEN** `secrets` appears among the candidate commands

