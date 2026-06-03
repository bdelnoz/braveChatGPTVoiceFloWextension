<!--
Document: SPECIFICATIONS_GLOBAL.md
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v8.0.0
Date / Time: 2026-06-03 19:20
Project: ChatGPT Voice Flow
Short description: Global repository specification for a local Brave/Chromium extension that builds a semi-conversational ChatGPT Web workflow by chaining voice-to-text transcription, automatic send, ChatGPT Read Aloud, and automatic transcription restart.
-->

# SPECIFICATIONS_GLOBAL.md

## 1. Purpose

`ChatGPT Voice Flow` is a local Brave/Chromium browser extension for ChatGPT Web.

The project exists to reduce repetitive manual clicks when using ChatGPT Web with its built-in voice-to-text transcription and Read Aloud features.

The extension does not implement speech recognition, text generation, or text-to-speech itself. It orchestrates the existing ChatGPT Web interface by detecting page state and clicking the relevant visible UI controls at the right time.

The long-term purpose is to provide a local, privacy-preserving, semi-conversational workflow using the standard ChatGPT Web page:

1. user starts ChatGPT voice-to-text transcription manually;
2. extension can detect end of speech by time of silence;
3. extension validates the transcription by clicking the ChatGPT transcription confirmation button;
4. extension sends the transcript;
5. ChatGPT generates a reply;
6. extension triggers ChatGPT Read Aloud;
7. extension can restart ChatGPT transcription for the next user turn;
8. user can interrupt or advance the flow manually.

The project started as a minimal auto-send tool, then evolved into a full voice workflow controller. The repository and extension name should now use `ChatGPT Voice Flow`, not the earlier `braveGPTAUTOSENDextenstion` naming.

## 2. Global scope

The repository covers a Manifest V3 browser extension for Brave and Chromium-compatible browsers.

The extension targets ChatGPT Web only.

Supported origins:

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

The extension is designed for local use, manual loading through Brave or Chromium extension developer mode, and iterative repository-based development.

The extension scope includes:

- injected floating widget;
- draggable widget positioning;
- compact and full display modes;
- global flow enable or disable control;
- send transcript automation;
- Read Aloud automation;
- transcription restart automation;
- time-of-silence detection based on local microphone RMS volume;
- current step indicators;
- manual next-step action;
- local state persistence through browser storage or page-local state;
- red visible extension icon assets.

The extension scope does not include:

- custom speech-to-text transcription;
- Whisper local service integration;
- custom text-to-speech;
- OpenAI API usage;
- backend services;
- telemetry;
- remote logging;
- content upload;
- account-wide data export;
- hidden prompt extraction;
- private reasoning extraction.

## 3. Stable verified repository behavior

This specification is based on the interactive implementation and testing history from runtime versions v1 through v8.0.

The following behavior has been validated during live browser tests by the user:

- the extension can be loaded unpacked in Brave Browser;
- the extension action can inject and show a floating widget on ChatGPT Web;
- the floating widget can be dragged and repositioned;
- the Send transcription step can automatically send a completed ChatGPT voice-to-text transcript;
- the Read Aloud step can trigger ChatGPT's own Read Aloud action on the latest assistant response;
- the transcription restart step can start a new ChatGPT voice-to-text transcription after the assistant response workflow;
- the earlier wrong-click bug where restart targeted the conversation mode button instead of the voice-to-text microphone was corrected in v3.1;
- the Time of Silence audio monitor can access microphone RMS volume and show microphone volume values;
- the Time of Silence step can trigger the ChatGPT transcription validation button after silence in v5.5 and later;
- v8.0 introduces a global flow control, manual Next Step action, and step indicators, but v8.0 still requires user runtime validation after installation.

Known unstable or sensitive behavior:

- ChatGPT Web DOM can change without notice;
- Read Aloud completion detection is heuristic and must be guarded by active-state checks and safety delays;
- if system audio leaks into the microphone, ChatGPT can accidentally transcribe its own spoken Read Aloud output;
- Time of Silence depends on microphone noise floor and user threshold settings;
- TV, cooker hood noise, dog barking, speakers, or room noise can affect threshold behavior;
- headphones reduce speaker-feedback risks.

## 4. Repository architecture

Expected repository architecture for the current runtime-focused project:

- `manifest.json`: Manifest V3 declaration, supported domains, content scripts, background worker and icons.
- `background.js`: extension lifecycle and action handling.
- `content-autosend.js`: injected ChatGPT page controller, floating widget, DOM detection, state machine, audio RMS monitor, and click orchestration.
- `autosend-style.css`: floating widget styles, compact and full modes, active step indicators, status colors, and layout.
- `icons/`: visible red extension icons.
- `SPECIFICATIONS_GLOBAL.md`: global baseline specification and primary Codex entry point.

