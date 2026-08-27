# Profile Content Specification

## Purpose

Keeps Dan's self-description across the portfolio accurate, evidence-backed, and consistent between the visible sections (About, Skills) and the terminal's mirrored copies (`cat about.txt`, `cat skills.json`, `cat projects`, the `now` pool), so no surface shows stale, contradicted, or false claims.

## Requirements

### Requirement: Skills groups are evidence-backed
The Skills section SHALL display exactly six groups — Languages (TypeScript, JavaScript, Python, SQL, Bash), Frontend (React 19, Next.js, Tailwind CSS, Bootstrap, Vite), Mobile (React Native, Expo, EAS), Backend & Data (FastAPI, Supabase, PostgreSQL, SQLite, MongoDB, REST), Linux & Ops (Linux, Proxmox, Docker, AWS, Git, Vercel, Power Automate), and Craft (AI-assisted dev, WCAG 2.2, Vitest/Jest, Open Data). The section SHALL NOT list Java, Node.js, SASS, MySQL, SQL Server, Oracle, Azure, AEM, SharePoint, Drupal, WordPress, WET 4, GA4, Adobe Analytics, Siteimprove, or Power BI. The SQL family SHALL be represented by the single `SQL` badge.

#### Scenario: Skills section renders the six groups
- **WHEN** the Skills section is rendered
- **THEN** the six groups above are displayed with exactly the listed badges
- **AND** none of the cut skills appear anywhere in the section

### Requirement: About narrative is preserved and extended
The About section SHALL keep the existing day and night sentences verbatim ("Building large-scale web applications... for high-profile projects." and "Driven by passion and curiosity... for myself and the world.") and append exactly one new sentence to each: day adds an ownership statement about running the public site and intranet end-to-end; night adds the homelab sentence naming Proxmox, Docker, Pi-hole, Jellyfin, and photo backups. The section SHALL NOT state or imply government employment beyond what the day sentence already conveys.

#### Scenario: Day paragraph
- **WHEN** the About section is rendered
- **THEN** the day paragraph begins with the original sentence verbatim
- **AND** is followed by a sentence about running the public site and intranet end-to-end

#### Scenario: Night paragraph
- **WHEN** the About section is rendered
- **THEN** the night paragraph begins with the original sentence verbatim
- **AND** is followed by the homelab sentence naming Proxmox, Docker, Pi-hole, Jellyfin, and photo backups

### Requirement: Focus badges and meta reflect the night-stack identity
The About focus badges SHALL be Full-Stack, Mobile, Local-First, Linux & Self-Hosting, Automation, and AI Tooling. The meta block SHALL show `stack` as `TS · React · Python · Linux` and SHALL keep role, location, and clearance unchanged.

#### Scenario: Focus and meta rendering
- **WHEN** the About section is rendered
- **THEN** the six focus badges listed above are displayed
- **AND** the meta grid shows `stack: TS · React · Python · Linux`, with role, location, and clearance values unchanged from before this change

### Requirement: Terminal cat content mirrors the sections accurately
`cat about.txt` and `cat skills.json` SHALL mirror the About and Skills content in condensed terminal style, containing no skill that was cut and no claim that contradicts the visible sections. `cat projects` SHALL describe Simply Meditation as React Native, TypeScript, and track player; Cam-Spy as React 19, Leaflet, and Vite; and the workout tracker card by its card title ("the workout tracker"). The Cadence line SHALL remain unchanged.

#### Scenario: cat about.txt
- **WHEN** a visitor runs `cat about.txt` in the terminal
- **THEN** the output mirrors the new About content in condensed terminal style
- **AND** contains no cut skill names and no "legacy" wording

#### Scenario: cat skills.json
- **WHEN** a visitor runs `cat skills.json` in the terminal
- **THEN** the output lists the six new groups in terminal style, matching the Skills section badges

#### Scenario: cat projects
- **WHEN** a visitor runs `cat projects` in the terminal
- **THEN** Simply Meditation shows `react native · typescript · track player`
- **AND** Cam-Spy shows `react 19 · leaflet · vite`
- **AND** the workout tracker is named "the workout tracker" and the Cadence line is unchanged

### Requirement: now pool reflects current learning and building
The `now` command's `learning` variants SHALL reference linux servers and AWS without the word "legacy". The `building` variants SHALL reference the homelab (proxmox, docker, jellyfin, self-hosting, pi-hole/backups/streaming). The `training`, `listening`, `riding`, and `seeking` pools SHALL remain unchanged.

#### Scenario: now learning lines
- **WHEN** the `now` command prints its learning line
- **THEN** the output never contains the word "legacy"
- **AND** references linux servers and/or AWS

#### Scenario: now building lines
- **WHEN** the `now` command prints its building line
- **THEN** the output references homelab activity (proxmox, docker, jellyfin, self-hosting, or pi-hole/backups/streaming)
- **AND** training, listening, riding, and seeking lines are unchanged from before this change

### Requirement: Project card tech tags are accurate
The Projects section cards SHALL spell their technology tags with conventional capitalization and spacing, naming real technologies: the workout tracker (Atlas) SHALL list `Zustand` (not "Zustland"), and the camera network (Cam-Spy) SHALL list `Leaflet + OpenStreetMap` (with the space-separated map name). Tag corrections SHALL NOT alter card titles, descriptions, links, or the terminal `cat projects` mirror beyond keeping both surfaces consistent.

#### Scenario: Atlas tags render correctly
- **WHEN** the Projects section renders the Atlas card
- **THEN** its tag list includes `Zustand` spelled correctly
- **AND** no misspelled variant appears

#### Scenario: Cam-Spy tags render correctly
- **WHEN** the Projects section renders the Cam-Spy card
- **THEN** its tag list includes `Leaflet + OpenStreetMap` with correct spacing
