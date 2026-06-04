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
