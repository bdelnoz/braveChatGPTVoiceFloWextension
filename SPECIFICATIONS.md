<!--
DOCUMENT INFORMATION
Document Name: SPECIFICATIONS_GLOBAL.md
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v6.1.0
Date / Time: 2026-06-03 19:40
Project: braveGPTAUTOSENDextenstion
Short description: Global specification baseline for a Brave/Chromium extension that automates ChatGPT Web voice-to-text send, Read aloud, Loop, and silence-triggered transcription validation.
-->

# SPECIFICATIONS_GLOBAL.md

## 1. Purpose

`braveGPTAUTOSENDextenstion` is a Brave/Chromium extension that adds a draggable floating control panel inside ChatGPT Web.

The extension automates a semi-conversational workflow based on existing ChatGPT Web features:

1. ChatGPT Web voice-to-text transcription.
2. Automatic send after transcription text is available.
3. Automatic Read aloud on the latest assistant response.
4. Optional Loop that restarts ChatGPT voice-to-text after Read aloud.
5. Optional TOS, meaning Time Of Silence, that validates the current ChatGPT transcription after a configurable silence period.

The project does not implement its own speech-to-text engine. It does not call the OpenAI API. It does not upload content to a third-party backend. It automates local browser UI actions on ChatGPT Web.

## 2. Global scope

The repository contains a Manifest V3 browser extension for Brave and Chromium-compatible browsers.

Supported origins:

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

The runtime extension must remain local-first and browser-side only.

## 3. Stable verified repository behavior

The repository path provided by the user is:

`/mnt/data2_78g/Security/scripts/Projects_web/braveGPTAUTOSENDextenstion`

The project is a Git repository with `AGENTS.md` and a `CLAUDE.md -> AGENTS.md` symbolic link managed by the user. These governance files are out of scope for generated archives unless explicitly requested.

The extension has been iteratively tested in Brave Browser against live ChatGPT Web.

The following behavior has been validated by user testing during development:

- The extension can be loaded unpacked in Brave Browser.
- The extension icon can show/inject the floating widget.
- The widget is draggable.
- Auto-send can send a finished ChatGPT voice-to-text transcription.
- Auto Read aloud can trigger ChatGPT Web Read aloud on the latest assistant answer.
- Loop can relaunch ChatGPT Web voice-to-text after Read aloud.
- TOS can use microphone RMS volume to detect silence and click the ChatGPT transcription validation control.
- A red icon package was added for better visibility in the browser toolbar.

Known remaining caution:

- ChatGPT Web DOM changes can break selectors.
- Read aloud and Loop are sensitive to ChatGPT UI timing.
- Speaker output can be captured by the microphone if the user is not wearing a headset.
- TOS depends on the browser granting microphone access to the extension.

## 4. Repository architecture

