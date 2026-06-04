<!--
DOCUMENT INFORMATION
Document Name: SPECIFICATIONS_GLOBAL.md
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v0.1.0
Date / Time: 2026-06-03
Project: braveGPTAutoSendTranscription
Short description: Global repository specifications for a Brave/Chromium extension that can auto-send ChatGPT voice transcription text after the transcription has finished.
-->

# SPECIFICATIONS_GLOBAL.md

## 1. Purpose

`braveGPTAutoSendTranscription` is a Brave/Chromium extension project intended to add a controlled local auto-send workflow for ChatGPT voice transcription usage.

The global purpose is to let the user enable or disable a visible in-page `Auto-send` toggle while using ChatGPT Web voice transcription. When auto-send is enabled, the extension observes the ChatGPT composer, detects that a dictated/transcribed message has finished being inserted into the text input, waits until the text is stable, then clicks the ChatGPT send button automatically.

The extension must remain local, auditable, minimal, and browser-side only.

It must not implement its own speech recognition.

It must not request microphone permission.

It must not call the OpenAI API.

It must not upload or relay conversation content to any remote server.

It must not depend on Native Messaging for the MVP.

## 2. Global scope

The repository covers a Manifest V3 browser extension for Brave and Chromium-compatible browsers.

The project scope includes:

- a browser action popup when useful;
- a content script injected only on supported ChatGPT domains;
- a visible floating in-page toggle for `Auto-send ON/OFF`;
- local DOM observation of the ChatGPT composer;
- stable-text detection after ChatGPT voice transcription;
- automatic click on the ChatGPT send button only when strict safety conditions are met;
- local configuration storage for the auto-send preference;
- clear visual status and diagnostics;
- a read-only repository check helper script;
- documentation and specifications before implementation.

The first implementation must target the current browser tab and the current ChatGPT composer only.

## 3. Stable verified repository behavior and reference baseline

This project is a new repository and must remain independent from the existing `braveGPTEXPextension` exporter project.

The uploaded reference extension `braveGPTEXPextension` demonstrates a working Manifest V3 structure with:

- `manifest.json`;
- `background.js`;
- `content-exporter.js`;
- `exporter-style.css`;
- `popup.html`;
- `popup.js`;
- `install.sh`;
- Markdown documentation;
- specification-first project files;
- local-first and privacy-first behavior.

The reference exporter uses a popup/action UI, content script injection, supported-origin validation, minimal host permissions, and local browser-side processing.

The auto-send project may reuse architecture patterns, naming discipline, local-first constraints, and documentation structure from the reference project.

The auto-send project must not modify, overwrite, depend on, or package the existing exporter project.

## 4. Repository architecture

Expected repository architecture for the first complete project version:

```text
.
├── manifest.json
├── background.js
├── content-autosend.js
├── autosend-style.css
├── popup.html
├── popup.js
├── install.sh
├── README.md
├── INSTALL.md
├── CHANGELOG.md
├── WHY.md
├── ARCHITECTURE.md
├── MVP.md
├── SPECIFICATIONS_GLOBAL.md
├── SPECIFICATIONS_GLOBAL_FR.md
├── SPECIFICATIONS.md
├── SPECIFICATIONS_FR.md
├── icons/
│   ├── icon48.png
│   └── icon96.png
└── results/
    └── .keep
```

`AGENTS.md`, `CLAUDE.md`, and instruction symlinks are out of scope unless the user explicitly asks to modify or package them.

The `results/` directory is reserved for optional future local diagnostics or sample outputs. The MVP must not require it for normal runtime.

## 5. Global functional requirements

### 5.1 Browser support

The extension must target:

- Brave Browser;
- Chromium-compatible browsers when compatible with the same Manifest V3 APIs.

### 5.2 Supported ChatGPT origins

The extension must target only:

```text
https://chatgpt.com/*
https://chat.openai.com/*
```

No `<all_urls>` permission is allowed for the MVP.

### 5.3 Primary user workflow

The primary workflow is:

```text
User opens ChatGPT Web
User starts a normal ChatGPT voice transcription flow
User enables the extension floating toggle: Auto-send ON
ChatGPT finishes inserting the transcribed text in the composer
The extension detects stable composer text
The extension verifies that sending is safe
The extension clicks the ChatGPT send button
The extension marks the current transcription as sent
Auto-send remains available but must not re-send the same text
```

### 5.4 Floating toggle

The extension must inject a small floating UI into supported ChatGPT pages.

The floating UI must expose at least:

```text
Auto-send: OFF
Auto-send: ON
```

Required behavior:

- default state is `OFF`;
- the user can switch to `ON` manually;
- the user can switch back to `OFF` manually at any time;
- the current state is visually obvious;
- the UI must not cover the main composer controls in a way that blocks normal ChatGPT use;
- the UI must remain usable after ChatGPT SPA navigation when possible;
- the UI must be recreated safely if the page re-renders.