Expected future repository documentation, if Codex performs a complete documentation pass:

- `README.md`
- `INSTALL.md`
- `CHANGELOG.md`
- `WHY.md`
- `ARCHITECTURE.md`
- `SPECIFICATIONS_GLOBAL.md`
- `SPECIFICATIONS_GLOBAL_FR.md`
- `SPECIFICATIONS.md`
- `SPECIFICATIONS_FR.md`

The repository may also contain:

- `AGENTS.md`
- `CLAUDE.md -> AGENTS.md`

Those files are governance/instruction files and must not be modified or packaged unless explicitly requested.

## 5. Global functional requirements

### 5.1 Floating widget

The extension must inject a floating widget into supported ChatGPT pages.

The widget must:

- appear only on supported ChatGPT Web origins;
- be draggable;
- remember or preserve useful placement when possible;
- avoid blocking the composer unnecessarily;
- survive reasonable ChatGPT page rerenders;
- be restorable through the extension action;
- avoid disappearing when internal buttons are clicked;
- stop event propagation from widget controls so ChatGPT handlers do not swallow widget clicks.

### 5.2 Display modes

The widget must support two display modes:

- Full mode;
- Mini mode.

Full mode must use explicit labels for clarity:

- `ChatGPT Voice Flow`
- `Flow On / Off`
- `Send transcription`
- `Read aloud from ChatGPT`
- `Start transcription`
- `Time of silence`
- `Silence seconds`
- `Volume threshold`
- `Microphone volume`
- `Next step`

Mini mode must use compact labels suitable for a smaller widget:

- `Flow`
- `Send`
- `Read`
- `VTT`
- `T.O.S.`
- `sec`
- `thr`
- `vol`
- `Next`

### 5.3 Global Flow control

The extension must include a global Flow On / Off control.

When Flow is Off:

- no automatic send must run;
- no automatic Read Aloud must run;
- no automatic transcription restart must run;
- no Time of Silence auto-validation must run;
- timers and pending delayed actions must be cancelled or ignored;
- microphone RMS monitoring should stop when not needed;
- user settings underneath must remain stored and visible.

Flow Off is the global circuit breaker.

### 5.4 Send transcription

The Send transcription step must click ChatGPT's send button after a transcript has been inserted into the composer and has stabilized.

The extension must:

- detect non-empty transcript text;
- wait until text appears stable;
- avoid duplicate sends;
- avoid sending identical repeated content;
- avoid sending empty content;
- avoid sending while ChatGPT is already generating;
- click only the real ChatGPT composer send button.

### 5.5 Read Aloud from ChatGPT

The Read Aloud step must trigger ChatGPT's own Read Aloud action for the latest assistant message.

The extension must:

- wait until the assistant response is complete;
- target the latest assistant answer;
- open the message actions menu if necessary;
- click a Read Aloud action labelled in English or French when available;
- avoid re-reading old messages;
- avoid starting Read Aloud while ChatGPT is still generating;
- record enough state to avoid duplicate triggering.

### 5.6 Start transcription

The Start transcription step replaces the earlier label `Loop`.

This step must restart ChatGPT Web voice-to-text transcription by clicking the correct microphone or transcription-start button, not the separate live conversation or advanced voice mode button.

The extension must:

- target ChatGPT's normal voice-to-text transcription microphone;
- avoid the conversational voice mode button;
- avoid wrong-clicking nearby buttons;
- avoid restarting while Read Aloud is active;
- avoid restarting while ChatGPT is generating;
- avoid restarting if Flow is Off;
- allow manual override through Next Step when useful.

### 5.7 Time of Silence

Time of Silence, abbreviated as `T.O.S.`, detects that the user has stopped speaking while ChatGPT voice-to-text transcription is active.

T.O.S. must:

- request microphone access through browser APIs when needed;
- use local audio analysis only;
- avoid recording, storing, or uploading audio;
- use RMS analysis based on time-domain audio samples;
- use a configurable silence duration;
- use a configurable volume threshold;
- display current microphone volume;
- click ChatGPT's transcription validation button when silence criteria are met;
- target the small validation button used to finish ChatGPT voice-to-text transcription, not the send button.

The RMS detection baseline inherited from the user's earlier working local Whisper widget is:

