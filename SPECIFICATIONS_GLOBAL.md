<!--
DOCUMENT INFORMATION
Document Name: SPECIFICATIONS_GLOBAL.md
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v10.2.0
Date / Time: 2026-06-05 18:10
Project: ChatGPT Voice Flow
Short description: Global specification for the ChatGPT Voice Flow v10 developer state-machine rebuild.
-->

# SPECIFICATIONS_GLOBAL.md

## Purpose

Rebuild ChatGPT Voice Flow v10.1.0 around a visible developer-oriented state machine.

## Source decision

- Use `v8.8.0` as the main runtime code base.
- Do not use `v9.0.0` as runtime base.
- Use `v9.0.0` changelog only as a reference for useful fixes.
- Release the next version as `v10.1.0`, not `v9.1`.

## Workflow model

The extension must model the workflow as blocks, states, actions and triggers.

## Blocks

Voice recording:

- Start voice recording for transcription.
- Voice recording in progress.
- Request recorded voice-to-text transcription.

Transcript / message:

- Write transcribed text to interface.
- Send transcribed text to ChatGPT.

ChatGPT response:

- ChatGPT in thinking mode.
- ChatGPT in writing mode.
- ChatGPT in read aloud mode.

Loop / restart:

- Loop back to step 1.

## States

States describe what the interface is currently doing.

Examples:

- voice recording in progress;
- transcript text visible in composer;
- ChatGPT thinking;
- ChatGPT writing;
- ChatGPT read aloud active.

## Actions

Actions are short extension operations.

Examples:

- click voice recording start;
- click transcription validation;
- click send;
- click read aloud;
- click stop read aloud;
- click stop generating;
- restart recording.

## Triggers

Triggers cause a state transition or an action.

Examples:

- T.O.S.;
- Next;
- Stop;
- Loop;
- Flow activation;
- manual Developer Mode test button.

## Developer Mode requirements

Developer Mode must display:

- current workflow state;
- all four blocks;
- all nine steps;
- active bullets;
- per-step On / Off toggles;
- per-step Test buttons.

Developer Mode is the main v10.1.0 work mode.

## Normal mode requirements

Normal mode keeps the existing Mini / Maxi behavior for now.

A future user Light Mode can be built after Developer Mode is stable.

## Safety rules

- Start Transcription set to No must never start voice recording automatically.
- T.O.S. must act only during voice recording.
- T.O.S. is a trigger, not a long-running state.
- Send transcribed text is a short action.
- Next must be state-aware.
- Stop must be state-aware.
- During Read Aloud, Stop or Next must stop the real Read Aloud before microphone restart.
- During Thinking or Writing, the microphone must not restart unless explicitly and safely requested.
- Old timers or async jobs must not restart transcription after a state, toggle, widget or flow change.

## Validation

Static validation for this package:

- manifest JSON parsing;
- JavaScript syntax check;
- shell-independent package build;
- anti-regression bytes/lines check against v8.8 base.

Real Brave runtime testing remains to be done by the user.

## v10.1.0 update

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


## v11.0.0 - Fast developer update requirements

Purpose: reduce the manual install/test cycle for unpacked Brave extension development.

Requirements:

- provide a local update script named `update-dev-version.sh`;
- use `./.zip/` as the default package input directory;
- use `./.old/` as the backup directory;
- validate `manifest.json` before replacing runtime files;
- refuse packages containing `AGENTS.md` or `CLAUDE.md`;
- replace only project runtime and minimal documentation files;
- add a Developer Mode `Reload Ext` control;
- keep the first manual Brave `Load unpacked` step out of scope.

Repository reference:

`/mnt/data2_78g/Security/scripts/Projects_web/braveChatGPTVoiceFloWextension`

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