Optional behavior:

- store the last selected state in `chrome.storage.local`;
- allow per-tab state in a future version;
- show a compact status such as `waiting`, `stable`, `sent`, `blocked`, or `error`.

### 5.5 Composer observation

The content script must observe the ChatGPT message composer.

Detection must not rely on one fragile CSS class only.

The detection strategy should include layered selectors and heuristics:

- `textarea`;
- `contenteditable="true"`;
- composer container signals;
- form container signals;
- send button proximity;
- accessible labels or aria attributes when available;
- fallback selectors documented in code.

The observer must detect text changes inserted by ChatGPT Web after voice transcription.

The extension must treat ChatGPT Web DOM structure as volatile and must centralize selectors in the content script.

### 5.6 Transcription completion detection

The extension cannot assume direct access to ChatGPT internal transcription state.

The MVP must therefore use conservative DOM-based completion heuristics.

The extension may consider a transcription ready to send only when all required conditions are true:

1. auto-send is `ON`;
2. composer text is non-empty after trimming;
3. composer text changed since the last sent text hash;
4. composer text has remained stable for a configured delay;
5. the send button is visible and enabled;
6. no obvious recording/transcribing/stop state is active when detectable;
7. no manual block condition is active;
8. the current page is still a supported ChatGPT URL.

Default stable-text delay:

```text
1200 ms
```

The delay must be configurable as a constant in the MVP code.

The code must document that this is a heuristic, not a private ChatGPT API signal.

### 5.7 Auto-send action

When all send conditions pass, the extension must click only the ChatGPT composer send button.

The click target must be constrained to the composer area.

The extension must not click unrelated buttons.

The extension must not send if more than one plausible send button is detected and the correct one cannot be determined safely.

The extension must not synthesize or alter message text before sending.

The extension must not auto-send empty text.

The extension must not auto-send whitespace-only text.

The extension must not auto-send text that is still changing.

The extension must not auto-send the same composer text twice.

### 5.8 Anti-double-send protection

The extension must implement anti-double-send protection.

At minimum, the MVP must track:

- last sent normalized text hash;
- last sent timestamp;
- current pending text hash;
- last auto-send attempt result.

A cooldown must be applied after a send attempt.

Default cooldown:

```text
2500 ms
```

If the composer text remains the same after send, the extension must not click send again.

If the send attempt fails, the extension must report a visible blocked/error state rather than repeatedly clicking.

### 5.9 Manual user control

The user must remain in control.

Required controls:

- one visible ON/OFF toggle;
- immediate OFF behavior;
- no hidden auto-send mode;
- no automatic enabling without explicit user action unless the user later requests a persistent default.

The MVP default must be OFF on first install.

If persisted state is implemented, the documentation must clearly state whether auto-send remains ON across reloads.

Preferred MVP behavior:

```text
Persist preference with chrome.storage.local, but default to OFF on first install.
```

### 5.10 Status feedback

The extension must provide clear local feedback.

Status examples:

```text
Auto-send OFF
Auto-send ON — waiting for transcription
Auto-send ON — text stable, sending
Auto-send ON — sent
Auto-send ON — blocked: send button not safe
Auto-send ON — blocked: empty composer
Auto-send ON — blocked: duplicate text
Auto-send error
```

Status feedback may be displayed in the floating UI and/or popup.

Console diagnostics may be used for development, but user-facing behavior must not depend on the console.

### 5.11 Popup interface

The extension action popup may expose:

- current supported-page status;
- current auto-send state;
- toggle button or checkbox;
- stable delay value display;
- cooldown value display;
- last status;
- short help text.

The floating toggle is the primary runtime control.

The popup is optional for MVP operation but recommended for discoverability and debug status.

### 5.12 Page support handling

On unsupported pages:

- no auto-send logic should run;
- no floating toggle should be injected;
- popup must show an unsupported-page message if present;
- no page click must occur.

### 5.13 SPA navigation handling

ChatGPT Web is a single-page application.

The extension must tolerate URL and DOM changes without full page reload.

The content script should:

- detect supported URL changes when possible;
- recreate or remove the floating toggle as needed;
- reset pending state when entering a new conversation;
- preserve user preference only according to documented storage behavior.

### 5.14 No conversation export requirement

This project is not an exporter project.

The MVP does not need to export Markdown, text, HTML, JSON, PDF, or ZIP files.

Any future export/logging feature must be added through a separate task-scoped specification.

## 6. Global non-functional requirements

### 6.1 Security

The extension must use minimal permissions.

Preferred MVP permissions:

```text
activeTab
scripting
storage
```