- `AnalyserNode.fftSize = 2048`;
- `getByteTimeDomainData()`;
- RMS calculation over normalized samples;
- interval around 100 ms;
- threshold equivalent where `THR 10` means approximately `0.01` RMS.

### 5.8 Step indicators

The widget must display current step indicators.

The minimum step indicators are:

- Send;
- Read;
- VTT.

The active step must be visible, for example with a red dot.

T.O.S. is an option and monitoring condition, not a main conversation step, but it may display status text such as idle, listening, watching, no validation button found, or volume value.

### 5.9 Next Step

The widget must include a manual Next Step action.

Next Step must try to advance the flow according to current visible state:

- if voice-to-text transcription validation is active, click the validation button;
- else if the transcript is ready in the composer, click Send transcription;
- else if an assistant response is complete and unread, start Read Aloud;
- else if Read Aloud is finished and Start transcription is enabled, restart voice-to-text transcription;
- else do nothing safe.

Next Step must respect Flow Off.

Next Step must prefer safe no-op over risky wrong-clicks.

### 5.10 Browser action behavior

Clicking the extension action should show or hide the widget on the supported ChatGPT page.

Expected behavior:

- if the widget is absent, inject or show it;
- if the widget is visible, hide or remove it;
- hiding the widget must not leave active automation loops running;
- Flow Off semantics should apply when the widget is removed or hidden.

## 6. Global non-functional requirements

### 6.1 Local-first behavior

The extension must run locally in the browser.

It must not use:

- remote backend;
- cloud storage;
- telemetry;
- analytics;
- external API calls;
- OpenAI API calls;
- Whisper API calls;
- Native Messaging by default.

### 6.2 Privacy

The extension must not store conversation content beyond minimal transient state needed for deduplication or flow control.

The extension must not store raw audio.

The extension must not upload audio.

The extension must not upload transcript text.

### 6.3 Safety

The extension must fail safe.

If a selector is ambiguous, the extension must do nothing rather than click a risky target.

If ChatGPT is generating, reading aloud, or in an unknown state, the extension must delay or no-op.

If Flow is Off, all automation must stop.

### 6.4 Robustness

The extension must handle:

- ChatGPT DOM rerenders;
- UI labels changing between English and French;
- disabled buttons;
- multiple assistant messages;
- user interrupting or stopping a flow manually;
- page refresh after extension reload;
- extension reload during development.

### 6.5 Read Aloud compatibility

Assistant-facing project documentation should avoid unnecessary code blocks for prose intended to be read aloud by ChatGPT Read Aloud.

Technical repository documents may still use code blocks when needed for commands, file trees, or exact examples.

## 7. Global inputs

Primary user inputs:

- voice captured by ChatGPT Web's own voice-to-text mode;
- manual widget toggles;
- manual silence duration value;
- manual volume threshold value;
- manual Next Step click;
- manual Flow On / Off setting;
- extension action click;
- browser page refresh or extension reload.

DOM inputs observed by the extension:

- ChatGPT composer content;
- send button state;
- voice-to-text validation button state;
- voice-to-text microphone button state;
- assistant message completion state;
- Read Aloud action availability;
- Stop reading or reading-active indicators;
- generating or busy indicators.

Audio input:

- microphone stream used only for RMS volume analysis when T.O.S. is enabled.

## 8. Global outputs

Visible outputs:

- floating widget;
- compact or full labels;
- active step indicators;
- current microphone volume value;
- T.O.S. status;
- on/off button states;
- red extension icon.

Browser/UI actions triggered by the extension:

- click transcription validation button;
- click send button;
- click Read Aloud action;
- click voice-to-text microphone button;
- cancel or no-op when unsafe.

No data export is part of this extension's core behavior.

## 9. Global files and directories

Runtime source files:

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`

Runtime assets:

- `icons/icon16.png`
- `icons/icon32.png`
- `icons/icon48.png`
- `icons/icon128.png`

Primary specification file:

- `SPECIFICATIONS_GLOBAL.md`

Recommended documentation files for a later Codex documentation pass:

- `README.md`
- `INSTALL.md`
- `CHANGELOG.md`
- `WHY.md`
- `ARCHITECTURE.md`
- `SPECIFICATIONS_GLOBAL_FR.md`
- `SPECIFICATIONS.md`
- `SPECIFICATIONS_FR.md`

Instruction files out of normal deliverable scope:

- `AGENTS.md`
- `CLAUDE.md`

## 10. Global interfaces and commands

### 10.1 Brave or Chromium installation interface

Installation for development uses browser UI:

1. open `brave://extensions/` or equivalent Chromium extension page;
2. enable Developer mode;
3. choose Load unpacked;
4. select the repository folder containing `manifest.json`.