Runtime files expected at repository root:

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/icon16.png`
- `icons/icon32.png`
- `icons/icon48.png`
- `icons/icon128.png`

Documentation files expected after the documentation pass:

- `README.md`
- `INSTALL.md`
- `CHANGELOG.md`
- `WHY.md`
- `ARCHITECTURE.md`
- `SPECIFICATIONS_GLOBAL.md`
- `SPECIFICATIONS_GLOBAL_FR.md`
- `SPECIFICATIONS.md`
- `SPECIFICATIONS_FR.md`

`AGENTS.md` and `CLAUDE.md` must not be modified or packaged unless the user explicitly asks.

## 5. Global functional requirements

### 5.1 Floating widget

The content script injects a floating widget into ChatGPT Web.

The widget must be draggable and persistent enough for daily usage.

The widget includes these controls in the current version:

- `Send` with Yes or No.
- `Read aloud` with Yes or No.
- `Loop` with Yes or No.
- `TOS` with Yes or No.
- `Sec` from 0 to 30 seconds.
- `THR` from 0 to 100.
- `VOL` display showing the current microphone RMS level mapped to the same 0 to 100 display scale.

The widget must not disappear when the user clicks internal controls.

### 5.2 Auto-send

When `Send` is Yes, the extension monitors the ChatGPT composer.

When the composer text is non-empty, stable, not already sent, and the send button is available, the extension clicks the ChatGPT send button.

The extension must avoid duplicate sends using a text hash and cooldown.

### 5.3 Auto Read aloud

When `Read aloud` is Yes, the extension monitors the latest assistant response.

When the latest assistant response is stable, not currently generating, not already read, and not stale compared with the current conversation state, the extension clicks ChatGPT Web Read aloud.

The extension must avoid replaying the same answer repeatedly.

### 5.4 Loop

When `Loop` is Yes, the extension attempts to restart ChatGPT Web voice-to-text after Read aloud.

Loop must not start during Read aloud.

Loop must not start while ChatGPT is still generating or thinking about a newer user message.

Loop must not restart the microphone from a stale Read aloud job after the user has already sent a newer prompt.

Loop must use conservative timing and guard checks before clicking the voice-to-text microphone control.

### 5.5 TOS, Time Of Silence

When `TOS` is Yes, the extension requests microphone access and analyzes microphone input locally in the browser.

The TOS logic uses RMS audio analysis inspired by the user-provided older working `content-widget.js` project:

- `AudioContext`
- `AnalyserNode`
- `fftSize = 2048`
- `getByteTimeDomainData()`
- RMS calculation
- 100 millisecond polling interval

`THR` is mapped to RMS multiplied by 1000.

Example:

- `THR 10` equals RMS threshold `0.01`.

When the current RMS level is lower than the configured threshold for the configured number of seconds, TOS clicks the ChatGPT voice-to-text validation control, known during testing as the small V button.

TOS must click the transcription validation control, not the send button.

### 5.6 Red browser icon

The extension includes red icon files for toolbar visibility.

The icon is cosmetic but important for usability during live workflow testing.

## 6. Global non-functional requirements

The extension must be:

- local-first;
- browser-only;
- privacy-preserving;
- small and directly inspectable;
- Manifest V3 compatible;
- usable as an unpacked extension;
- fast enough for live voice workflow testing;
- robust enough to fail safely when a selector is ambiguous.

The extension must not:

- use remote scripts;
- call the OpenAI API;
- upload conversation content;
- implement a backend;
- package repository governance files;
- depend on Codex for runtime behavior;
- silently click ambiguous destructive controls.

## 7. Global inputs

Inputs are:

- ChatGPT Web DOM;
- user toggles in the floating widget;
- composer text;
- latest assistant response DOM;
- microphone RMS level when TOS is enabled;
- browser local extension storage.

## 8. Global outputs

Outputs are browser UI actions:

- click ChatGPT send button;
- click ChatGPT Read aloud;
- click ChatGPT voice-to-text microphone button;
- click ChatGPT voice-to-text validation button;
- update floating widget status text;
- store widget settings locally.

The extension does not produce export files by itself.

## 9. Global files and directories

Runtime files:

- `manifest.json`: Manifest V3 metadata, host permissions, icons, content script and background worker declaration.
- `background.js`: service worker for lifecycle and widget toggling.
- `content-autosend.js`: main logic for widget, auto-send, Read aloud, Loop, TOS and DOM selectors.
- `autosend-style.css`: injected widget styling.
- `icons/`: red toolbar icons.

Generated archives used during chat-based development are runtime delivery archives only and should not be treated as source-of-truth documentation.

## 10. Global interfaces and commands

Primary usage:

1. Load the repository folder as an unpacked extension in Brave Browser.
2. Open a supported ChatGPT Web conversation.
3. Click the extension icon to show the widget.
4. Enable desired workflow steps.
5. Use ChatGPT Web voice-to-text normally.

Recommended live test patterns:

- Auto-send only: `Send Yes`, all others No.
- Read aloud flow: `Send Yes`, `Read aloud Yes`, `Loop No`, `TOS No`.
- Loop flow: `Send Yes`, `Read aloud Yes`, `Loop Yes`, `TOS No`.
- TOS unit test: `Send No`, `Read aloud No`, `Loop No`, `TOS Yes`, `Sec 2 or 3`, `THR 10 to 25`.
- Full flow: `Send Yes`, `Read aloud Yes`, `Loop Yes`, `TOS Yes`, with user-selected `Sec` and `THR`.

## 11. Global constraints and safety rules

The extension must fail closed when controls are ambiguous.

TOS must never treat the ChatGPT send button as the voice-to-text validation button.

Loop must avoid ChatGPT conversation or advanced voice mode launch controls.

Read aloud must avoid replaying old assistant messages when a newer user turn is waiting for a response.

After a user message is newer than the latest assistant response, Auto Read aloud and Loop must wait for the new assistant answer.

If Read aloud is active or likely active, Loop must remain locked.

If ChatGPT is generating or thinking, Loop must remain locked.

## 12. Global validation and acceptance criteria

The current version is acceptable when:

1. The extension loads unpacked in Brave Browser.
2. The red toolbar icon appears.
3. The widget appears when toggled from the extension icon.
4. The widget does not disappear when internal controls are clicked.
5. `Send Yes` sends finished transcriptions automatically.
6. `Read aloud Yes` reads the latest assistant answer.
7. `Loop Yes` restarts voice-to-text only after Read aloud is complete.
8. `TOS Yes` shows microphone volume and clicks the small V after configured silence.
9. Loop does not restart while ChatGPT is still thinking about a newer user message.
10. Loop does not restart while Read aloud is still speaking.

## 13. Task-scoped specification boundary

This global file describes the current stable baseline of the repository.

Future task-specific work should use `SPECIFICATIONS.md` and `SPECIFICATIONS_FR.md` for the exact change under implementation, while keeping this global baseline synchronized when a stable repository-level behavior changes.

## 14. Out-of-scope items

Out of scope for the current runtime baseline:

- native messaging host;
- local Whisper integration;
- local TTS integration;
- account export;
- conversation export;
- PDF generation;
- automatic Git workflow;
- marketplace packaging;
- support for browsers other than Brave/Chromium;
- support for non-ChatGPT websites.

## 15. Changelog

### v1.0.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Initial draggable Auto-send Yes/No widget.
- Stable composer text detection.
- Safe Send button click.
- Duplicate-send guard.

### v1.1.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Read aloud Yes/No row.
- Latest assistant response stabilization watcher.
- Read aloud menu/button click support.
- Read deduplication.

### v1.2.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Loop Yes/No row.
- Post-Read aloud microphone restart.
- Read-aloud completion heuristics.
- Composer-area microphone button detection.

### v1.2.1 — 2026-06-03 — Bruno DELNOZ

Fixed:

- Tightened microphone restart selector.
- Excluded ChatGPT conversation and advanced voice mode controls.
- Changed Loop fail-safe behavior when microphone selection is ambiguous.

### v4.2.0 — 2026-06-03 — Bruno DELNOZ

Added:

- TOS row with seconds setting.
- Browser microphone audio level monitoring.
- Silence-triggered transcription validation.

### v5.0.0 — 2026-06-03 — Bruno DELNOZ

Added:

- TOS Yes/No toggle.
- Manual THR threshold.
- Red browser icons.

### v5.1.0 — 2026-06-03 — Bruno DELNOZ

Fixed:

- Widget disappearing when internal controls were clicked.
- Added event shielding for widget controls.

### v5.2.0 — 2026-06-03 — Bruno DELNOZ

Changed:

- TOS seconds range changed to 0–30 for testing.
- Added VOL display.
- Kept THR manual.

### v5.3.0 — 2026-06-03 — Bruno DELNOZ

Fixed:

- Replaced TOS audio logic with RMS logic inspired by the older working Whisper widget.
- Used `fftSize = 2048` and 100 millisecond polling.
- Mapped THR to RMS multiplied by 1000.

### v5.4.0 — 2026-06-03 — Bruno DELNOZ

Fixed:

- Made TOS independent from Auto-send.
- Fixed contradictory V button filtering.
- Added clearer TOS status messages.

### v5.5.0 — 2026-06-03 — Bruno DELNOZ

Fixed:

- Reworked transcription finish-control detection.
- Added support for `[role=button]` controls.
- Added lower-screen fallback for the small V button.

### v6.0.0 — 2026-06-03 — Bruno DELNOZ

Fixed:

- Added Read aloud to Loop locking.
- Added conservative read-duration estimate.
- Added post-read safety delay before microphone restart.

### v6.1.0 — 2026-06-03 — Bruno DELNOZ

Fixed:

- Added pending-user-turn guard before Auto Read aloud and Loop.
- Prevented stale Loop jobs from restarting voice input while ChatGPT is still thinking about a newer user message.
- Revalidated latest assistant hash before Loop clicks the microphone.
- Added page-generating guard immediately before Loop restart.
