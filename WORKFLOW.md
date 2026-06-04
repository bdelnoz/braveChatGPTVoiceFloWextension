<!--
Document: WORKFLOW.md
Project: ChatGPT Voice Flow
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v1.0.1
Date: 2026-06-04
-->

# ChatGPT Voice Flow — Workflow

## 1. Main flow

The intended full flow is:

1. Voice recording starts.
2. User speaks.
3. Time of Silence optionally detects the end of speech.
4. The extension validates the voice recording.
5. ChatGPT transcribes audio into text.
6. Send transcription sends the message.
7. ChatGPT enters Thinking.
8. ChatGPT produces a response.
9. Read aloud starts if enabled.
10. The answer is read aloud.
11. Start transcription may restart voice recording if enabled.

## 2. Visible states

The useful visible states are:

- Voice recording.
- Transcribing.
- Thinking.
- Read aloud.
- Idle.

Send is only a short internal action.

## 3. Think state

Think starts immediately after Send transcription.

During Think:

- ChatGPT is preparing or generating the answer;
- Read aloud has not started yet;
- Start transcription must not trigger automatically.

If the user presses Next during Think, the extension may skip waiting and move to Start transcription only if safe and enabled.

## 4. Read state

Read starts only when ChatGPT Read aloud actually begins speaking.

During Read:

- Start transcription must not trigger automatically;
- Next must stop Read aloud first;
- if Read aloud cannot be confirmed stopped, no voice recording should start.

## 5. Time of Silence

Time of Silence is not a state.

It is a trigger that only works during Voice recording.

It must not act during Think or Read.

## 6. Next step

Next step should advance safely.

During Voice recording:

- validate or end the recording if possible.

During Think:

- skip response waiting and continue only if safe.

During Read:

- stop Read aloud first.

During unknown state:

- do nothing.

## 7. Failure mode

The extension must prefer doing nothing rather than triggering a wrong click.

The worst bug to avoid is:

ChatGPT speaking while the microphone records ChatGPT speaking.

That creates an audio feedback workflow mess.

The state machine must prevent it.