For updates during development:

1. overwrite repository files;
2. click Reload for the unpacked extension;
3. refresh the ChatGPT page.

The extension does not require package installation.

### 10.2 Extension action

The extension action should toggle the widget on supported pages.

### 10.3 In-page widget

The widget is the primary UI.

Controls:

- Flow On / Off;
- Full / Mini;
- Send transcription Yes / No;
- Read Aloud Yes / No;
- Start transcription Yes / No;
- T.O.S. Yes / No;
- Silence seconds decrease/increase;
- Volume threshold decrease/increase;
- Next Step.

Status display:

- current step indicators;
- microphone volume;
- T.O.S. state;
- compact/full labels.

## 11. Global constraints and safety rules

### 11.1 Permissions

Permissions must remain minimal.

The extension should not use `<all_urls>`.

The extension must target only supported ChatGPT origins.

Microphone access is allowed only for T.O.S. RMS volume detection. It must not be used for recording, transcription, storage, or upload.

### 11.2 No external service

The extension must not depend on a backend.

The extension must not send user audio or transcript text to any external service.

### 11.3 DOM safety

The extension must prefer no-op over wrong-click.

Risky click targets to avoid:

- ChatGPT live conversation mode;
- advanced voice mode;
- unrelated message action buttons;
- page navigation;
- delete, archive, share, regenerate, or feedback controls;
- old assistant messages for Read Aloud.

### 11.4 Anti-loop safety

The extension must avoid runaway loops.

Read Aloud to Start transcription transition must be guarded.

Start transcription must not happen while:

- ChatGPT is still generating;
- Read Aloud is active;
- the latest assistant response is not complete;
- the last user message is newer than the last assistant response;
- Flow is Off;
- a safety cooldown is active.

### 11.5 Speaker feedback risk

If assistant Read Aloud audio is played through speakers, the microphone can capture it.

The extension must therefore avoid restarting transcription before Read Aloud is finished.

Using headphones is safer, but the extension must not require headphones for baseline use.

### 11.6 User override

The user must be able to interrupt the flow manually.

Flow Off must be available as the global stop control.

Next Step must provide manual advancement when automation is too slow or the user has already read enough.

## 12. Global validation and acceptance criteria

A release is acceptable when these tests pass in Brave Browser on ChatGPT Web.

### 12.1 Basic load test

- extension loads unpacked;
- red icon appears;
- widget appears after extension action click;
- widget is draggable;
- widget does not disappear when its own buttons are clicked.

### 12.2 Flow Off test

- set Flow Off;
- enable all underlying options;
- speak or interact with ChatGPT;
- no automation must trigger.

### 12.3 Send transcription test

- start ChatGPT voice-to-text manually;
- finish transcription manually;
- extension sends transcript automatically when Send transcription is enabled.

### 12.4 Read Aloud test

- send a message;
- wait for assistant answer;
- extension triggers Read Aloud on latest assistant message.

### 12.5 Start transcription test

- after Read Aloud finishes;
- extension starts a new voice-to-text transcription when enabled;
- extension must not start live conversation mode.

### 12.6 T.O.S. test

- enable T.O.S.;
- start ChatGPT voice-to-text transcription;
- speak;
- stop speaking;
- after configured silence duration below threshold, extension clicks the transcription validation button.

### 12.7 Anti-serpent test

- enable Read Aloud and Start transcription;
- trigger a long assistant response;
- extension must not restart microphone before Read Aloud is complete;
- extension must not capture the assistant's own spoken Read Aloud output.

### 12.8 Next Step test

- during active transcription, Next Step validates transcription;
- with transcript ready, Next Step sends;
- with completed assistant message, Next Step starts Read Aloud;
- after Read Aloud completion, Next Step starts transcription when enabled and safe.

## 13. Task-scoped specification boundary

This file is the global repository baseline.

It is intended as the primary context file for Codex or another coding agent when generating the rest of the project documentation.

Task-scoped changes should be recorded in `SPECIFICATIONS.md` and `SPECIFICATIONS_FR.md` during later documentation passes.

French global baseline translation should be created as `SPECIFICATIONS_GLOBAL_FR.md` in a documentation pass.

This file deliberately avoids pretending that all companion documentation files already exist in the user's local repository. It describes the expected project baseline and current product behavior.

## 14. Out-of-scope items

The following are out of scope for the current project baseline:

