<!--
Document: INSTALL.md
Project: ChatGPT Voice Flow
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v1.0.0
Project Runtime Version: v8.0
Date / Time: 2026-06-03 21:20
-->

# Installation

## Requirements

- Brave Browser or another Chromium-based browser.
- Developer mode enabled in the browser extensions page.
- Local repository folder containing the extension runtime files.

## Runtime files required

The browser must load a folder containing at least:

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/`

## Install as unpacked extension in Brave

1. Open Brave.
2. Open `brave://extensions/`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the repository folder that contains `manifest.json`.
6. Open ChatGPT Web.
7. Click the extension icon to show the widget.

## Update during development

When replacing extension files during development:

1. Overwrite the files in the local repository folder.
2. Open `brave://extensions/`.
3. Click Reload on the extension card.
4. Refresh the ChatGPT Web tab.

Deleting and re-importing the extension is normally not required when the extension remains loaded from the same unpacked folder.

## Microphone permission

The extension may request microphone permission for local time-of-silence detection.

The microphone is used locally in the browser to measure audio volume.

The extension does not upload audio.

## Recommended first test

Use a simple test sequence:

1. Open ChatGPT Web.
2. Show the widget.
3. Set Flow to On.
4. Enable only Send transcription first.
5. Start ChatGPT voice-to-text manually.
6. Speak a short sentence.
7. Validate the transcription manually.
8. Confirm that the extension sends the text.

Then enable Read aloud, Start transcription, and T.O.S. one at a time.

## Troubleshooting

If the widget does not appear, reload the extension and refresh the ChatGPT tab.

If changes are not visible, confirm that Brave is loading the correct local folder.

If T.O.S. does not react, verify microphone permission and watch the volume value in the widget.

If the wrong ChatGPT button is clicked, the DOM selector must be adjusted in `content-autosend.js`.
