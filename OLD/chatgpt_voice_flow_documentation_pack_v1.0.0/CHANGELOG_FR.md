<!--
Document: CHANGELOG_FR.md
Project: ChatGPT Voice Flow
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v1.0.0
Date / Time: 2026-06-03 21:20
-->

# Journal des changements

Tous les changements notables du projet sont consignés ici.

## v8.0 — 2026-06-03

### Ajouté

- Ajout de global Flow On / Off switch.
- Ajout de manual Next step button.
- Ajout de visible step indicators.
- Ajout de compact and full widget display modes.
- Ajout de clearer public name: ChatGPT Voice Flow.
- Ajout de clearer labels for the end-to-end voice workflow.

### Modifié

- Reframed the project from a simple auto-send extension to a full ChatGPT voice workflow helper.
- Amélioration de UI terminology to reduce confusion between sending text, reading a response, and starting transcription.

## v7.0 — 2026-06-03

### Ajouté

- Ajout de compact and expanded label concept.
- Ajout de more user-readable labels for non-developer users.

### Modifié

- Renamed the extension display concept toward ChatGPT Voice Flow.
- Remplacement de internal shorthand labels with clearer flow-oriented labels.

## v6.1 — 2026-06-03

### Corrigé

- Ajout de guards to prevent transcription restart while ChatGPT is still thinking or before the expected assistant response state is reached.
- Reduced premature restart risk between send and read-aloud phases.

## v6.0 — 2026-06-03

### Corrigé

- Ajout de read-aloud to transcription-restart locking.
- Prevented transcription restart while read-aloud is likely still active.
- Ajout de a safety delay before restarting transcription after read-aloud.

## v5.5 — 2026-06-03

### Corrigé

- Amélioration de detection of ChatGPT's transcription validation control.
- Expanded selector strategy beyond standard buttons.
- Ajout de broader lower-page candidate search for the voice-to-text validation control.

## v5.4 — 2026-06-03

### Corrigé

- Rendu T.O.S. independent from the Send transcription option for unit testing.
- Amélioration de status reporting for the transcription validation button detection.

## v5.3 — 2026-06-03

### Modifié

- Remplacement de the previous silence detection logic with RMS-based detection inspired by the existing working Whisper widget.
- Utilisation de `getByteTimeDomainData()` and FFT size 2048.
- Mapped volume and threshold to a practical RMS-derived scale.

## v5.2 — 2026-06-03

### Ajouté

- Ajout de visible microphone volume display.
- Modification de silence duration range to support lower testing values.

### Corrigé

- Amélioration de diagnostics for cases where microphone audio was received but T.O.S. did not trigger.

## v5.1 — 2026-06-03

### Corrigé

- Correction de widget disappearance after clicking widget controls.
- Ajout de stronger widget click event shielding.
- Amélioration de replacement of older injected widget instances after extension reload.

## v5.0 — 2026-06-03

### Ajouté

- Ajout de manual volume threshold control for T.O.S.
- Ajout de red browser toolbar icons.

### Modifié

- Rendu T.O.S. more adjustable for real microphone background noise.

## v4.2 — 2026-06-03

### Modifié

- Modification de T.O.S. duration range from 10–30 seconds to 5–30 seconds.
- Utilisation de compact T.O.S. label.

## v4.1 — 2026-06-03

### Ajouté

- Ajout de real microphone-based time-of-silence detection.
- Ajout de automatic transcription validation after detected silence.

## v3.1 — 2026-06-03

### Corrigé

- Correction de transcription restart selector to avoid clicking ChatGPT live conversation mode.
- Ciblage de ChatGPT voice-to-text transcription control more strictly.

## v3.0 — 2026-06-03

### Ajouté

- Ajout de transcription restart after read-aloud.
- Création de the first complete loopable voice-to-text and read-aloud workflow.

## v2.0 — 2026-06-03

### Ajouté

- Ajout de ChatGPT read-aloud automation for the latest assistant response.

## v1.0 — 2026-06-03

### Ajouté

- Ajout de initial floating widget.
- Ajout de Send Yes / No control.
- Ajout de automatic sending of completed ChatGPT Web voice-to-text transcription.
- Ajout de draggable widget behavior.
