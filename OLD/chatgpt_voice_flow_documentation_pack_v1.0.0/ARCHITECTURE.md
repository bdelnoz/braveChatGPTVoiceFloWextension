<!--
Document: ARCHITECTURE.md
Project: ChatGPT Voice Flow
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v1.0.0
Project Runtime Version: v8.0
Date / Time: 2026-06-03 21:20
-->

# Architecture

## Overview

ChatGPT Voice Flow is a Manifest V3 browser extension.

It runs mostly as a content script injected into ChatGPT Web.

The content script owns the floating widget and the UI automation logic.

## Components

### manifest.json

Defines extension metadata, permissions, host permissions, background worker, content script, CSS, and icons.

### background.js

Handles browser extension action events and message routing.

The background worker is intentionally small.

### content-autosend.js

Main runtime module.

Responsibilities:

- create and update the widget;
- store widget state;
- detect ChatGPT composer state;
- detect ChatGPT voice-to-text controls;
- detect ChatGPT read-aloud controls;
- send transcriptions;
- launch read-aloud;
- restart transcription;
- detect silence through microphone RMS analysis;
- display current volume;
- guard against premature workflow transitions;
- implement manual next-step behavior.

### autosend-style.css

Defines floating widget layout and styling.

Includes full and compact display modes, button styling, status indicators, and step indicators.

### icons

Contains the browser toolbar icons.

The icon color is intentionally red for quick visual recognition.

## Runtime flow

The intended full flow is:

1. User starts ChatGPT voice-to-text transcription.
2. User speaks.
3. T.O.S. optionally detects silence and validates transcription.
4. Send transcription optionally sends the transcribed text.
5. ChatGPT generates the assistant response.
6. Read aloud optionally launches ChatGPT read-aloud.
7. Start transcription optionally restarts voice-to-text transcription.

## State model

The extension tracks state from both its widget settings and ChatGPT Web UI.

Important state groups:

- global Flow enabled or disabled;
- individual feature toggles;
- current step indicator;
- last observed user text;
- last assistant response state;
- read-aloud active or inactive state;
- generation or thinking state;
- microphone volume and silence timer;
- widget position and display mode.

## Safety model

The extension is designed to fail safe.

When a DOM target is ambiguous, no click is preferable to a wrong click.

When Flow is off, no workflow action should execute.

When read-aloud or generation is active, transcription restart should be blocked.

When microphone permission is unavailable, T.O.S. should not run.

## Limitations

ChatGPT Web DOM is not a stable public API.

Selectors can break if ChatGPT changes its interface.

The extension automates UI behavior and must be retested after visible ChatGPT Web UI changes.