- replacing ChatGPT's own speech-to-text engine;
- replacing ChatGPT's own Read Aloud engine;
- implementing a local Whisper backend;
- recording full audio files;
- storing audio files;
- uploading audio or text;
- scraping hidden prompts;
- extracting private model reasoning;
- automating account-wide export;
- publishing to Chrome Web Store;
- adding monetization;
- adding telemetry;
- adding cloud sync;
- supporting non-ChatGPT websites;
- supporting Claude, Mistral, Grok, Gemini or other chat UIs in this repository.

## 15. Project history and changelog

### v8.0.0 — 2026-06-03 19:20 — Bruno DELNOZ

Added:

- Project renamed conceptually to `ChatGPT Voice Flow`.
- Added Full / Mini widget mode.
- Added explicit full labels and compact labels.
- Added global Flow On / Off circuit breaker.
- Added Next Step manual advancement.
- Added active step indicators for Send, Read and VTT.
- Preserved v6.1 anti-early-restart guards.

Changed:

- Earlier `Loop` label is replaced conceptually by `Start transcription`.
- Earlier `Send` label is replaced conceptually by `Send transcription`.
- TOS label is standardized as `T.O.S.` or `Time of silence` depending display mode.

Validation status:

- Static generation and syntax checks were performed in the assistant environment for the delivered v8.0 package.
- Browser runtime validation of v8.0 still requires the user to load and test it in Brave.

### v6.1.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Additional guard against early transcription restart while ChatGPT is generating or before the latest assistant response is complete.
- Last-user-message versus last-assistant-message timing guard.
- Recheck before clicking the microphone.

Fixed:

- Reduced risk of the microphone restarting during the assistant thinking phase.

### v6.0.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Anti-serpent lock between Read Aloud and transcription restart.
- Safety delay after Read Aloud completion.

Fixed:

- Reduced risk of restarting transcription while Read Aloud is still speaking.

### v5.5.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Broader search for the ChatGPT voice-to-text validation button.
- Support for `[role="button"]` and compact SVG candidates.

Changed:

- Improved T.O.S. validation-button targeting.

### v5.4.0 — 2026-06-03 — Bruno DELNOZ

Added:

- T.O.S. can be tested independently from Send transcription.
- Better status for cases where the microphone volume is visible but no validation button is found.

Fixed:

- Reduced false blocking from state assumptions during T.O.S. testing.

### v5.3.0 — 2026-06-03 — Bruno DELNOZ

Changed:

- Replaced T.O.S. audio detection with the RMS logic inspired by the user's earlier working `content-widget.js` local Whisper extension.
- Standardized RMS scale where threshold 10 corresponds approximately to RMS 0.01.

### v5.2.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Visible microphone volume indicator.
- Silence seconds range changed to 0–30 for testing.

### v5.1.0 — 2026-06-03 — Bruno DELNOZ

Fixed:

- Widget no longer disappears when internal Yes / No controls are clicked.
- Added event shielding for internal widget controls.

### v5.0.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Manual volume threshold control.
- Red visible extension icons.

### v4.2.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Time of Silence concept based on real microphone RMS volume.
- Silence duration initially adjustable from 5 to 30 seconds.

### v3.1.0 — 2026-06-03 — Bruno DELNOZ

Fixed:

- Corrected wrong-click behavior where transcription restart clicked ChatGPT conversation mode instead of voice-to-text microphone.

### v3.0.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Automatic transcription restart after Read Aloud.
- Initial loop-like workflow.

### v2.0.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Automatic ChatGPT Read Aloud trigger after assistant response.

### v1.0.0 — 2026-06-03 — Bruno DELNOZ

Added:

- Initial runtime extension.
- Floating Auto-send Yes / No widget.
- Automatic send after ChatGPT voice-to-text transcription text appears stable.

## 16. Codex handoff notes

Codex should treat this file as the global baseline for generating repository documentation.

Recommended next documentation tasks:

1. create `SPECIFICATIONS_GLOBAL_FR.md` as a faithful French companion;
2. create `SPECIFICATIONS.md` for the current documentation stabilization task;
3. create `SPECIFICATIONS_FR.md` as its French companion;
4. create `README.md` for normal users;
5. create `INSTALL.md` for Brave/Chromium load-unpacked installation;
6. create `CHANGELOG.md` with the project history above;
7. create `WHY.md` explaining why the extension exists;
8. create `ARCHITECTURE.md` explaining Manifest V3, content script, widget, state machine, RMS audio monitor, and DOM click orchestration.

Codex must not modify `AGENTS.md` or `CLAUDE.md` unless explicitly instructed by the user.
