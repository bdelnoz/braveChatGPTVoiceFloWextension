<!--
Document: CHANGELOG.md
Project: ChatGPT Voice Flow
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v1.0.0
Date / Time: 2026-06-03 21:20
-->

# Changelog

All notable project changes are recorded here.

## v9.0.0 — 2026-06-04

### Fixed

- Reworked `Next Step` during Read Aloud so it targets the real Read Aloud stop/toggle control instead of closing the actions menu.
- Added message-scoped Read Aloud stop/toggle search: latest read message first, menu toggle second, strict global stop candidates last.
- Reworked `Next Step` during Think so it targets ChatGPT's bottom composer-area Stop Generating square before VTT restart.
- Added a hard T.O.S. no-speech guard so silence alone cannot validate or send an empty transcription.
- Preserved the hard `Start Transcription = No` gate: no automatic VTT restart when disabled.
- Kept the v8.8 step-display behavior where Think, Read and VTT are visibly separated.

## v8.8.0 — 2026-06-04

### Fixed

- Hardened `Next Step` during Read aloud: it now targets the real Stop reading control and must confirm stop before starting VTT.
- Hardened `Next Step` during Think: it now targets ChatGPT's Stop generating control before any VTT restart.
- Blocked T.O.S. while ChatGPT is thinking or reading to prevent self-transcription of ChatGPT's own voice.
- Added stale-loop protection so old async read/loop jobs cannot restart transcription after toggles, Flow, or widget state changed.
- Kept Start Transcription OFF as a hard blocker for automatic VTT restart.
- Improved step-state priority so a post-send response cycle stays in Think/Read instead of falling back to VTT too early.
- Added nested visual grouping for the Think / Read status pill.


## v8.7 — 2026-06-03

### Fixed

- Split the post-send phase into `Think` and real `Read` states.
- Fixed `Next Step` during `Think`: it skips the wait without trying to stop Read aloud.
- Fixed `Next Step` during `Read`: VTT restart is blocked unless Read aloud stop is confirmed.
- Added stronger guards against ghost Start Transcription during Think, Read, pending response, or stale async jobs.

### Changed

- Replaced the step display with compact pills: `Send`, grouped `Think / Read`, and `VTT`.
- Moved red state dots after the labels.
- Changed widget labels to Title Case, including `Full Flow Activation` and Mini `Full Flow Act.`.
- Kept `Mini / Maxi` wording and tightened the widget layout.

## v8.0 — 2026-06-03

### Added

- Added global Flow On / Off switch.
- Added manual Next step button.
- Added visible step indicators.
- Added compact and full widget display modes.
- Added clearer public name: ChatGPT Voice Flow.
- Added clearer labels for the end-to-end voice workflow.

### Changed

- Reframed the project from a simple auto-send extension to a full ChatGPT voice workflow helper.
- Improved UI terminology to reduce confusion between sending text, reading a response, and starting transcription.

## v7.0 — 2026-06-03

### Added

- Added compact and expanded label concept.
- Added more user-readable labels for non-developer users.

### Changed

- Renamed the extension display concept toward ChatGPT Voice Flow.
- Replaced internal shorthand labels with clearer flow-oriented labels.

## v6.1 — 2026-06-03

### Fixed

- Added guards to prevent transcription restart while ChatGPT is still thinking or before the expected assistant response state is reached.
- Reduced premature restart risk between send and read-aloud phases.

## v6.0 — 2026-06-03

### Fixed

- Added read-aloud to transcription-restart locking.
- Prevented transcription restart while read-aloud is likely still active.
- Added a safety delay before restarting transcription after read-aloud.

## v5.5 — 2026-06-03

### Fixed

- Improved detection of ChatGPT's transcription validation control.
- Expanded selector strategy beyond standard buttons.
- Added broader lower-page candidate search for the voice-to-text validation control.

## v5.4 — 2026-06-03

### Fixed