Optional permission only if justified later:

```text
downloads
```

Host permissions must be limited to supported ChatGPT origins.

The extension must not request:

```text
microphone
nativeMessaging
<all_urls>
tabs beyond what is required
history
bookmarks
webRequest
debugger
```

The extension must avoid:

- `eval`;
- remote scripts;
- inline script execution where Manifest V3 disallows it;
- remote API calls;
- telemetry;
- account scraping;
- local filesystem access outside normal browser extension storage.

### 6.2 Privacy

All runtime processing must happen locally in the browser extension context.

The extension must not upload conversation content.

The extension must not save transcript text persistently unless a later specification explicitly adds local diagnostics.

The MVP may keep short-lived in-memory hashes and status values.

If any status is persisted, it must not include the full message text.

### 6.3 Robustness

The extension must tolerate ChatGPT DOM changes through layered selectors and visible diagnostics.

Failures must be explicit.

Examples of acceptable failure status:

```text
composer not found
send button not found
send button ambiguous
text not stable
duplicate text blocked
unsupported page
```

Silent auto-send failure is not acceptable.

Silent repeated clicking is not acceptable.

### 6.4 Deterministic behavior

Given the same page state and same auto-send state, the extension should make the same decision:

- send;
- wait;
- block;
- report error.

All state transitions must be understandable from constants, state variables, and logs.

### 6.5 Non-destructive page behavior

The extension must not:

- edit composer text;
- delete composer text;
- navigate away;
- reload the page;
- rate messages;
- click regenerate;
- click stop unless explicitly specified in a later task;
- click share;
- click delete;
- open attachments;
- alter account settings;
- inject prompts;
- modify conversation history.

The only allowed page-changing action in the MVP is:

```text
click the ChatGPT composer send button after strict auto-send conditions pass
```

This exception must be clearly documented in `SPECIFICATIONS.md` and implementation comments.

### 6.6 Accessibility and UI discipline

The floating toggle should:

- be readable;
- have high contrast;
- have clear ON/OFF wording;
- avoid tiny click targets;
- avoid blocking the composer;
- use a high z-index only as needed;
- not break ChatGPT keyboard flow.

### 6.7 Readability and maintainability

Source files must be plain JavaScript, HTML, and CSS for the MVP.

No bundler is required.

No npm dependency is required.

Selectors and constants must be centralized.

Runtime state must be named clearly.

Changelog headers must be append-only.

## 7. Global inputs

Main inputs:

- current page URL;
- current active ChatGPT tab;
- ChatGPT composer DOM;
- current composer text;
- visible/enabled state of the ChatGPT send button;
- visible ChatGPT recording/transcribing indicators when detectable;
- user toggle state.

Secondary inputs:

- stored user preference from `chrome.storage.local`;
- timing constants;
- current conversation URL or ID-like path segment when available.

## 8. Global outputs

Required runtime outputs:

- floating UI state;
- local status text;
- automatic send action when conditions pass;
- structured internal result for send attempt;
- console diagnostics for development.

Optional future outputs:

- local diagnostic file;
- local JSON event log;
- local Markdown session log;
- export of auto-send events;
- integration with a separate exporter extension.

The MVP must not output conversation content to a remote endpoint.

## 9. Global files and directories

Expected source files:

- `manifest.json`;
- `background.js`;
- `content-autosend.js`;
- `autosend-style.css`;
- `popup.html`;
- `popup.js`;
- `install.sh`.

Expected documentation files:

- `README.md`;
- `INSTALL.md`;
- `CHANGELOG.md`;
- `WHY.md`;
- `ARCHITECTURE.md`;
- `MVP.md`;
- `SPECIFICATIONS_GLOBAL.md`;
- `SPECIFICATIONS_GLOBAL_FR.md`;
- `SPECIFICATIONS.md`;
- `SPECIFICATIONS_FR.md`.

Expected directories:

- `icons/`;
- `results/`.

No generated business file is required during normal MVP runtime.

## 10. Global interfaces and commands

### 10.1 Browser floating UI

The floating UI must expose:

```text
Auto-send OFF
Auto-send ON
```

It may also show compact status lines.

### 10.2 Browser popup UI

The extension popup should expose:

```text
Auto-send current state
Supported page status
Last action status
Short instructions
```

The popup may also allow changing the same ON/OFF state.

### 10.3 Content script API

The content script must expose internal message handling for:

```text
ping
get status
set auto-send enabled
toggle auto-send
```

Potential message names:

```text
CGAS_PING
CGAS_GET_STATUS
CGAS_SET_ENABLED
CGAS_TOGGLE
CGAS_STATUS
```

The exact names may change during implementation but must be centralized and documented.

### 10.4 Installer/check helper

`install.sh` must provide structured help when run without arguments.

