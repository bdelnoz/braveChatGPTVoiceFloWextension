<!--
DOCUMENT INFORMATION
Document Name: README.md
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v10.2.0
Date / Time: 2026-06-05 18:10
Project: ChatGPT Voice Flow
Short description: Runtime package for the ChatGPT Voice Flow browser extension v10 developer state-machine rebuild.
-->

# ChatGPT Voice Flow

ChatGPT Voice Flow is a local Brave / Chromium extension for controlling a ChatGPT Web voice workflow.

## v10.2.0 baseline

This version deliberately uses **v8.8.0 as code base**.

`v9.0.0` is not used as runtime base because it regressed during real testing. Its changelog is used only as a reference for corrections to preserve.

## v10.2.0 concept

The extension now exposes a Developer Mode based on workflow blocks and states instead of only a few Yes / No toggles.

Workflow blocks:

- Voice recording.
- Transcript / message.
- ChatGPT response.
- Loop / restart.

Developer workflow steps:

- Start voice recording for transcription.
- Voice recording in progress.
- Request recorded voice-to-text transcription.
- Write transcribed text to interface.
- Send transcribed text to ChatGPT.
- ChatGPT in thinking mode.
- ChatGPT in writing mode.
- ChatGPT in read aloud mode.
- Loop back to step 1.

## Normal mode

The existing Mini / Maxi widget behavior is preserved for now.

## Developer Mode

Developer Mode adds:

- a visible current workflow state;
- the four workflow blocks;
- the nine workflow steps;
- active bullets;
- per-step On / Off toggles;
- per-step Test buttons;
- a state-aware Stop button.

Developer Mode is intended for debugging the workflow before a future simplified user mode is rebuilt.

## Hard rules preserved

- Start Transcription set to No blocks automatic voice recording restart.
- T.O.S. only acts during voice recording / transcription.
- T.O.S. is a trigger, not a state.
- Next is state-aware.
- Stop is state-aware.
- Read aloud must be stopped before restarting the microphone.
- Thinking / writing must not restart the microphone unless explicitly and safely requested.
- Stale async jobs are invalidated through automation epochs.

## v10.2.0 update

- Manifest import bug fixed by using a short Manifest V3 description.
- Developer Mode now includes a step selector with `Run Selected` and `Set State`.
- Purpose: test any one of the 9 workflow steps without running the full loop.

## v10.2.0 — Developer Mode reset and T.O.S.-only trigger row

- Compact Developer Mode width for small screens.
- Legacy `Send Transcription`, `Read Aloud` and `Start Transcription` rows are hidden in Developer Mode.
- `T.O.S.` remains visible because it is the trigger for requesting recorded voice transcription.
- Developer step toggles now default OFF after version upgrade and must be enabled explicitly.
- State-only steps no longer expose a misleading `Test` action.
- Entering Developer Mode disables old auto Send/Read/Loop toggles and invalidates stale async jobs.


## v11.0.0 - Fast dev update workflow

This version adds a fast local update workflow for unpacked Brave extension testing.

User workflow:

1. Download the new runtime ZIP into `./.zip/`.
2. Run `./update-dev-version.sh --latest` from the repository root.
3. Click `Reload Ext` in Developer Mode.
4. If the widget disappears, click the Brave extension icon once.

Known local repository path used for this project:

`/mnt/data2_78g/Security/scripts/Projects_web/braveChatGPTVoiceFloWextension`

The updater script preserves `AGENTS.md`, `CLAUDE.md`, `.git`, `.zip` and `.old`.

## v11.1.0 — Developer Mode ON/OFF correction

- Developer Mode now starts enabled after upgrade.
- Each of the 9 workflow steps now has explicit `No` and `Yes` controls.
- Selected `Yes` is green; selected `No` is red.
- Missing Developer Mode step configuration is treated as OFF, not ON.
- Developer Mode width was reduced to save screen space.
- Legacy `Send`, `Read`, and `Start transcription` rows stay hidden in Developer Mode.
- `T.O.S.` remains visible as the useful trigger for step 3.

## v11.2.0 — Native Messaging Update Dev

Added a local developer-only update workflow.

The widget now includes an `Update` button in Developer Mode.

The button asks the background service worker to call the local Native Messaging host `be.noxoz.voiceflow.dev_updater`.

The host runs:

```text
./update-dev-version.sh --latest
```

After a successful update, the extension reloads and marks open ChatGPT tabs for refresh so the new runtime is loaded without the old content script staying alive.

First-time setup still requires:

```text
./update-dev-version.sh --install-native-host
```

This feature is developer-only and is not intended for final end users.

## v11.3.0 — Mini button instead of hide

The header dot no longer hides the widget.

It now switches the widget into a compact mini button.

The compact mini button displays `VF`.

Clicking `VF` restores the full widget.

This follows the mini-button behavior requested from the separate AutoSend reference extension while keeping the ChatGPT Voice Flow controls unchanged.