- Made T.O.S. independent from the Send transcription option for unit testing.
- Improved status reporting for the transcription validation button detection.

## v5.3 — 2026-06-03

### Changed

- Replaced the previous silence detection logic with RMS-based detection inspired by the existing working Whisper widget.
- Used `getByteTimeDomainData()` and FFT size 2048.
- Mapped volume and threshold to a practical RMS-derived scale.

## v5.2 — 2026-06-03

### Added

- Added visible microphone volume display.
- Changed silence duration range to support lower testing values.

### Fixed

- Improved diagnostics for cases where microphone audio was received but T.O.S. did not trigger.

## v5.1 — 2026-06-03

### Fixed

- Fixed widget disappearance after clicking widget controls.
- Added stronger widget click event shielding.
- Improved replacement of older injected widget instances after extension reload.

## v5.0 — 2026-06-03

### Added

- Added manual volume threshold control for T.O.S.
- Added red browser toolbar icons.

### Changed

- Made T.O.S. more adjustable for real microphone background noise.

## v4.2 — 2026-06-03

### Changed

- Changed T.O.S. duration range from 10–30 seconds to 5–30 seconds.
- Used compact T.O.S. label.

## v4.1 — 2026-06-03

### Added

- Added real microphone-based time-of-silence detection.
- Added automatic transcription validation after detected silence.

## v3.1 — 2026-06-03

### Fixed

- Corrected transcription restart selector to avoid clicking ChatGPT live conversation mode.
- Targeted ChatGPT voice-to-text transcription control more strictly.

## v3.0 — 2026-06-03

### Added

- Added transcription restart after read-aloud.
- Created the first complete loopable voice-to-text and read-aloud workflow.

## v2.0 — 2026-06-03

### Added

- Added ChatGPT read-aloud automation for the latest assistant response.

## v1.0 — 2026-06-03

### Added

- Added initial floating widget.
- Added Send Yes / No control.
- Added automatic sending of completed ChatGPT Web voice-to-text transcription.
- Added draggable widget behavior.

## v10.0.0 — 2026-06-05

### Added

- Rebuilt the extension concept around a v10 Developer Mode state machine.
- Added four workflow blocks:
  - Voice recording.
  - Transcript / message.
  - ChatGPT response.
  - Loop / restart.
- Added nine visible developer workflow steps:
  - Start voice recording for transcription.
  - Voice recording in progress.
  - Request recorded voice-to-text transcription.
  - Write transcribed text to interface.
  - Send transcribed text to ChatGPT.
  - ChatGPT in thinking mode.
  - ChatGPT in writing mode.
  - ChatGPT in read aloud mode.
  - Loop back to step 1.
- Added Developer Mode UI with active bullets, step enable/disable toggles and per-step Test buttons.
- Added a state-aware Stop button next to Next Step.
- Added v10 workflow-state bridge while keeping v8.8 as the runtime base.

### Fixed / carried forward from v9.0 reference

- Kept Start Transcription OFF as a hard no-restart gate.
- Added the no-speech T.O.S. guard so silence alone cannot validate or send an empty transcription.
- Preserved Think / Read / VTT separation from v8.8.
- Preserved stale async job protection through automation epoch invalidation.

### Changed

- The next major version is v10.0.0, not v9.1, because the workflow model changes from simple toggles to a state-machine-oriented developer workflow.
- v9.0.0 is not used as runtime base because it regressed in real testing.
- v9.0.0 changelog is used only as a correction reference.

### Not included

- No Light/User mode rebuild yet.
- No install documentation pass.
- No full documentation package.

## v10.1.0 — 2026-06-05

### Fixed

- Fixed Chromium/Brave import failure caused by an invalid oversized manifest description.

### Added

- Added Developer Mode selected-step control.
- Added `Run Selected` to run any selected workflow step directly.
- Added `Set State` to mark any selected workflow step as the current visible state without running the full flow.

### Validation

