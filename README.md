################################################################################
# DOCUMENT INFORMATION
################################################################################
# Document Name    : README.md
# Document Full Path & name : README.md
# Author         : Bruno DELNOZ
# Email          : bruno.delnoz@protonmail.com
# Version        : V1.0
# Date  / Time   : 2026-02-09 19:22:16
# Project : braveChatGPTVoiceFlowWextension
# Short description : Project overview
################################################################################
# Document Name    : README.md
# Document Full Path & name : README.md
# Author         : Bruno DELNOZ
# Email          : bruno.delnoz@protonmail.com
# Version        : V1.0
# Date  / Time   : 2026-02-09 19:22:16
# Project : braveChatGPTVoiceFlowWextension
# Short description : Project overview
################################################################################
<!--
Document: README.md
Project: ChatGPT Voice Flow
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v1.0.0
Project Runtime Version: v8.0
Date / Time: 2026-06-03 21:20
-->

# ChatGPT Voice Flow

ChatGPT Voice Flow is a local Brave / Chromium extension for ChatGPT Web.

It adds a draggable floating widget that can automate a semi-conversational workflow using ChatGPT Web's existing voice-to-text transcription and read-aloud features.

## What it does

The extension can help automate this workflow:

1. Start ChatGPT Web voice-to-text transcription.
2. Detect user silence and validate the transcription.
3. Send the transcribed text.
4. Wait for the assistant response.
5. Trigger ChatGPT Web read-aloud on the response.
6. Optionally start a new voice-to-text transcription.

The goal is to create a practical voice flow without using ChatGPT's live conversation mode.

## Main features

- Floating draggable widget.
- Global Flow On / Off switch.
- Send transcription automation.
- Read aloud automation.
- Start transcription automation.
- Time of silence detection.
- Manual volume threshold.
- Live microphone volume display.
- Manual Next step button.
- Compact and full widget display modes.
- Visible step indicators.
- Red toolbar icon for fast visibility.

## Local-first design

The extension does not use a backend.

It does not call external APIs.

It does not upload user data.

It does not provide its own speech-to-text or text-to-speech engine.

It only automates ChatGPT Web UI controls in the browser.

## Supported browsers

- Brave Browser.
- Chromium-based browsers that support Manifest V3 unpacked extensions.

## Supported sites

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

## Repository files

Runtime files:

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/`

Documentation files:

- `SPECIFICATIONS_GLOBAL.md`
- `SPECIFICATIONS_GLOBAL_FR.md`
- `README.md`
- `README_FR.md`
- `INSTALL.md`
- `INSTALL_FR.md`
- `CHANGELOG.md`
- `CHANGELOG_FR.md`
- `ARCHITECTURE.md`
- `ARCHITECTURE_FR.md`

## Development status

The current runtime baseline is v8.0.

The extension was built iteratively through live browser testing on ChatGPT Web.

The current version covers the original target and additional workflow automation features.

## Important note

This extension depends on ChatGPT Web UI structure.

If ChatGPT Web changes its DOM, selectors may need updates.