Required options:

```text
--help
--prerequis
--simulate
--changelog
```

No destructive action is allowed by default.

The helper must not install packages.

The helper must not call `apt`, `apt-get`, `snap`, `flatpak`, `pip`, `npm install`, or external repositories unless a later explicit task changes scope.

### 10.5 Browser loading

Manual load flow:

```text
Open brave://extensions/
Enable Developer mode
Click Load unpacked
Select the repository folder
Open https://chatgpt.com/
Use the floating Auto-send toggle
```

## 11. Global constraints and safety rules

The project must follow SOLO403 for scripting and repository work.

Key constraints:

- specification-first before implementation;
- no implementation before explicit user `GO`;
- complete files, not fragments;
- no one-liner substitution for durable repo work;
- no automatic Git workflow;
- no automatic modification of `AGENTS.md`, `CLAUDE.md`, or related instruction symlinks;
- append-only changelog discipline;
- anti-regression checks when modifying existing files;
- no invented validation results;
- no hidden broadening of browser permissions;
- no hidden network behavior;
- no hidden persistence of message text.

## 12. Global validation and acceptance criteria

The project is globally acceptable when:

1. the extension loads in Brave via `brave://extensions/`;
2. the extension only runs on supported ChatGPT origins;
3. the floating `Auto-send` toggle appears on supported ChatGPT pages;
4. the default first-install state is OFF;
5. the user can switch auto-send ON;
6. the user can switch auto-send OFF;
7. OFF prevents any automatic send action;
8. ON observes the ChatGPT composer;
9. ON waits for non-empty stable text before sending;
10. ON blocks duplicate text from being sent twice;
11. ON applies cooldown after send attempts;
12. ON clicks only a safe composer send button;
13. ambiguous send button detection blocks the send;
14. empty or whitespace-only text is never sent;
15. unsupported pages show no floating auto-send action;
16. no microphone permission is requested;
17. no remote upload occurs;
18. no OpenAI API key or API call is used;
19. no Native Messaging host is required in the MVP;
20. no broad host permission is used;
21. no unrelated ChatGPT control is clicked;
22. status feedback is visible enough to understand what happened;
23. implementation constants and selectors are centralized;
24. `install.sh` displays help with no arguments and performs no modification;
25. validation results are reported only if actually executed.

## 13. Task-scoped specification boundary

Task-specific behavior must be defined in `SPECIFICATIONS.md`.

This global specification defines the stable repository baseline.

A first task-scoped specification should cover the MVP:

```text
Auto-send ON/OFF floating toggle for ChatGPT voice transcription completion.
```

Implementation must not start until the user gives explicit `GO` after specification review.

## 14. Out-of-scope items

The following items are globally out of scope unless a later specification adds them:

- custom speech-to-text;
- microphone capture by the extension;
- audio recording;
- whisper.cpp integration;
- OpenAI API usage;
- direct ChatGPT backend calls;
- bypassing ChatGPT UI restrictions;
- sending without visible user-enabled toggle;
- sending when composer text is unstable;
- modifying transcript text before send;
- prompt rewriting;
- hidden background auto-send across tabs;
- auto-send on non-ChatGPT websites;
- use of `<all_urls>`;
- Native Messaging;
- Python helper;
- remote logging;
- telemetry;
- conversation export;
- attachment extraction;
- screenshot extraction;
- OCR;
- account-wide export;
- automatic Git commit or push;
- modifying `AGENTS.md`, `CLAUDE.md`, or instruction symlinks.

## 15. Risk notes

### 15.1 DOM volatility

ChatGPT Web DOM can change.

Selectors must be treated as maintainable implementation details, not stable API contracts.

Failures must be visible and safe.

### 15.2 Send action sensitivity

Unlike a read-only exporter, this project intentionally performs one page-changing action: clicking Send.

Therefore the MVP must be stricter than an exporter.

Safety must prefer blocking over accidental sending.

### 15.3 Transcription completion uncertainty

The extension has no guaranteed private signal that transcription is complete.

The MVP must rely on conservative stability heuristics.

False positives must be reduced by requiring stable text and enabled send button state.

False negatives are acceptable when they fail safe and leave the message unsent.

## 16. Changelog

### v0.1.0 — 2026-06-03 — Bruno DELNOZ

Changed:
- Initial global specification for `braveGPTAutoSendTranscription`.
- Defined local Manifest V3 Brave/Chromium extension baseline.
- Defined floating `Auto-send ON/OFF` user workflow.
- Defined conservative transcription completion heuristics.
- Defined strict anti-double-send protection.
- Defined minimal permission and privacy baseline.
- Explicitly excluded microphone access, OpenAI API use, Native Messaging, telemetry, remote upload and broad host permissions from the MVP.
