<!--
Document: SPECIFICATIONS_GLOBAL.md
Project: ChatGPT Voice Flow
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v1.0.0
Project Runtime Version: v8.0
Date / Time: 2026-06-03 21:20
Purpose: Stable global specification baseline for the ChatGPT Voice Flow browser extension.
-->

# ChatGPT Voice Flow — Global Specifications

## 1. Purpose

ChatGPT Voice Flow is a local Brave / Chromium extension that adds a floating control widget on ChatGPT Web.

Its purpose is to create a semi-conversational workflow based on ChatGPT Web's existing voice-to-text transcription and read-aloud features, without using ChatGPT voice conversation mode.

The extension automates UI actions that the user normally performs manually:

- validate a completed voice-to-text transcription;
- send the transcribed text;
- launch ChatGPT's built-in read-aloud action on the assistant response;
- optionally restart voice-to-text transcription after the response has been read;
- optionally detect user silence and validate transcription automatically;
- allow manual flow progression when the user wants to skip waiting.

## 2. Global scope

The extension targets ChatGPT Web in Brave / Chromium.

Supported host pages:

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

The extension is a browser-side automation layer. It does not provide its own speech-to-text model, text-to-speech model, backend service, remote API service, or local native host.

## 3. Stable verified repository behavior

The repository contains a Manifest V3 extension with these runtime files:

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/`

The extension injects a draggable floating widget into ChatGPT Web when enabled from the browser extension action.

The widget provides controls for the full voice workflow:

- global flow enable or disable;
- send transcribed text;
- read the assistant response aloud;
- start a new transcription;
- time-of-silence automation;
- silence duration;
- volume threshold;
- live microphone volume display;
- manual next-step action;
- compact and full label modes;
- visible step indicators.

## 4. Repository architecture

The repository is intentionally lightweight.

`manifest.json` declares the extension metadata, permissions, host permissions, background worker, content script, and icons.

`background.js` coordinates extension action clicks and message routing.

`content-autosend.js` contains the main page automation logic:

- widget creation;
- widget state persistence;
- DOM discovery for ChatGPT controls;
- send transcription automation;
- read aloud automation;
- transcription restart automation;
- time-of-silence detection;
- step state tracking;
- read-aloud and generation guard logic;
- manual next-step logic.

`autosend-style.css` styles the floating widget, compact and full modes, buttons, step indicators, and runtime status display.

`icons/` contains the extension icon set. The current icon is intentionally red and visible in the browser toolbar.

## 5. Global functional requirements

### 5.1 Floating widget

The extension must inject a floating widget into ChatGPT Web.

The widget must be draggable and must preserve its position when possible.

The widget must support a compact mode and a full mode.

The compact mode must use shorter labels.

The full mode must use clearer labels for users who did not build the extension.

The public extension name must be `ChatGPT Voice Flow`.

### 5.2 Global flow switch

The widget must expose a global flow switch.

When Flow is off:

- no send automation may run;
- no read-aloud automation may run;
- no transcription restart may run;
- no time-of-silence automation may run;
- active timers must not trigger workflow actions;
- microphone silence analysis should be stopped when no longer needed.

When Flow is on, the user-selected sub-options control which workflow actions are active.

### 5.3 Send transcription

The extension must send the current ChatGPT composer text when the send transcription option is enabled and the text is stable.

This step corresponds to the normal user action of clicking the ChatGPT send button after ChatGPT Web has completed a voice-to-text transcription.

The extension must avoid duplicate sends of the same text.

The extension must not click unrelated buttons.

### 5.4 Read aloud from ChatGPT

The extension must be able to trigger ChatGPT Web's built-in read-aloud action on the latest assistant response.

The extension must target the latest assistant message only.

The extension must avoid replaying old assistant messages when a newer response exists.

The extension must not use its own text-to-speech engine.

### 5.5 Start transcription

The extension must optionally start a new ChatGPT Web voice-to-text transcription after the assistant response has been read.

This step must target the voice-to-text transcription microphone control, not the ChatGPT live conversation mode control.

The extension must avoid starting transcription while ChatGPT is still generating, still thinking, or still reading aloud.

### 5.6 Time of silence

The extension must optionally detect user silence while ChatGPT voice-to-text transcription is active.

When enabled, T.O.S. must detect microphone volume using a browser audio analyser.

T.O.S. must use RMS-based volume measurement based on `getByteTimeDomainData()` with an analyser FFT size of 2048.

T.O.S. must expose a user-adjustable silence duration.

T.O.S. must expose a user-adjustable volume threshold.

T.O.S. must display the current microphone volume to help the user tune the threshold.

When the microphone volume remains below the configured threshold for the configured duration, the extension must attempt to validate the current ChatGPT voice-to-text transcription by clicking the ChatGPT validation control.

### 5.7 Manual next step

The widget must expose a manual next-step control.

The next-step control must attempt to advance the workflow based on the current visible state.

Possible next-step actions include:

- validate the current transcription;
- send the current transcription;
- launch read aloud on the assistant response;
- start a new transcription.

The next-step action must obey the global Flow setting.

### 5.8 Step indicators

The widget must expose visible step indicators.

At minimum, it must distinguish:

- send transcription;
- read aloud;
- start transcription.

The active step must be visually highlighted.

T.O.S. is not a conversational step. It is an automation option that can trigger the transcription validation step.

## 6. Global non-functional requirements

The extension must remain local-first.

The extension must not upload user content.

The extension must not call external APIs.

The extension must not send telemetry.

The extension must not use a backend service.

The extension must not use Native Messaging.

The extension must request microphone access only for local silence detection.

The extension must keep browser permissions narrow.

The extension must be usable as an unpacked development extension in Brave / Chromium.

The extension must remain robust against ChatGPT Web UI changes by using cautious DOM detection and fail-safe behavior.

If a target control is ambiguous, the extension should do nothing instead of clicking the wrong control.

## 7. Global inputs

User inputs are browser UI actions and widget settings:

- browser extension action click;
- widget drag position;
- Flow on or off;
- Send transcription on or off;
- Read aloud on or off;
- Start transcription on or off;
- T.O.S. on or off;
- silence duration;
- volume threshold;
- compact or full display mode;
- manual next-step click;
- ChatGPT Web voice-to-text transcription controls;
- ChatGPT Web read-aloud controls.

## 8. Global outputs

The extension produces UI automation effects only:

- floating widget visibility;
- step status display;
- volume display;
- button clicks on ChatGPT Web controls;
- local state persistence in the browser page or extension storage.

The extension does not produce downloadable exports, chat transcripts, server logs, or external reports.

## 9. Global files and directories

Expected runtime files:

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/icon16.png`
- `icons/icon32.png`
- `icons/icon48.png`
- `icons/icon128.png`