- Manifest JSON parse: executed.
- Manifest description length check: executed.
- JavaScript syntax checks: executed.
- ZIP excludes `AGENTS.md` and `CLAUDE.md`: executed.

## v10.2.0 — Developer Mode reset and T.O.S.-only trigger row

- Compact Developer Mode width for small screens.
- Legacy `Send Transcription`, `Read Aloud` and `Start Transcription` rows are hidden in Developer Mode.
- `T.O.S.` remains visible because it is the trigger for requesting recorded voice transcription.
- Developer step toggles now default OFF after version upgrade and must be enabled explicitly.
- State-only steps no longer expose a misleading `Test` action.
- Entering Developer Mode disables old auto Send/Read/Loop toggles and invalidates stale async jobs.


## v11.0.0 - 2026-06-05

### Added

- Added `update-dev-version.sh` fast local updater.
- Added support for ZIP packages stored in `./.zip/`.
- Added timestamped backup creation under `./.old/`.
- Added manifest validation before overwrite.
- Added package refusal when `AGENTS.md` or `CLAUDE.md` are present.
- Added Developer Mode `Reload Ext` button.
- Added background runtime reload handler.

### Changed

- Bumped runtime, manifest and visible widget version to `v11.0.0`.

### Validation

- Manifest JSON parsing executed.
- `node --check background.js` executed.
- `node --check content-autosend.js` executed.
- `sh -n update-dev-version.sh` executed.
- `./update-dev-version.sh --help` executed.
- `./update-dev-version.sh --dry-run --package <current zip>` executed.
- ZIP exclusion check for `AGENTS.md` and `CLAUDE.md` executed.

## v11.1.0 — 2026-06-05

### Fixed

- Replaced single Developer Mode step toggle with explicit `No` / `Yes` buttons.
- Fixed unclear OFF/ON visual behavior in the 9-step Developer Mode panel.
- Made OFF strict in Developer Mode: missing step config no longer counts as enabled.
- Made Developer Mode start enabled after upgrade.
- Reduced Developer Mode width and middle whitespace.
- Kept `T.O.S.` as the only legacy trigger visible in Developer Mode.

### Validation

- Manifest JSON parsing executed.
- JavaScript syntax check executed.
- Shell syntax check executed.
- No-argument updater help executed.
- ZIP excludes AGENTS.md and CLAUDE.md.

## v11.2.0 — 2026-06-05 14:35

### Added

- Added `nativeMessaging` permission to `manifest.json`.
- Added Developer Mode `Update` button.
- Added background handler `CGAS_UPDATE_DEV_VERSION`.
- Added Native Messaging host installer in `update-dev-version.sh --install-native-host`.
- Added local Native Messaging host name `be.noxoz.voiceflow.dev_updater`.
- Added post-reload ChatGPT tab refresh flag to reduce manual clicks after extension reload.
- Added `--native-status` and `--native-uninstall`.

### Changed

- `Reload Ext` now marks open ChatGPT tabs for refresh after extension reload.
- `update-dev-version.sh` can now install or inspect the local development native host.

### Validation

- Manifest JSON parsing: executed.
- JavaScript syntax checks: executed.
- Bash syntax check: executed.
- Python host syntax check: executed.
- No-argument help behavior: executed.
- ZIP exclusion check for AGENTS.md and CLAUDE.md: executed.

## v11.3.0 — 2026-06-06 04:55

### Changed

- Changed the header dot behavior from hide to mini button.
- Added persistent `widgetMinimized` state.
- Added compact `VF` restore button.
- Clicking `VF` restores the full widget.
- Extension show/toggle restores from mini state when useful.
- Synchronized `update-dev-version.sh` to v11.3.0.

### Validation

- Manifest JSON parsing: executed.
- JavaScript syntax checks: executed.
- Bash syntax check: executed.
- No-argument help behavior: executed.
- ZIP exclusion check for AGENTS.md and CLAUDE.md: executed.