Expected documentation files:

- `README.md`
- `README_FR.md`
- `INSTALL.md`
- `INSTALL_FR.md`
- `CHANGELOG.md`
- `CHANGELOG_FR.md`
- `ARCHITECTURE.md`
- `ARCHITECTURE_FR.md`
- `SPECIFICATIONS_GLOBAL.md`
- `SPECIFICATIONS_GLOBAL_FR.md`

Governance files such as `AGENTS.md` and `CLAUDE.md` are not runtime extension files.

## 10. Global interfaces and commands

The extension is installed through the browser unpacked extension workflow.

The user loads the repository folder in `brave://extensions/` or `chrome://extensions/` with developer mode enabled.

After replacing files during development, the user must reload the extension in the browser extension page and refresh the ChatGPT Web tab.

No command-line runtime is required.

## 11. Global constraints and safety rules

The extension must not control unrelated websites.

The extension must not run actions when the global Flow switch is off.

The extension must avoid triggering ChatGPT live conversation mode.

The extension must avoid starting voice-to-text transcription while read-aloud is still active.

The extension must avoid starting voice-to-text transcription while ChatGPT is still generating or thinking.

The extension must stop or ignore timers when the widget is disabled or removed.

The extension must preserve user-configured settings when possible.

The extension must prefer fail-safe inactivity over a wrong click.

## 12. Global validation and acceptance criteria

The extension is acceptable when these manual tests pass on ChatGPT Web:

1. The extension action shows or hides the floating widget.
2. The widget can be moved and remains usable after movement.
3. Flow off prevents all workflow automation.
4. Send transcription sends a completed voice-to-text transcription automatically.
5. Read aloud starts ChatGPT Web read-aloud on the latest assistant response.
6. Start transcription starts ChatGPT Web voice-to-text transcription and does not start live conversation mode.
7. T.O.S. shows microphone volume changes while the user speaks.
8. T.O.S. validates transcription after the configured silence duration and threshold.
9. The workflow does not restart transcription while ChatGPT is still generating.
10. The workflow does not restart transcription while read-aloud is still active.
11. Next step advances the workflow without ignoring the global Flow setting.
12. Compact and full widget modes display the intended short and long labels.

## 13. Out-of-scope items

The extension does not implement its own speech-to-text engine.

The extension does not implement its own text-to-speech engine.

The extension does not replace ChatGPT's official voice conversation mode.

The extension does not export chats.

The extension does not manage OpenAI account settings.

The extension does not provide a server component.

The extension does not guarantee compatibility with future ChatGPT Web DOM changes.

## 14. Codex handoff notes

This file is the repository baseline specification.

Codex should use this document as the primary stable behavior reference when generating or correcting runtime code and companion documentation.

Historical development details, bug fixes, and version evolution belong in `CHANGELOG.md`, not in this global specification file.
