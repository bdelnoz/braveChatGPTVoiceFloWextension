/**
 * ============================================================================
 * PATH         : ./content-autosend.js
 * SCRIPT NAME  : content-autosend.js
 * AUTHOR       : Bruno DELNOZ
 * EMAIL        : bruno.delnoz@protonmail.com
 * TARGET USAGE : ChatGPT Web Voice-to-text / Text-to-voice flow helper
 * VERSION      : v11.3.0
 * DATE         : 2026-06-06 04:55
 * ============================================================================
 * CHANGELOG:
 *   v11.3.0 – 2026-06-06 04:55 – Bruno DELNOZ
 *       Changed:
 *       - Header dot/minimize now switches to a compact VF mini button instead of hiding the widget.
 *       - Added persistent widget minimized state.
 *       - Extension show/toggle restores the widget from mini state when useful.
 *   v11.2.0 – 2026-06-05 14:35 – Bruno DELNOZ
 *       Added:
 *       - Added Developer Mode Update Dev button.
 *       - Added Native Messaging update request from widget to background.
 *       - Reload Ext now asks background to refresh ChatGPT tabs after extension reload.
 *   v11.1.0 – 2026-06-05 13:20 – Bruno DELNOZ
 *       Fixed:
 *       - Developer Mode steps now use explicit No/Yes pair buttons.
 *       - OFF is strict in Developer Mode; missing step config means OFF.
 *       - Developer Mode starts enabled after upgrade.
 *       - T.O.S. remains the only legacy trigger visible in Developer Mode.
 *   v11.0.0 – 2026-06-05 12:15 – Bruno DELNOZ
 *       Added:
 *       - Added Developer Mode Reload Ext button.
 *       - Added reload request through background service worker.
 *   v10.2.0 – 2026-06-05 19:35 – Bruno DELNOZ
 *       Fixed:
 *       - Developer Mode no longer depends on legacy Send/Read/Start rows.
 *       - Developer step toggles now default OFF and are intended to be enabled explicitly.
 *       - State-only steps no longer expose misleading Test buttons.
 *       - T.O.S. is kept as the only dedicated trigger row in Developer Mode.
 *       - Entering Developer Mode disables old auto Send/Read/Loop toggles and bumps async epoch.
 *       Changed:
 *       - Developer Mode is compacted for smaller screens.
 *   v10.1.0 – 2026-06-05 18:35 – Bruno DELNOZ
 *       Fixed:
 *       - Fixed extension import failure by shortening the Manifest V3 description.
 *       Added:
 *       - Developer Mode step selector with Run Selected and Set State actions.
 *   v10.1.0 – 2026-06-05 18:10 – Bruno DELNOZ
 *       Added:
 *       - Developer Mode with four workflow blocks and nine conceptual steps.
 *       - Developer step rows with active bullets, per-step enable/disable and manual test buttons.
 *       - v10 workflow state bridge while preserving the v8.8 runtime base.
 *       - State-aware Stop button for Think, Read, voice recording and stale async jobs.
 *       Fixed:
 *       - Adds the v9.0 no-speech T.O.S. guard so silence alone cannot validate an empty transcription.
 *       - Keeps Start Transcription OFF as a hard no-restart gate.
 *   v1.0.0 – 2026-06-03 07:05 – Bruno DELNOZ
 *       Added:
 *       - Initial draggable Auto-send Yes/No widget.
 *       - Added stable composer text detection.
 *       - Added safe Send button click with duplicate-send guard.
 *   v1.1.0 – 2026-06-03 07:30 – Bruno DELNOZ
 *       Added:
 *       - Added second widget row: Read aloud Yes/No.
 *       - Added latest assistant response stabilization watcher.
 *       - Added safe click flow for visible Read Aloud buttons or overflow menu.
 *       - Added read deduplication to avoid replaying the same answer repeatedly.
 *   v1.2.0 – 2026-06-03 08:05 – Bruno DELNOZ
 *       Added:
 *       - Added third widget row: Loop Yes/No.
 *       - Added post-read-aloud loop flow that attempts to restart ChatGPT voice input.
 *       - Added read-aloud completion heuristics before microphone restart.
 *       - Added safe composer-area microphone/dictation button detection.
 *   v1.2.1 – 2026-06-03 14:55 – Bruno DELNOZ
 *       Fixed:
 *       - Tightened Loop microphone restart detection.
 *       - Excluded ChatGPT conversation / voice mode launch buttons.
 *       - Changed Loop fail-safe behavior to avoid clicking when the dictation microphone is ambiguous.
 *   v4.2.0 – 2026-06-03 15:11 – Bruno DELNOZ
 *       Added:
 *       - Added compact TOS row with 5 to 30 seconds setting.
 *       - Added real microphone audio level monitoring through getUserMedia.
 *       - Added silence-after-speech detection while ChatGPT voice-to-text confirmation is visible.
 *       - Added safe click flow for the ChatGPT transcription confirmation check button.
 *   v5.0.0 – 2026-06-03 16:05 – Bruno DELNOZ
 *       Added:
 *       - Added explicit TOS Yes/No toggle.
 *       - Added manual THR threshold from 0 to 100 for acceptable background noise.
 *       - Added practical RMS threshold mapping for headset/background-noise environments.
 *       - Added red extension icon package through manifest defaults.
 *   v5.1.0 – 2026-06-03 16:35 – Bruno DELNOZ
 *       Fixed:
 *       - Prevented widget clicks from bubbling into ChatGPT page handlers.
 *       - Added widget event shield for pointer, mouse, touch, click and keyboard events.
 *       - Replaced stale widget DOM when the injected runtime version changes.
 *   v5.2.0 – 2026-06-03 17:05 – Bruno DELNOZ
 *       Changed:
 *       - Changed TOS seconds range from 5–30 to 0–30 for live testing.
 *       - Added visible VOL meter showing the current microphone RMS level on the same 0–100 scale as THR.
 *       - Changed TOS silence logic to start timing whenever the transcription finish button is visible and mic level is below THR.
 *       - Kept THR manual; no auto-calibration added.
 *   v5.3.0 – 2026-06-03 17:32 – Bruno DELNOZ
 *       Fixed:
 *       - Replaced TOS audio logic with the proven Whisper widget RMS algorithm.
 *       - Changed analyser FFT size to 2048 and polling interval to 100 ms.
 *       - Changed microphone constraints to the previous working one-channel 16 kHz profile.
 *       - Mapped THR directly to RMS × 1000, so THR 10 equals the old 0.01 silence threshold.
 *       - Kept VOL visible and updated even when the transcription finish button is not detected.
 *   v5.4.0 – 2026-06-03 18:05 – Bruno DELNOZ
 *       Fixed:
 *       - Made TOS independent from Auto-send so silence finishing can be tested with Send OFF.
 *       - Fixed contradictory transcription finish-button filtering that rejected Stop/End dictation buttons.
 *       - Added safer fallback for small unlabeled check/finish buttons inside the composer.
 *       - Made TOS status report explicit when the finish button is missing.
 *   v5.5.0 – 2026-06-03 19:05 – Bruno DELNOZ
 *       Fixed:
 *       - Reworked TOS finish-control detection after live testing showed RMS/VOL was working but the V control was not clicked.
 *       - Added support for non-button [role=button] transcription finish controls.
 *       - Added lower-screen scan fallback so the voice-transcription validation control can be found outside the normal composer root.
 *       - Kept the old Whisper-widget RMS silence algorithm unchanged.
 *   v6.1.0 – 2026-06-03 19:35 – Bruno DELNOZ
 *       Fixed:
 *       - Added pending-user-turn guard before Auto Read and before Loop microphone restart.
 *       - Prevented stale Loop jobs from restarting voice input while ChatGPT is still thinking about a newer user message.
 *       - Revalidated the latest assistant message hash before Loop clicks the microphone.
 *       - Added an explicit page-generating guard immediately before Loop microphone restart.
 *   v6.2.0 – 2026-06-03 20:20 – Bruno DELNOZ
 *       Changed:
 *       - Renamed the widget title to VTT-TTV Flow.
 *       - Renamed Send to Send transcript.
 *       - Renamed Loop to Restart VTT to describe the real action.
 *       - Renamed TOS/Sec/THR/VOL display labels to T.O.S./sec/thr/vol for clearer final UI wording.
 *       - Updated user-facing status messages to remove obsolete Loop wording.
 *   v7.0.0 – 2026-06-03 20:10 – Bruno DELNOZ
 *       Added:
 *       - Added compact and expanded widget label modes.
 *       - Renamed the public widget title to a voice-to-text / text-to-voice flow wording.
 *       - Added short labels for compact use and long explanatory labels for readable mode.
 *       - Preserved the v6.1 guarded restart protections.

 *   v8.0.0 – 2026-06-03 20:45 – Bruno DELNOZ
 *       Added:
 *       - Added global Flow On/Off master switch above all actions.
 *       - Added Next step manual action button for skipping/advancing the current flow step.
 *       - Added visible step indicators for Send transcription, Read aloud and Start transcription.
 *       - Made hidden widget and Flow OFF act as runtime kill switches for automatic actions.
 *   v8.1.0 – 2026-06-03 21:20 – Bruno DELNOZ
 *       Fixed:
 *       - Stabilized the complete v8.0 widget without removing any feature.
 *       - Prevented internal widget clicks from hiding or disabling the widget unexpectedly.
 *       - Added widget self-healing after page-side DOM removal or accidental hidden state.
 *       - Forced a safe first-run migration: Flow OFF and all action toggles OFF after this upgrade.
 *   v8.2.0 – 2026-06-03 21:35 – Bruno DELNOZ
 *       Fixed:
 *       - Corrected visible step-state detection without removing v8.0/v8.1 features.
 *       - Transcription now shows as the active step while ChatGPT voice-to-text is open.
 *       - Read aloud now becomes the active step immediately after transcript send and while ChatGPT is thinking.
 *       - Send transcription is now only a short transition step instead of a stale long-running indicator.



 *   v8.8.0 – 2026-06-04 00:35 – Bruno DELNOZ
 *       Fixed:
 *       - Hardened Next Step during Read aloud: click the real Stop reading control first and never restart VTT until stop is confirmed.
 *       - Hardened Next Step during Think: click ChatGPT's Stop generating control before any VTT restart.
 *       - Blocked T.O.S. while ChatGPT is thinking or reading to avoid self-transcribing ChatGPT's own voice.
 *       - Added epoch checks inside read-wait jobs so stale loop jobs cannot restart transcription after toggles or Flow changed.
 *       - Kept Start Transcription OFF as a hard stop for automatic VTT restart.
 *       - Improved step-state priority so post-send cycles stay in Think/Read instead of falling back to VTT too early.
 *   v8.7.0 – 2026-06-03 23:20 – Bruno DELNOZ
 *       Fixed:
 *       - Split the post-send state into real Think and real Read phases.
 *       - Fixed Next step so Think skips do not try to stop Read aloud.
 *       - Fixed Next step so Read aloud must be confirmed stopped before VTT starts.
 *       - Added a stricter manual/automatic guard against ghost Start transcription during Think or Read.
 *       Changed:
 *       - Reworked step pills to Send, grouped Think/Read, and VTT with red dots after labels.
 *       - Updated widget labels to Title Case, Full Flow Activation / Full Flow Act., and tighter Mini/Maxi layout.
 *   v8.5.0 – 2026-06-03 22:55 – Bruno DELNOZ
 *       Changed:
 *       - Shortened the expanded widget title to ChatGPT Voice Flow.
 *       - Changed the label-mode control wording from Full to Maxi.
 *       - Added a visible v8.5 badge in the widget header.
 *       - Reduced Mini and Full widget width, spacing and step-indicator footprint without changing runtime logic.
 *   v8.4.0 – 2026-06-03 22:35 – Bruno DELNOZ
 *       Fixed:
 *       - Added hard response-cycle lock: after transcript send, no automatic Start transcription is allowed until the current assistant response has been clicked for Read aloud and the read cycle is completed.
 *       - Added assistant-after-user verification before Auto Read can target a message.
 *       - Reordered all choice controls to No / Yes, left to right.
 *       - Kept all v8 features while shrinking Mini mode layout and Next button footprint.
 *   v8.3.1 – 2026-06-03 22:05 – Bruno DELNOZ
 *       Fixed:
 *       - Fixed package metadata mismatch: manifest/background/style now expose v8.3.1.
 *   v8.3.0 – 2026-06-03 21:55 – Bruno DELNOZ
 *       Fixed:
 *       - Added hard anti-ghost-start guards to prevent Start transcription from firing during ChatGPT thinking or Read aloud states.
 *       - Added automation epoch invalidation so stale asynchronous restart jobs cannot click the microphone after toggles changed.
 *       - Added pending-answer guard so older assistant answers cannot trigger Read aloud or Start transcription while a newer user message is being processed.
 *       - Bound auto restart to the exact assistant answer that was actually read aloud.
 * ============================================================================
 */

(function initChatGPTAutoSendAndReadAloud() {
    'use strict';

    if (window.__CGAS_AUTOSEND_LOADED__) {
        return;
    }

    window.__CGAS_AUTOSEND_LOADED__ = true;

    const VERSION = '11.3.0';
    const SUPPORTED_ORIGIN_RE = /^https:\/\/(chatgpt\.com|chat\.openai\.com)\//;

    const STORAGE_KEYS = Object.freeze({
        autoSend: 'cgas.autoSend.enabled',
        autoRead: 'cgas.autoRead.enabled',
        autoLoop: 'cgas.autoLoop.enabled',
        widgetVisible: 'cgas.widget.visible',
        widgetMinimized: 'cgas.widget.minimized',
        widgetLeft: 'cgas.widget.left',
        widgetTop: 'cgas.widget.top',
        flowEnabled: 'cgas.flow.enabled',
        labelsExpanded: 'cgas.widget.labelsExpanded',
        tosEnabled: 'cgas.tos.enabled',
        tosSeconds: 'cgas.tos.seconds',
        tosThreshold: 'cgas.tos.threshold',
        runtimeVersion: 'cgas.runtime.version',
        developerMode: 'cgas.developer.enabled',
        developerStepEnabled: 'cgas.developer.stepEnabled',
        developerSelectedStep: 'cgas.developer.selectedStep'
    });

    const CONFIG = Object.freeze({
        monitorMs: 320,
        readMonitorMs: 760,
        loopMonitorMs: 900,
        composerStableMs: 950,
        assistantStableMs: 2300,
        sendCooldownMs: 2600,
        readCooldownMs: 5500,
        loopMicCooldownMs: 4500,
        minComposerLength: 1,
        minAssistantLength: 2,
        menuWaitMs: 360,
        revealWaitMs: 180,
        loopMinReadWaitMs: 6000,
        loopMaxReadWaitMs: 180000,
        loopReadActiveStableOffMs: 3500,
        loopPostReadSafetyMs: 3000,
        statusClearMs: 4200,
        tosMonitorMs: 100,
        tosMinSeconds: 0,
        tosMaxSeconds: 30,
        tosDefaultSeconds: 10,
        tosMinThreshold: 0,
        tosMaxThreshold: 100,
        tosDefaultThreshold: 10,
        tosFinishCooldownMs: 5200,
        tosNoButtonResetMs: 1800,
        pendingAnswerGuardMs: 180000,
        minMicStartAfterReadClickMs: 6500,
        manualNextDelayMs: 900
    });


    const WORKFLOW_STEPS = Object.freeze([
        {
            id: 'voice_record_start',
            number: 1,
            block: 'Voice recording',
            type: 'action',
            shortLabel: 'Start Rec.',
            label: 'Start voice recording for transcription',
            description: 'Click the ChatGPT voice input control to start recording audio for later transcription.'
        },
        {
            id: 'voice_recording',
            number: 2,
            block: 'Voice recording',
            type: 'state',
            shortLabel: 'Recording',
            label: 'Voice recording in progress',
            description: 'ChatGPT voice-to-text is open and the user is speaking or silence is being monitored.'
        },
        {
            id: 'transcription_request',
            number: 3,
            block: 'Voice recording',
            type: 'trigger/action',
            shortLabel: 'Req. Text',
            label: 'Request recorded voice-to-text transcription',
            description: 'Click the transcription validation control after T.O.S. or manual Next.'
        },
        {
            id: 'transcript_write',
            number: 4,
            block: 'Transcript / message',
            type: 'state',
            shortLabel: 'Text UI',
            label: 'Write transcribed text to interface',
            description: 'The transcribed text is present in the composer.'
        },
        {
            id: 'send_to_chatgpt',
            number: 5,
            block: 'Transcript / message',
            type: 'action',
            shortLabel: 'Send',
            label: 'Send transcribed text to ChatGPT',
            description: 'Click the ChatGPT send button for the transcribed text.'
        },
        {
            id: 'thinking',
            number: 6,
            block: 'ChatGPT response',
            type: 'state',
            shortLabel: 'Think',
            label: 'ChatGPT in thinking mode',
            description: 'ChatGPT is generating or the new answer is not ready for reading.'
        },
        {
            id: 'writing',
            number: 7,
            block: 'ChatGPT response',
            type: 'state',
            shortLabel: 'Writing',
            label: 'ChatGPT in writing mode',
            description: 'ChatGPT is streaming text on screen.'
        },
        {
            id: 'read_aloud',
            number: 8,
            block: 'ChatGPT response',
            type: 'state/action',
            shortLabel: 'Read',
            label: 'ChatGPT in read aloud mode',
            description: 'Read aloud is active or the extension is starting/stopping it.'
        },
        {
            id: 'loop_restart',
            number: 9,
            block: 'Loop / restart',
            type: 'trigger/action',
            shortLabel: 'Loop',
            label: 'Loop back to step 1',
            description: 'After a completed read cycle, restart voice recording if Start Transcription is enabled.'
        }
    ]);

    const WORKFLOW_STEP_IDS = Object.freeze(WORKFLOW_STEPS.map((step) => step.id));
    const DEVELOPER_ACTION_STEPS = Object.freeze([
        'voice_record_start',
        'transcription_request',
        'send_to_chatgpt',
        'read_aloud',
        'loop_restart'
    ]);

    function developerStepIsAction(stepId) {
        return DEVELOPER_ACTION_STEPS.includes(stepId);
    }


    const LEGACY_TO_WORKFLOW_STEP = Object.freeze({
        idle: 'idle',
        transcript: 'voice_recording',
        send: 'send_to_chatgpt',
        think: 'thinking',
        read: 'read_aloud'
    });

    const WORKFLOW_TO_LEGACY_STEP = Object.freeze({
        idle: 'idle',
        voice_record_start: 'transcript',
        voice_recording: 'transcript',
        transcription_request: 'send',
        transcript_write: 'send',
        send_to_chatgpt: 'send',
        thinking: 'think',
        writing: 'think',
        read_aloud: 'read',
        loop_restart: 'transcript'
    });

    function defaultDeveloperStepEnabled() {
        const defaults = {};
        for (const step of WORKFLOW_STEPS) {
            defaults[step.id] = false;
        }
        return defaults;
    }

    const READ_LABEL_RE = /\bread aloud\b|\bread response\b|\blisten\b|lire\s+(à|a)\s+voix\s+haute|lire\s+la\s+r[eé]ponse|lecture\s+audio|écouter|ecouter/i;
    const READ_ACTIVE_LABEL_RE = /stop\s+reading|pause\s+reading|stop\s+audio|pause\s+audio|arr[eê]ter\s+(la\s+)?lecture|mettre.*pause|pause|reprendre\s+la\s+lecture/i;
    const READ_STOP_LABEL_RE = /stop\s+reading|stop\s+audio|stop\s+read|arr[eê]ter\s+(la\s+)?lecture|arr[eê]ter\s+(l['’])?audio|\bstop\b/i;
    const READ_STOP_BAD_LABEL_RE = /stop\s+generating|stop\s+streaming|dictation|recording|transcription|micro|mic|close|dismiss|fermer|menu|more|plus|envoyer|send/i;
    const GENERATING_STOP_LABEL_RE = /stop\s+generating|stop\s+streaming|arr[eê]ter\s+(la\s+)?g[eé]n[eé]ration|interrompre|\bstop\b/i;
    const GENERATING_STOP_BAD_LABEL_RE = /dictation|recording|transcription|micro|mic|read\s+aloud|lecture|audio|close|dismiss|fermer|menu|more|plus|envoyer|send/i;
    const MIC_LABEL_RE = /dictate|dictation|start\s+dictation|microphone|\bmic\b|dicter|dictée|dictee|micro|saisie\s+vocale|entrée\s+vocale|transcription\s+vocale/i;
    const BAD_MIC_LABEL_RE = /send|envoyer|submit|attach|upload|file|image|search|tool|reason|model|read\s+aloud|lire|stop\s+generating|stop\s+reading|pause|resume|cancel|annuler|voice\s*mode|conversation|conversationnel|advanced\s+voice|live\s+voice|start\s+voice|open\s+voice|audio\s+mode|call|appel/i;
    const MORE_LABEL_RE = /\bmore\b|more actions|options|menu|actions|ouvrir.*menu|plus|autres|\.\.\.|…/i;
    const SEND_LABEL_RE = /\bsend\b|envoyer|submit/i;
    const BAD_SEND_LABEL_RE = /stop|arr[eê]ter|cancel|annuler|voice|dictation|micro|audio|upload|attach|tool|search|reason|model/i;
    const GENERATING_LABEL_RE = /stop generating|stop streaming|arr[eê]ter|interrompre|continuer|continue generating/i;
    const TRANSCRIPTION_FINISH_LABEL_RE = /done|finish|finished|complete|confirm|accept|check|submit\s+dictation|end\s+dictation|stop\s+dictation|stop\s+recording|valider|terminer|confirmer|accepter|finir|arr[eê]ter\s+(la\s+)?dict[eé]e|arr[eê]ter\s+(l['’]?)enregistrement/i;
    const TRANSCRIPTION_BAD_FINISH_LABEL_RE = /cancel|close|dismiss|delete|remove|clear|send|envoyer|submit\s+message|attach|upload|file|image|search|tool|reason|model|read\s+aloud|lire|voice\s*mode|conversation|conversationnel|advanced\s+voice|live\s+voice|start\s+voice|open\s+voice|audio\s+mode|call|appel/i;

    let state = {
        flowEnabled: false,
        autoSend: false,
        autoRead: false,
        autoLoop: false,
        tosEnabled: false,
        tosSeconds: 10,
        tosThreshold: 35,
        widgetVisible: true,
        widgetMinimized: false,
        labelsExpanded: false,
        developerMode: false,
        developerStepEnabled: defaultDeveloperStepEnabled(),
        developerSelectedStep: 'voice_record_start',
        widgetLeft: null,
        widgetTop: null
    };

    let lastComposerText = '';
    let composerStableSince = 0;
    let lastSentHash = '';
    let lastSendAt = 0;

    let lastAssistantHashSeen = '';
    let assistantStableSince = 0;
    let lastReadHash = '';
    let lastReadAt = 0;
    let readRunning = false;
    let loopRunning = false;
    let lastLoopHash = '';
    let lastMicClickAt = 0;
    let automationEpoch = 0;
    let assistantHashAtLastSend = '';
    let lastReadStartedHash = '';
    let responseCycleOpen = false;
    let responseCycleHash = '';
    let lastReadCompletedHash = '';
    let readGuardUntil = 0;
    let manualNextInProgress = false;

    let audioStream = null;
    let audioContext = null;
    let audioAnalyser = null;
    let audioData = null;
    let audioPermissionFailed = false;
    let tosVoiceSeen = false;
    let tosSilenceSince = 0;
    let tosLastFinishClickAt = 0;
    let tosLastButtonSeenAt = 0;
    let tosStartInProgress = false;
    let tosLastRms = 0;
    let tosLastLevel = 0;

    let widget = null;
    let statusTimer = null;
    let currentStep = 'idle';
    let workflowStep = 'idle';

    function sleep(ms) {
        return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    function now() {
        return Date.now();
    }

    function normalizeSpace(value) {
        return String(value || '')
            .replace(/\u00a0/g, ' ')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n[ \t]+/g, '\n')
            .replace(/[ \t]{2,}/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    function hashText(value) {
        const text = String(value || '');
        let hash = 2166136261;

        for (let i = 0; i < text.length; i += 1) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }

        return (hash >>> 0).toString(16).padStart(8, '0') + ':' + text.length;
    }

    function isSupportedUrl() {
        return SUPPORTED_ORIGIN_RE.test(window.location.href);
    }



    function flowIsActive() {
        return Boolean(state.flowEnabled && state.widgetVisible);
    }

    function bumpAutomationEpoch(reason) {
        automationEpoch += 1;
        loopRunning = false;
        readRunning = false;
        readGuardUntil = 0;
        if (reason) {
            console.log('[CGAS] automation epoch bumped:', automationEpoch, reason);
        }
    }

    function noteSendCycleStart() {
        const latest = getLatestAssistantMessage();
        assistantHashAtLastSend = latest && latest.text ? hashText(latest.text) : '';
        lastReadStartedHash = '';
        responseCycleOpen = true;
        responseCycleHash = '';
        lastReadCompletedHash = '';
        bumpAutomationEpoch('send-cycle-start');
        setCurrentStep('think');
    }

    function answerStillPendingAfterSend() {
        if (!lastSendAt) {
            return false;
        }

        if (pageLooksGenerating()) {
            return true;
        }

        const latest = getLatestAssistantMessage();
        if (!latest || !latest.text) {
            return now() - lastSendAt < CONFIG.pendingAnswerGuardMs;
        }

        if (latestUserIsAfterAssistant(latest)) {
            return true;
        }

        const latestHash = hashText(latest.text);
        if (assistantHashAtLastSend && latestHash === assistantHashAtLastSend && now() - lastSendAt < CONFIG.pendingAnswerGuardMs) {
            return true;
        }

        return false;
    }

    function autoStartTranscriptionAllowed(expectedHash, expectedEpoch) {
        if (!flowIsActive()) {
            setStatus('Start locked: Flow OFF');
            return false;
        }
        if (!state.autoLoop) {
            setStatus('Start transcription OFF');
            return false;
        }
        if (typeof expectedEpoch === 'number' && expectedEpoch !== automationEpoch) {
            setStatus('Start locked: stale job');
            return false;
        }
        if (responseCycleOpen && (!expectedHash || lastReadCompletedHash !== expectedHash)) {
            setStatus('Start locked: waiting read');
            return false;
        }
        if (expectedHash && lastReadCompletedHash !== expectedHash) {
            setStatus('Start locked: read not completed');
            return false;
        }
        if (answerStillPendingAfterSend()) {
            setStatus('Start locked: waiting answer');
            return false;
        }
        if (pageLooksGenerating()) {
            setStatus('Start locked: thinking');
            return false;
        }
        if (pageLooksReadingAloud() || readGuardActive()) {
            setStatus('Start locked: still reading');
            return false;
        }
        if (expectedHash && lastReadStartedHash && expectedHash !== lastReadStartedHash) {
            setStatus('Start locked: unread answer');
            return false;
        }
        if (expectedHash && !latestAssistantHashMatches(expectedHash)) {
            setStatus('Start locked: stale answer');
            return false;
        }
        if (now() - lastReadAt < CONFIG.minMicStartAfterReadClickMs) {
            setStatus('Start locked: read cooldown');
            return false;
        }
        return true;
    }


    function readGuardActive() {
        return Boolean(readGuardUntil && now() < readGuardUntil);
    }

    function markReadStarted(hashValue, textValue) {
        const safeHash = hashValue || '';
        lastReadHash = safeHash;
        lastReadStartedHash = safeHash;
        responseCycleHash = safeHash;
        lastReadCompletedHash = '';
        lastReadAt = now();
        readGuardUntil = Math.max(readGuardUntil, now() + estimateReadMs(textValue || ''));
        setCurrentStep('read');
    }

    function markReadCompleted(hashValue) {
        lastReadCompletedHash = hashValue || lastReadStartedHash || lastReadHash || '';
        responseCycleOpen = false;
        readGuardUntil = 0;
    }


    function workflowStepFromLegacy(step) {
        return LEGACY_TO_WORKFLOW_STEP[step] || 'idle';
    }

    function legacyStepFromWorkflow(step) {
        return WORKFLOW_TO_LEGACY_STEP[step] || 'idle';
    }

    function setCurrentStep(step) {
        currentStep = step || 'idle';
        workflowStep = workflowStepFromLegacy(currentStep);
        updateStepIndicator();
    }

    function setWorkflowStep(step) {
        workflowStep = WORKFLOW_STEP_IDS.includes(step) ? step : 'idle';
        currentStep = legacyStepFromWorkflow(workflowStep);
        updateStepIndicator();
    }

    function currentWorkflowStepFromPage() {
        const legacyStep = inferCurrentStepFromPage();

        if (legacyStep === 'transcript') {
            return findTranscriptionFinishButton() ? 'voice_recording' : 'voice_record_start';
        }

        if (legacyStep === 'send') {
            return getComposerText() ? 'transcript_write' : 'transcription_request';
        }

        if (legacyStep === 'think') {
            return pageLooksGenerating() ? 'writing' : 'thinking';
        }

        if (legacyStep === 'read') {
            return 'read_aloud';
        }

        return 'idle';
    }

    function updateDeveloperPanelState() {
        const stateText = document.getElementById('cgas-dev-current-state');
        if (stateText) {
            stateText.textContent = workflowStep === 'idle' ? 'Idle' : workflowStep;
        }

        const selector = document.getElementById('cgas-dev-step-selector');
        if (selector && WORKFLOW_STEP_IDS.includes(workflowStep)) {
            selector.value = workflowStep;
        }

        for (const step of WORKFLOW_STEPS) {
            const dot = document.getElementById('cgas-dev-dot-' + step.number);
            if (dot) {
                dot.classList.toggle('cgas-step-active', workflowStep === step.id);
                dot.classList.toggle('cgas-dev-disabled-dot', state.developerStepEnabled && state.developerStepEnabled[step.id] === false);
            }

            const offButton = document.getElementById('cgas-dev-off-' + step.number);
            const onButton = document.getElementById('cgas-dev-on-' + step.number);
            const enabled = developerStepEnabled(step.id);
            if (offButton) {
                offButton.classList.toggle('cgas-active-no', !enabled);
                offButton.classList.toggle('cgas-active-yes', false);
            }
            if (onButton) {
                onButton.classList.toggle('cgas-active-yes', enabled);
                onButton.classList.toggle('cgas-active-no', false);
            }
        }
    }





    function updateStepIndicator() {
        const activeMap = {
            'cgas-step-send': currentStep === 'send',
            'cgas-step-think': currentStep === 'think',
            'cgas-step-read': currentStep === 'read',
            'cgas-step-transcript': currentStep === 'transcript'
        };

        for (const [id, active] of Object.entries(activeMap)) {
            const dot = document.getElementById(id);
            if (dot) {
                dot.classList.toggle('cgas-step-active', Boolean(active));
            }
        }
    }

    function inferCurrentStepFromPage() {
        if (!flowIsActive()) {
            return 'idle';
        }

        /*
         * v8.7: real phases are now separated:
         *   Send  = transcript validation/send transition
         *   Think = ChatGPT is generating or the new answer is not ready/read yet
         *   Read  = Read aloud is actually active or locked by its conservative guard
         *   VTT   = ChatGPT voice-to-text is open
         */
        if (pageLooksReadingAloud() || (readGuardActive() && (currentStep === 'read' || lastReadStartedHash))) {
            return 'read';
        }

        if (pageLooksGenerating()) {
            return 'think';
        }

        if (responseCycleOpen && lastSendAt && !lastReadCompletedHash && !lastReadStartedHash) {
            return 'think';
        }

        if (findTranscriptionFinishButton()) {
            return 'transcript';
        }

        const latestAssistant = getLatestAssistantMessage();
        if (latestAssistant && latestUserIsAfterAssistant(latestAssistant)) {
            return 'think';
        }

        if (responseCycleOpen && !lastReadStartedHash && lastSendAt && answerStillPendingAfterSend()) {
            return 'think';
        }

        const composerText = getComposerText();
        if (composerText && findSendButton()) {
            return 'send';
        }

        if (currentStep === 'send' && now() - lastSendAt < 1600) {
            return 'send';
        }

        if (currentStep === 'think' && responseCycleOpen && !lastReadStartedHash) {
            return 'think';
        }

        if (currentStep === 'read' && (readGuardActive() || now() - lastReadAt < CONFIG.readCooldownMs)) {
            return 'read';
        }

        return 'idle';
    }


    function refreshCurrentStepFromPage() {
        const inferred = inferCurrentStepFromPage();
        const inferredWorkflow = currentWorkflowStepFromPage();

        if (inferred !== currentStep || inferredWorkflow !== workflowStep) {
            currentStep = inferred;
            workflowStep = inferredWorkflow;
            updateStepIndicator();
        } else {
            updateStepIndicator();
        }
    }


    function chromeStorageGet(keys) {
        return new Promise((resolve) => {
            try {
                if (chrome && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.get(keys, (result) => resolve(result || {}));
                    return;
                }
            } catch (error) {
                console.log('[CGAS] chrome.storage.get unavailable:', error.message);
            }

            const fallback = {};
            for (const key of keys) {
                const value = window.localStorage.getItem(key);
                if (value !== null) {
                    fallback[key] = value;
                }
            }
            resolve(fallback);
        });
    }

    function chromeStorageSet(values) {
        try {
            if (chrome && chrome.storage && chrome.storage.local) {
                chrome.storage.local.set(values);
                return;
            }
        } catch (error) {
            console.log('[CGAS] chrome.storage.set unavailable:', error.message);
        }

        for (const [key, value] of Object.entries(values)) {
            window.localStorage.setItem(key, String(value));
        }
    }

    function boolFromStored(value, fallback) {
        if (typeof value === 'boolean') {
            return value;
        }
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        return fallback;
    }

    function clampTosSeconds(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return CONFIG.tosDefaultSeconds;
        }
        return Math.min(CONFIG.tosMaxSeconds, Math.max(CONFIG.tosMinSeconds, Math.round(numeric)));
    }

    function clampTosThreshold(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return CONFIG.tosDefaultThreshold;
        }
        return Math.min(CONFIG.tosMaxThreshold, Math.max(CONFIG.tosMinThreshold, Math.round(numeric)));
    }

    function tosLevelFromRms(rms) {
        const numeric = Number(rms);
        if (!Number.isFinite(numeric) || numeric <= 0) {
            return 0;
        }
        return Math.min(100, Math.max(0, Math.round(numeric * 1000)));
    }

    function tosEffectiveLevelThreshold() {
        return clampTosThreshold(state.tosThreshold);
    }

    function tosEffectiveRmsThreshold() {
        return clampTosThreshold(state.tosThreshold) / 1000;
    }

    async function loadState() {
        const stored = await chromeStorageGet(Object.values(STORAGE_KEYS));

        const storedRuntimeVersion = String(stored[STORAGE_KEYS.runtimeVersion] || '');
        const firstRunForThisRuntime = storedRuntimeVersion !== VERSION;

        /*
         * v8.1 safety migration:
         * after a runtime upgrade, always boot with the global Flow switch OFF
         * and with every automatic action OFF. The user can re-enable rows
         * deliberately after verifying the loaded version.
         */
        state.flowEnabled = firstRunForThisRuntime ? false : boolFromStored(stored[STORAGE_KEYS.flowEnabled], false);
        state.autoSend = firstRunForThisRuntime ? false : boolFromStored(stored[STORAGE_KEYS.autoSend], false);
        state.autoRead = firstRunForThisRuntime ? false : boolFromStored(stored[STORAGE_KEYS.autoRead], false);
        state.autoLoop = firstRunForThisRuntime ? false : boolFromStored(stored[STORAGE_KEYS.autoLoop], false);
        state.tosEnabled = firstRunForThisRuntime ? false : boolFromStored(stored[STORAGE_KEYS.tosEnabled], false);
        const storedTos = Number(stored[STORAGE_KEYS.tosSeconds]);
        state.tosSeconds = clampTosSeconds(Number.isFinite(storedTos) ? storedTos : CONFIG.tosDefaultSeconds);
        const storedThreshold = Number(stored[STORAGE_KEYS.tosThreshold]);
        state.tosThreshold = clampTosThreshold(Number.isFinite(storedThreshold) ? storedThreshold : CONFIG.tosDefaultThreshold);
        state.widgetVisible = boolFromStored(stored[STORAGE_KEYS.widgetVisible], true);
        state.widgetMinimized = firstRunForThisRuntime ? false : boolFromStored(stored[STORAGE_KEYS.widgetMinimized], false);
        state.labelsExpanded = boolFromStored(stored[STORAGE_KEYS.labelsExpanded], false);
        state.developerMode = firstRunForThisRuntime ? true : boolFromStored(stored[STORAGE_KEYS.developerMode], false);
        state.developerSelectedStep = WORKFLOW_STEP_IDS.includes(stored[STORAGE_KEYS.developerSelectedStep]) ? stored[STORAGE_KEYS.developerSelectedStep] : 'voice_record_start';
        try {
            state.developerStepEnabled = Object.assign(
                defaultDeveloperStepEnabled(),
                JSON.parse(stored[STORAGE_KEYS.developerStepEnabled] || '{}')
            );
        } catch (error) {
            state.developerStepEnabled = defaultDeveloperStepEnabled();
        }

        const left = Number(stored[STORAGE_KEYS.widgetLeft]);
        const top = Number(stored[STORAGE_KEYS.widgetTop]);
        state.widgetLeft = Number.isFinite(left) ? left : null;
        state.widgetTop = Number.isFinite(top) ? top : null;

        if (firstRunForThisRuntime) {
            chromeStorageSet({
                [STORAGE_KEYS.runtimeVersion]: VERSION,
                [STORAGE_KEYS.widgetMinimized]: false,
                [STORAGE_KEYS.flowEnabled]: false,
                [STORAGE_KEYS.autoSend]: false,
                [STORAGE_KEYS.autoRead]: false,
                [STORAGE_KEYS.autoLoop]: false,
                [STORAGE_KEYS.tosEnabled]: false,
                [STORAGE_KEYS.developerMode]: true,
                [STORAGE_KEYS.developerStepEnabled]: JSON.stringify(defaultDeveloperStepEnabled()),
                [STORAGE_KEYS.developerSelectedStep]: 'voice_record_start'
            });
        }
        if (state.developerMode) {
            state.autoSend = false;
            state.autoRead = false;
            state.autoLoop = false;
        }
    }

    function saveStatePatch(patch) {
        const values = {};
        if (Object.prototype.hasOwnProperty.call(patch, 'flowEnabled')) {
            values[STORAGE_KEYS.flowEnabled] = Boolean(patch.flowEnabled);
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'autoSend')) {
            values[STORAGE_KEYS.autoSend] = Boolean(patch.autoSend);
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'autoRead')) {
            values[STORAGE_KEYS.autoRead] = Boolean(patch.autoRead);
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'autoLoop')) {
            values[STORAGE_KEYS.autoLoop] = Boolean(patch.autoLoop);
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'tosEnabled')) {
            values[STORAGE_KEYS.tosEnabled] = Boolean(patch.tosEnabled);
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'tosSeconds')) {
            values[STORAGE_KEYS.tosSeconds] = String(clampTosSeconds(patch.tosSeconds));
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'tosThreshold')) {
            values[STORAGE_KEYS.tosThreshold] = String(clampTosThreshold(patch.tosThreshold));
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'developerMode')) {
            values[STORAGE_KEYS.developerMode] = Boolean(patch.developerMode);
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'developerStepEnabled')) {
            values[STORAGE_KEYS.developerStepEnabled] = JSON.stringify(patch.developerStepEnabled || defaultDeveloperStepEnabled());
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'developerSelectedStep')) {
            values[STORAGE_KEYS.developerSelectedStep] = WORKFLOW_STEP_IDS.includes(patch.developerSelectedStep) ? patch.developerSelectedStep : 'voice_record_start';
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'widgetVisible')) {
            values[STORAGE_KEYS.widgetVisible] = Boolean(patch.widgetVisible);
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'widgetMinimized')) {
            values[STORAGE_KEYS.widgetMinimized] = Boolean(patch.widgetMinimized);
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'labelsExpanded')) {
            values[STORAGE_KEYS.labelsExpanded] = Boolean(patch.labelsExpanded);
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'widgetLeft')) {
            values[STORAGE_KEYS.widgetLeft] = String(Math.max(0, Math.round(Number(patch.widgetLeft) || 0)));
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'widgetTop')) {
            values[STORAGE_KEYS.widgetTop] = String(Math.max(0, Math.round(Number(patch.widgetTop) || 0)));
        }
        chromeStorageSet(values);
    }

    function setStatus(text, sticky) {
        const el = document.getElementById('cgas-status');
        if (!el) {
            return;
        }

        el.textContent = text || '';

        if (statusTimer) {
            window.clearTimeout(statusTimer);
            statusTimer = null;
        }

        if (!sticky && text) {
            statusTimer = window.setTimeout(() => {
                const current = document.getElementById('cgas-status');
                if (current) {
                    current.textContent = flowIsActive() && (state.autoSend || state.autoRead || state.autoLoop || state.tosEnabled) ? 'Watching…' : (state.flowEnabled ? 'Idle' : 'Flow OFF');
                }
            }, CONFIG.statusClearMs);
        }
    }

    function createButton(text, className, onClick) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = text;
        button.className = className;
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (typeof event.stopImmediatePropagation === 'function') {
                event.stopImmediatePropagation();
            }
            onClick();
        });
        return button;
    }

    function createLabel(labelId, shortText, longText, titleText) {
        const label = document.createElement('div');
        label.id = labelId;
        label.className = 'cgas-label cgas-dynamic-label';
        label.dataset.shortText = shortText;
        label.dataset.longText = longText || shortText;
        label.textContent = shortText;
        if (titleText) {
            label.title = titleText;
        }
        return label;
    }

    function createRow(labelId, shortText, longText, yesId, noId, yesHandler, noHandler, titleText) {
        const row = document.createElement('div');
        row.className = 'cgas-row';

        row.appendChild(createLabel(labelId, shortText, longText, titleText));

        const no = createButton('No', 'cgas-choice', noHandler);
        no.id = noId;
        row.appendChild(no);

        const yes = createButton('Yes', 'cgas-choice', yesHandler);
        yes.id = yesId;
        row.appendChild(yes);

        return row;
    }

    function createStepRow(labelId, shortText, longText, valueId, minusId, plusId, minusHandler, plusHandler, titleText) {
        const row = document.createElement('div');
        row.className = 'cgas-step-row';

        row.appendChild(createLabel(labelId, shortText, longText, titleText));

        const minus = createButton('−', 'cgas-step', minusHandler);
        minus.id = minusId;
        row.appendChild(minus);

        const value = document.createElement('div');
        value.id = valueId;
        value.className = 'cgas-step-value';
        row.appendChild(value);

        const plus = createButton('+', 'cgas-step', plusHandler);
        plus.id = plusId;
        row.appendChild(plus);

        return row;
    }

    function createTosSecondsRow() {
        return createStepRow(
            'cgas-label-sec',
            'Sec',
            'Silence Seconds',
            'cgas-tos-value',
            'cgas-tos-minus',
            'cgas-tos-plus',
            () => setTosSeconds(state.tosSeconds - 1),
            () => setTosSeconds(state.tosSeconds + 1),
            'Time of silence before clicking the transcription validation check button.'
        );
    }

    function createThresholdRow() {
        return createStepRow(
            'cgas-label-thr',
            'Thr',
            'Volume Threshold',
            'cgas-thr-value',
            'cgas-thr-minus',
            'cgas-thr-plus',
            () => setTosThreshold(state.tosThreshold - 5),
            () => setTosThreshold(state.tosThreshold + 5),
            'Manual threshold for acceptable background noise. Higher is more tolerant.'
        );
    }

    function setupWidgetEventShield(target) {
        if (!target || target.__CGAS_EVENT_SHIELD__) {
            return;
        }

        target.__CGAS_EVENT_SHIELD__ = true;

        const stopOnlyEvents = [
            'pointerdown',
            'pointerup',
            'pointercancel',
            'mousedown',
            'mouseup',
            'click',
            'dblclick',
            'touchstart',
            'touchend',
            'keydown',
            'keyup'
        ];

        for (const eventName of stopOnlyEvents) {
            target.addEventListener(eventName, (event) => {
                event.stopPropagation();
                if (typeof event.stopImmediatePropagation === 'function') {
                    event.stopImmediatePropagation();
                }
            }, false);
        }
    }

    function forceWidgetVisibleIfNeeded() {
        if (!state.widgetVisible || !widget) {
            return;
        }

        if (!document.documentElement.contains(widget)) {
            document.documentElement.appendChild(widget);
        }

        widget.classList.remove('cgas-hidden');
        widget.removeAttribute('hidden');
        widget.style.display = 'block';
        widget.style.visibility = 'visible';
        widget.style.opacity = '1';
        widget.style.pointerEvents = 'auto';
    }

    function setupWidgetSelfHeal() {
        const observer = new MutationObserver(() => {
            if (!state.widgetVisible) {
                return;
            }
            window.setTimeout(forceWidgetVisibleIfNeeded, 0);
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'hidden']
        });

        window.setInterval(forceWidgetVisibleIfNeeded, 1000);
    }





    function setWidgetMinimized(nextMinimized) {
        state.widgetVisible = true;
        state.widgetMinimized = Boolean(nextMinimized);
        saveStatePatch({
            widgetVisible: true,
            widgetMinimized: state.widgetMinimized
        });
        updateWidget();
    }

    function createMiniRestoreButton() {
        const button = createButton('VF', 'cgas-mini-restore-button', () => {
            setWidgetMinimized(false);
        });
        button.id = 'cgas-mini-restore';
        button.title = 'Restore ChatGPT Voice Flow widget.';
        return button;
    }


    function createDeveloperModeToggle() {
        const button = createButton('Dev', 'cgas-header-button', () => {
            setDeveloperMode(!state.developerMode);
        });
        button.id = 'cgas-dev-mode-toggle';
        button.title = 'Show or hide Developer Mode with detailed workflow blocks, states, actions and triggers.';
        return button;
    }


    function createReloadExtensionButton() {
        const button = createButton('Reload Ext', 'cgas-header-button cgas-reload-extension-button', async () => {
            setStatus('Reloading extension…', true);
            try {
                chrome.runtime.sendMessage({ type: 'CGAS_RELOAD_EXTENSION' }, () => {
                    const error = chrome.runtime.lastError;
                    if (error) {
                        console.log('[CGAS] reload request error:', error.message);
                    }
                });
            } catch (error) {
                setStatus('Reload failed: ' + error.message, true);
            }
        });
        button.id = 'cgas-reload-extension';
        button.title = 'Reload the unpacked extension after files were updated locally, then refresh open ChatGPT tabs automatically.';
        return button;
    }


    function createUpdateDevButton() {
        const button = createButton('Update', 'cgas-header-button cgas-update-dev-button', async () => {
            setStatus('Update Dev: native host…', true);
            try {
                chrome.runtime.sendMessage({ type: 'CGAS_UPDATE_DEV_VERSION' }, (response) => {
                    const error = chrome.runtime.lastError;
                    if (error) {
                        setStatus('Update failed: ' + error.message, true);
                        return;
                    }

                    if (!response || response.ok !== true) {
                        const detail = response && response.error ? response.error : 'no OK response';
                        setStatus('Update failed: ' + detail, true);
                        return;
                    }

                    const hostResponse = response.response || {};
                    const version = hostResponse.version ? ' v' + hostResponse.version : '';
                    setStatus('Updated' + version + '. Reloading…', true);
                });
            } catch (error) {
                setStatus('Update failed: ' + error.message, true);
            }
        });
        button.id = 'cgas-update-dev';
        button.title = 'Run local update-dev-version.sh --latest through the Native Messaging developer host, then reload extension and ChatGPT tab.';
        return button;
    }


    function createStopStepRow() {
        const row = document.createElement('div');
        row.id = 'cgas-stop-row';

        const nextButton = createButton('Next Step', 'cgas-next-button', () => {
            goToNextStep();
        });
        nextButton.id = 'cgas-next-step';
        nextButton.title = 'Manual state-aware flow advance.';
        row.appendChild(nextButton);

        const stopButton = createButton('Stop', 'cgas-stop-button', () => {
            stopCurrentFlow('Manual Stop');
        });
        stopButton.id = 'cgas-stop-step';
        stopButton.title = 'State-aware stop for Read aloud, Think/generation, T.O.S. and stale async jobs.';
        row.appendChild(stopButton);

        return row;
    }

    function createDeveloperStepRow(step) {
        const row = document.createElement('div');
        row.className = 'cgas-dev-step-row';
        row.id = 'cgas-dev-step-row-' + step.number;

        const bullet = document.createElement('span');
        bullet.id = 'cgas-dev-dot-' + step.number;
        bullet.className = 'cgas-step-dot cgas-dev-dot';
        row.appendChild(bullet);

        const label = document.createElement('div');
        label.className = 'cgas-dev-step-label';
        label.title = step.description;
        label.textContent = step.number + '. ' + step.label;
        row.appendChild(label);

        const off = createButton('No', 'cgas-dev-toggle cgas-dev-off cgas-choice', () => {
            setDeveloperStepEnabled(step.id, false);
        });
        off.id = 'cgas-dev-off-' + step.number;
        off.title = 'Disable this workflow step in Developer Mode.';
        row.appendChild(off);

        const on = createButton('Yes', 'cgas-dev-toggle cgas-dev-on cgas-choice', () => {
            setDeveloperStepEnabled(step.id, true);
        });
        on.id = 'cgas-dev-on-' + step.number;
        on.title = 'Enable this workflow step in Developer Mode.';
        row.appendChild(on);

        if (developerStepIsAction(step.id)) {
            const test = createButton('Test', 'cgas-dev-test', () => {
                runDeveloperStep(step.id);
            });
            test.id = 'cgas-dev-test-' + step.number;
            test.title = 'Run this action step.';
            row.appendChild(test);
        } else {
            const stateOnly = document.createElement('span');
            stateOnly.className = 'cgas-dev-state-only';
            stateOnly.textContent = 'State';
            stateOnly.title = 'State-only step: no direct test action.';
            row.appendChild(stateOnly);
        }

        return row;
    }


    function createDeveloperStepSelector() {
        const picker = document.createElement('div');
        picker.id = 'cgas-dev-step-picker';

        const select = document.createElement('select');
        select.id = 'cgas-dev-step-selector';
        select.title = 'Select any workflow step to test or mark as current state.';

        for (const step of WORKFLOW_STEPS) {
            const option = document.createElement('option');
            option.value = step.id;
            option.textContent = step.number + '. ' + step.shortLabel;
            option.title = step.label;
            select.appendChild(option);
        }

        select.value = WORKFLOW_STEP_IDS.includes(state.developerSelectedStep) ? state.developerSelectedStep : 'voice_record_start';
        select.addEventListener('change', (event) => {
            const stepId = event.target.value;
            state.developerSelectedStep = stepId;
            saveStatePatch({ developerSelectedStep: stepId });
        });

        const runSelected = createButton('Run', 'cgas-dev-run-selected', () => {
            const stepId = select.value;
            state.developerSelectedStep = stepId;
            saveStatePatch({ developerSelectedStep: stepId });
            if (!developerStepIsAction(stepId)) {
                const step = WORKFLOW_STEPS.find((item) => item.id === stepId);
                setStatus('State-only step: ' + (step ? step.shortLabel : stepId));
                return;
            }
            runDeveloperStep(stepId);
        });
        runSelected.id = 'cgas-dev-run-selected';
        runSelected.title = 'Run the selected Developer Mode action step. State-only steps are not executable.';

        const setState = createButton('State', 'cgas-dev-set-state', () => {
            const stepId = select.value;
            state.developerSelectedStep = stepId;
            saveStatePatch({ developerSelectedStep: stepId });
            setWorkflowStep(stepId);
            const step = WORKFLOW_STEPS.find((item) => item.id === stepId);
            setStatus('Dev state set: ' + (step ? step.shortLabel : stepId));
        });
        setState.id = 'cgas-dev-set-state';
        setState.title = 'Mark the selected step as the current visible Developer Mode state without clicking ChatGPT controls.';

        picker.appendChild(select);
        picker.appendChild(runSelected);
        picker.appendChild(setState);
        return picker;
    }

    function createDeveloperPanel() {
        const panel = document.createElement('div');
        panel.id = 'cgas-dev-panel';

        const header = document.createElement('div');
        header.id = 'cgas-dev-header';
        header.textContent = 'Developer Mode';
        panel.appendChild(header);

        const stateLine = document.createElement('div');
        stateLine.id = 'cgas-dev-state-line';
        stateLine.textContent = 'Current state: ';
        const stateValue = document.createElement('span');
        stateValue.id = 'cgas-dev-current-state';
        stateValue.textContent = 'Idle';
        stateLine.appendChild(stateValue);
        panel.appendChild(stateLine);
        panel.appendChild(createDeveloperStepSelector());

        const blocks = [];
        for (const step of WORKFLOW_STEPS) {
            if (!blocks.includes(step.block)) {
                blocks.push(step.block);
            }
        }

        for (const block of blocks) {
            const blockEl = document.createElement('div');
            blockEl.className = 'cgas-dev-block';

            const blockTitle = document.createElement('div');
            blockTitle.className = 'cgas-dev-block-title';
            blockTitle.textContent = block;
            blockEl.appendChild(blockTitle);

            for (const step of WORKFLOW_STEPS.filter((item) => item.block === block)) {
                blockEl.appendChild(createDeveloperStepRow(step));
            }

            panel.appendChild(blockEl);
        }

        return panel;
    }

    function setDeveloperMode(enabled) {
        state.developerMode = Boolean(enabled);

        if (state.developerMode) {
            bumpAutomationEpoch('developer-mode-on');
            state.autoSend = false;
            state.autoRead = false;
            state.autoLoop = false;
            responseCycleOpen = false;
            responseCycleHash = '';
            lastReadCompletedHash = '';
        }

        saveStatePatch({
            developerMode: state.developerMode,
            autoSend: state.autoSend,
            autoRead: state.autoRead,
            autoLoop: state.autoLoop
        });
        updateWidget();
        setStatus(state.developerMode ? 'Developer Mode ON: legacy rows disabled' : 'Developer Mode OFF');
    }

    function setDeveloperStepEnabled(stepId, enabled) {
        if (!state.developerStepEnabled) {
            state.developerStepEnabled = defaultDeveloperStepEnabled();
        }

        state.developerStepEnabled[stepId] = Boolean(enabled);
        saveStatePatch({ developerStepEnabled: state.developerStepEnabled });
        updateWidget();
        const step = WORKFLOW_STEPS.find((item) => item.id === stepId);
        setStatus((step ? step.shortLabel : stepId) + (enabled ? ' ON' : ' OFF'));
    }

    function developerStepEnabled(stepId) {
        if (!state.developerStepEnabled) {
            return false;
        }
        return state.developerStepEnabled[stepId] === true;
    }

    function workflowActionAllowed(stepId) {
        if (!state.developerMode) {
            return true;
        }
        return developerStepEnabled(stepId);
    }

    function blockDeveloperStep(stepId) {
        if (developerStepEnabled(stepId)) {
            return false;
        }

        const step = WORKFLOW_STEPS.find((item) => item.id === stepId);
        setStatus('Dev step OFF: ' + (step ? step.shortLabel : stepId));
        return true;
    }

    async function runDeveloperStep(stepId) {
        if (!developerStepIsAction(stepId)) {
            const step = WORKFLOW_STEPS.find((item) => item.id === stepId);
            setStatus('State-only step: ' + (step ? step.shortLabel : stepId));
            return;
        }

        if (blockDeveloperStep(stepId)) {
            return;
        }

        switch (stepId) {
            case 'voice_record_start':
                setWorkflowStep('voice_record_start');
                await clickVoiceInputNow('Dev: start recording', { ignoreResponseCycle: true });
                return;
            case 'voice_recording':
                refreshCurrentStepFromPage();
                setStatus(findTranscriptionFinishButton() ? 'Dev: voice recording visible' : 'Dev: voice recording not detected');
                return;
            case 'transcription_request':
                setWorkflowStep('transcription_request');
                await clickTranscriptionFinishNow('Dev: request transcription');
                return;
            case 'transcript_write':
                setWorkflowStep('transcript_write');
                setStatus(getComposerText() ? 'Dev: transcript text detected' : 'Dev: no composer text');
                return;
            case 'send_to_chatgpt':
                setWorkflowStep('send_to_chatgpt');
                await sendComposerTextNow('Dev: send text');
                return;
            case 'thinking':
                setWorkflowStep('thinking');
                setStatus(pageLooksGenerating() || answerStillPendingAfterSend() ? 'Dev: thinking detected' : 'Dev: thinking not detected');
                return;
            case 'writing':
                setWorkflowStep('writing');
                setStatus(pageLooksGenerating() ? 'Dev: writing/generating detected' : 'Dev: writing not detected');
                return;
            case 'read_aloud':
                setWorkflowStep('read_aloud');
                await startReadAloudNow('Dev: read aloud');
                return;
            case 'loop_restart':
                setWorkflowStep('loop_restart');
                await clickVoiceInputNow('Dev: loop to step 1', { ignoreResponseCycle: true, ignoreStartToggle: true });
                return;
            default:
                setStatus('Unknown developer step: ' + stepId);
        }
    }


    function createFlowMasterRow() {
        const row = document.createElement('div');
        row.id = 'cgas-flow-master-row';

        const label = createLabel(
            'cgas-label-flow',
            'Full Flow Act.',
            'Full Flow Activation',
            'Global kill switch. When OFF, no automatic action runs even if rows below stay configured.'
        );
        row.appendChild(label);

        const off = createButton('No', 'cgas-choice cgas-flow-choice', () => setFlowEnabled(false));
        off.id = 'cgas-flow-off';
        row.appendChild(off);

        const on = createButton('Yes', 'cgas-choice cgas-flow-choice', () => setFlowEnabled(true));
        on.id = 'cgas-flow-on';
        row.appendChild(on);

        return row;
    }


    function createNextStepRow() {
        return createStopStepRow();
    }


    function createStepIndicatorItem(parts, titleText, extraClassName) {
        const item = document.createElement('div');
        item.className = 'cgas-step-indicator-item' + (extraClassName ? ' ' + extraClassName : '');
        item.title = titleText;

        for (const [label, id] of parts) {
            const group = document.createElement('span');
            group.className = 'cgas-step-part';

            const textNode = document.createElement('span');
            textNode.className = 'cgas-step-text';
            textNode.textContent = label;
            group.appendChild(textNode);

            const dot = document.createElement('span');
            dot.id = id;
            dot.className = 'cgas-step-dot';
            group.appendChild(dot);

            item.appendChild(group);
        }

        return item;
    }

    function createStepIndicatorRow() {
        const row = document.createElement('div');
        row.id = 'cgas-step-indicators';

        row.appendChild(createStepIndicatorItem([
            ['Send', 'cgas-step-send']
        ], 'Send transcription step', 'cgas-step-send-pill'));

        row.appendChild(createStepIndicatorItem([
            ['Think', 'cgas-step-think'],
            ['Read', 'cgas-step-read']
        ], 'Think / Read aloud phase', 'cgas-step-think-read-pill'));

        row.appendChild(createStepIndicatorItem([
            ['VTT', 'cgas-step-transcript']
        ], 'Start transcription step', 'cgas-step-vtt-pill'));

        return row;
    }

    function createWidget() {
        const existing = document.getElementById('cgas-widget');
        if (existing) {
            if (existing.getAttribute('data-cgas-version') !== VERSION) {
                existing.remove();
            } else {
                widget = existing;
                setupWidgetEventShield(widget);
                updateWidget();
                return;
            }
        }

        widget = document.createElement('div');
        widget.id = 'cgas-widget';
        widget.setAttribute('data-cgas-version', VERSION);
        setupWidgetEventShield(widget);

        widget.appendChild(createMiniRestoreButton());

        const dragbar = document.createElement('div');
        dragbar.id = 'cgas-dragbar';

        const title = document.createElement('div');
        title.id = 'cgas-title';
        title.textContent = 'Voice Flow';
        dragbar.appendChild(title);

        const versionBadge = document.createElement('span');
        versionBadge.id = 'cgas-version-badge';
        versionBadge.textContent = `v${VERSION}`;
        versionBadge.title = `Runtime version ${VERSION}`;
        dragbar.appendChild(versionBadge);

        dragbar.appendChild(createDeveloperModeToggle());
        dragbar.appendChild(createUpdateDevButton());
        dragbar.appendChild(createReloadExtensionButton());

        const modeToggle = createButton('Maxi', 'cgas-header-button', () => {
            state.labelsExpanded = !state.labelsExpanded;
            saveStatePatch({ labelsExpanded: state.labelsExpanded });
            updateWidget();
        });
        modeToggle.id = 'cgas-label-mode-toggle';
        modeToggle.title = 'Switch between compact labels and full explanatory labels.';
        dragbar.appendChild(modeToggle);

        const close = createButton('•', '', () => {
            setWidgetMinimized(true);
        });
        close.id = 'cgas-close';
        close.title = 'Minimize to compact VF button.';
        dragbar.appendChild(close);

        widget.appendChild(dragbar);

        widget.appendChild(createFlowMasterRow());
        widget.appendChild(createNextStepRow());
        widget.appendChild(createStepIndicatorRow());
        widget.appendChild(createDeveloperPanel());

        widget.appendChild(createRow(
            'cgas-label-send',
            'Send Tr.',
            'Send Transcription',
            'cgas-send-yes',
            'cgas-send-no',
            () => setAutoSend(true),
            () => setAutoSend(false),
            'Automatically send the transcript after ChatGPT validates voice-to-text.'
        ));

        widget.appendChild(createRow(
            'cgas-label-read',
            'Read',
            'Read Aloud From ChatGPT',
            'cgas-read-yes',
            'cgas-read-no',
            () => setAutoRead(true),
            () => setAutoRead(false),
            'Automatically start ChatGPT Read aloud on the latest assistant response.'
        ));

        widget.appendChild(createRow(
            'cgas-label-loop',
            'Start Tr.',
            'Start Transcription',
            'cgas-loop-yes',
            'cgas-loop-no',
            () => setAutoLoop(true),
            () => setAutoLoop(false),
            'After Read aloud ends, restart ChatGPT voice-to-text transcription.'
        ));

        widget.appendChild(createRow(
            'cgas-label-tos',
            'T.O.S.',
            'Time Of Silence',
            'cgas-tos-yes',
            'cgas-tos-no',
            () => setTosEnabled(true),
            () => setTosEnabled(false),
            'Click the ChatGPT transcription validation button after configured silence.'
        ));

        widget.appendChild(createTosSecondsRow());
        widget.appendChild(createThresholdRow());

        const volumeRow = document.createElement('div');
        volumeRow.id = 'cgas-vol-row';
        volumeRow.className = 'cgas-meter-row';

        const volumeLabel = document.createElement('div');
        volumeLabel.className = 'cgas-label';
        volumeLabel.id = 'cgas-label-vol';
        volumeLabel.classList.add('cgas-dynamic-label');
        volumeLabel.dataset.shortText = 'Vol';
        volumeLabel.dataset.longText = 'Microphone Volume';
        volumeLabel.textContent = 'Vol';
        volumeLabel.title = 'Current microphone level on the same 0–100 scale as THR.';
        volumeRow.appendChild(volumeLabel);

        const volumeBar = document.createElement('div');
        volumeBar.id = 'cgas-vol-bar';
        const volumeFill = document.createElement('div');
        volumeFill.id = 'cgas-vol-fill';
        volumeBar.appendChild(volumeFill);
        volumeRow.appendChild(volumeBar);

        const volumeValue = document.createElement('div');
        volumeValue.id = 'cgas-vol-value';
        volumeValue.textContent = '0';
        volumeRow.appendChild(volumeValue);

        widget.appendChild(volumeRow);

        const status = document.createElement('div');
        status.id = 'cgas-status';
        status.textContent = 'Idle';
        widget.appendChild(status);

        document.documentElement.appendChild(widget);
        setupDrag(dragbar, widget);
        updateWidget();
    }

    function applyWidgetLabels() {
        if (!widget) {
            return;
        }

        widget.classList.toggle('cgas-labels-expanded', state.labelsExpanded);
        widget.classList.toggle('cgas-developer-mode', state.developerMode);

        const title = document.getElementById('cgas-title');
        if (title) {
            title.textContent = state.developerMode
                ? (state.labelsExpanded ? 'ChatGPT Voice Flow Dev' : 'Voice Flow Dev')
                : (state.labelsExpanded ? 'ChatGPT Voice Flow' : 'Voice Flow');
        }

        const toggle = document.getElementById('cgas-label-mode-toggle');
        if (toggle) {
            toggle.textContent = state.labelsExpanded ? 'Mini' : 'Maxi';
            toggle.title = state.labelsExpanded
                ? 'Switch to compact labels.'
                : 'Switch to full explanatory labels.';
        }

        const devToggle = document.getElementById('cgas-dev-mode-toggle');
        if (devToggle) {
            devToggle.textContent = state.developerMode ? 'User' : 'Dev';
            devToggle.title = state.developerMode
                ? 'Hide Developer Mode.'
                : 'Show Developer Mode with detailed state machine steps.';
            devToggle.classList.toggle('cgas-dev-active', state.developerMode);
        }

        const next = document.getElementById('cgas-next-step');
        if (next) {
            next.textContent = state.labelsExpanded ? 'Next Step' : 'Next';
        }

        const stop = document.getElementById('cgas-stop-step');
        if (stop) {
            stop.textContent = state.labelsExpanded ? 'Stop Flow' : 'Stop';
        }

        for (const label of Array.from(widget.querySelectorAll('.cgas-dynamic-label'))) {
            label.textContent = state.labelsExpanded
                ? (label.dataset.longText || label.dataset.shortText || label.textContent)
                : (label.dataset.shortText || label.textContent);
        }
    }

    function updateChoice(id, active, yesKind) {
        const button = document.getElementById(id);
        if (!button) {
            return;
        }

        button.classList.remove('cgas-active-yes', 'cgas-active-no');
        if (active) {
            button.classList.add(yesKind ? 'cgas-active-yes' : 'cgas-active-no');
        }
    }

    function updateWidget() {
        if (!widget) {
            return;
        }

        widget.classList.toggle('cgas-hidden', !state.widgetVisible);
        widget.classList.toggle('cgas-minimized', Boolean(state.widgetMinimized));
        widget.classList.toggle('cgas-developer-mode', state.developerMode);
        if (state.widgetVisible) {
            forceWidgetVisibleIfNeeded();
        }
        applyWidgetLabels();

        if (state.widgetLeft !== null && state.widgetTop !== null) {
            widget.style.left = state.widgetLeft + 'px';
            widget.style.top = state.widgetTop + 'px';
            widget.style.right = 'auto';
        }

        updateChoice('cgas-flow-on', state.flowEnabled, true);
        updateChoice('cgas-flow-off', !state.flowEnabled, false);
        updateChoice('cgas-send-yes', state.autoSend, true);
        updateChoice('cgas-send-no', !state.autoSend, false);
        updateChoice('cgas-read-yes', state.autoRead, true);
        updateChoice('cgas-read-no', !state.autoRead, false);
        updateChoice('cgas-loop-yes', state.autoLoop, true);
        updateChoice('cgas-loop-no', !state.autoLoop, false);
        updateChoice('cgas-tos-yes', state.tosEnabled, true);
        updateChoice('cgas-tos-no', !state.tosEnabled, false);

        const tosValue = document.getElementById('cgas-tos-value');
        if (tosValue) {
            tosValue.textContent = String(state.tosSeconds) + 's';
        }

        const thrValue = document.getElementById('cgas-thr-value');
        if (thrValue) {
            thrValue.textContent = String(state.tosThreshold);
        }

        updateVolumeMeter();

        const developerPanel = document.getElementById('cgas-dev-panel');
        if (developerPanel) {
            developerPanel.hidden = !state.developerMode;
        }

        refreshCurrentStepFromPage();

        setStatus(flowIsActive() && (state.autoSend || state.autoRead || state.autoLoop || state.tosEnabled) ? 'Watching…' : (state.flowEnabled ? 'Idle' : 'Flow OFF'), true);
    }

    function updateVolumeMeter() {
        const fill = document.getElementById('cgas-vol-fill');
        const value = document.getElementById('cgas-vol-value');
        const level = Math.min(100, Math.max(0, Number(tosLastLevel) || 0));

        if (fill) {
            fill.style.width = String(level) + '%';
            fill.classList.toggle('cgas-vol-over-thr', level >= tosEffectiveLevelThreshold());
        }

        if (value) {
            value.textContent = String(level);
        }
    }


    function setFlowEnabled(enabled) {
        state.flowEnabled = Boolean(enabled);
        saveStatePatch({ flowEnabled: state.flowEnabled });

        if (!state.flowEnabled) {
            bumpAutomationEpoch('flow-off');
            responseCycleOpen = false;
            responseCycleHash = '';
            lastReadCompletedHash = '';
            resetTosState();
            stopAudioMonitor();
            setCurrentStep('idle');
            updateWidget();
            setStatus('Flow OFF');
        } else {
            bumpAutomationEpoch('flow-on');
            if (state.tosEnabled) {
                ensureAudioMonitor();
            }
            updateWidget();
            setStatus('Flow ON');
        }
    }

    function setAutoSend(enabled) {
        bumpAutomationEpoch('send-toggle');
        state.autoSend = Boolean(enabled);
        saveStatePatch({ autoSend: state.autoSend });
        updateWidget();
        setStatus(state.autoSend ? 'Send transcript ON' : 'Send transcript OFF');
    }

    function setAutoRead(enabled) {
        bumpAutomationEpoch('read-toggle');
        state.autoRead = Boolean(enabled);

        if (state.autoRead) {
            const latest = getLatestAssistantMessage();
            if (latest && latest.text) {
                lastReadHash = hashText(latest.text);
                lastAssistantHashSeen = lastReadHash;
                assistantStableSince = now();
            }
        }

        saveStatePatch({ autoRead: state.autoRead });
        updateWidget();
        setStatus(state.autoRead ? 'Read aloud ON' : 'Read aloud OFF');
    }

    function setAutoLoop(enabled) {
        bumpAutomationEpoch('start-transcription-toggle');
        state.autoLoop = Boolean(enabled);
        saveStatePatch({ autoLoop: state.autoLoop });
        updateWidget();
        setStatus(state.autoLoop ? 'Start transcription ON' : 'Start transcription OFF');
    }

    function setTosEnabled(enabled) {
        bumpAutomationEpoch('tos-toggle');
        state.tosEnabled = Boolean(enabled);
        saveStatePatch({ tosEnabled: state.tosEnabled });

        if (!state.tosEnabled || !flowIsActive()) {
            stopAudioMonitor();
        } else {
            ensureAudioMonitor();
        }

        updateWidget();
        setStatus(state.tosEnabled ? 'TOS ON' : 'TOS OFF');
    }

    function setTosSeconds(value) {
        state.tosSeconds = clampTosSeconds(value);
        saveStatePatch({ tosSeconds: state.tosSeconds });
        updateWidget();
        setStatus('TOS ' + state.tosSeconds + 's');
    }

    function setTosThreshold(value) {
        state.tosThreshold = clampTosThreshold(value);
        saveStatePatch({ tosThreshold: state.tosThreshold });
        updateWidget();
        setStatus('THR ' + state.tosThreshold);
    }

    function setupDrag(handle, target) {
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handle.addEventListener('mousedown', (event) => {
            if (event.button !== 0) {
                return;
            }
            dragging = true;
            const rect = target.getBoundingClientRect();
            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;
            event.preventDefault();
            event.stopPropagation();
        });

        window.addEventListener('mousemove', (event) => {
            if (!dragging) {
                return;
            }

            const maxLeft = Math.max(0, window.innerWidth - target.offsetWidth - 4);
            const maxTop = Math.max(0, window.innerHeight - target.offsetHeight - 4);
            const left = Math.min(maxLeft, Math.max(4, event.clientX - offsetX));
            const top = Math.min(maxTop, Math.max(4, event.clientY - offsetY));

            target.style.left = left + 'px';
            target.style.top = top + 'px';
            target.style.right = 'auto';

            state.widgetLeft = left;
            state.widgetTop = top;
        }, true);

        window.addEventListener('mouseup', () => {
            if (!dragging) {
                return;
            }
            dragging = false;
            saveStatePatch({ widgetLeft: state.widgetLeft, widgetTop: state.widgetTop });
        }, true);
    }

    function isElementVisible(el) {
        if (!el || el.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }

        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || '1') > 0;
    }

    function textOf(el) {
        return normalizeSpace([
            el && el.innerText,
            el && el.textContent,
            el && el.getAttribute && el.getAttribute('aria-label'),
            el && el.getAttribute && el.getAttribute('title'),
            el && el.getAttribute && el.getAttribute('data-testid')
        ].filter(Boolean).join(' '));
    }

    function getComposerCandidates() {
        const selectors = [
            '#prompt-textarea',
            '[data-testid="prompt-textarea"]',
            'textarea[placeholder]',
            'textarea',
            'form [contenteditable="true"]',
            'main [contenteditable="true"]',
            '[role="textbox"][contenteditable="true"]'
        ];

        const candidates = [];
        for (const selector of selectors) {
            for (const el of Array.from(document.querySelectorAll(selector))) {
                if (el && !candidates.includes(el) && isElementVisible(el)) {
                    candidates.push(el);
                }
            }
        }
        return candidates;
    }

    function getComposerText() {
        for (const el of getComposerCandidates()) {
            let text = '';
            if (typeof el.value === 'string') {
                text = el.value;
            } else {
                text = el.innerText || el.textContent || '';
            }

            text = normalizeSpace(text);
            if (text) {
                return text;
            }
        }
        return '';
    }

    function findComposerRoot() {
        const candidates = getComposerCandidates();
        if (candidates.length === 0) {
            return null;
        }

        return candidates[0].closest('form') || candidates[0].closest('[data-testid*="composer"]') || candidates[0].parentElement || document;
    }

    function findSendButton() {
        const roots = [];
        const composerRoot = findComposerRoot();
        if (composerRoot) {
            roots.push(composerRoot);
        }
        roots.push(document);

        const selectors = [
            'button[data-testid="send-button"]',
            'button[aria-label*="Send"]',
            'button[aria-label*="Envoyer"]',
            'button[type="submit"]',
            'form button'
        ];

        for (const root of roots) {
            for (const selector of selectors) {
                for (const button of Array.from(root.querySelectorAll(selector))) {
                    if (!button || button.disabled || !isElementVisible(button)) {
                        continue;
                    }

                    const label = textOf(button);
                    if (BAD_SEND_LABEL_RE.test(label)) {
                        continue;
                    }

                    if (SEND_LABEL_RE.test(label) || button.getAttribute('data-testid') === 'send-button' || button.type === 'submit') {
                        return button;
                    }
                }
            }
        }

        return null;
    }

    function monitorComposer() {
        if (!isSupportedUrl() || !flowIsActive() || !state.autoSend) {
            return;
        }

        refreshCurrentStepFromPage();

        if (!workflowActionAllowed('send_to_chatgpt')) {
            setStatus('Dev blocked: send step OFF');
            return;
        }

        const text = getComposerText();
        if (text !== lastComposerText) {
            lastComposerText = text;
            composerStableSince = now();
            return;
        }

        if (!text || text.length < CONFIG.minComposerLength) {
            return;
        }

        const textHash = hashText(text);
        if (textHash === lastSentHash) {
            return;
        }

        if (now() - composerStableSince < CONFIG.composerStableMs) {
            return;
        }

        if (now() - lastSendAt < CONFIG.sendCooldownMs) {
            return;
        }

        const sendButton = findSendButton();
        if (!sendButton) {
            setStatus('Send button not ready');
            return;
        }

        try {
            setCurrentStep('send');
            noteSendCycleStart();
            sendButton.click();
            lastSentHash = textHash;
            lastSendAt = now();
            setCurrentStep('think');
            setStatus('Transcript sent, thinking');
        } catch (error) {
            setStatus('Send failed: ' + error.message);
        }
    }

    function getAssistantTurnFromRoleNode(roleNode) {
        if (!roleNode || !roleNode.closest) {
            return roleNode;
        }

        return roleNode.closest('[data-testid^="conversation-turn-"]') ||
            roleNode.closest('article') ||
            roleNode.closest('[class*="group"]') ||
            roleNode;
    }

    function extractAssistantText(turn, roleNode) {
        const target = roleNode || turn;
        const clone = target.cloneNode(true);
        const removeSelectors = [
            'script',
            'style',
            'noscript',
            'svg',
            'canvas',
            'button',
            '[role="button"]',
            '[role="toolbar"]',
            '[data-testid*="copy"]',
            '[data-testid*="feedback"]',
            '[data-testid*="share"]',
            '[data-testid*="composer"]',
            '#cgas-widget'
        ];

        for (const selector of removeSelectors) {
            for (const el of Array.from(clone.querySelectorAll(selector))) {
                el.remove();
            }
        }

        return normalizeSpace(clone.innerText || clone.textContent || '');
    }

    function getLatestAssistantMessage() {
        const roleNodes = Array.from(document.querySelectorAll('[data-message-author-role="assistant"]'));
        const candidates = [];

        for (const roleNode of roleNodes) {
            const turn = getAssistantTurnFromRoleNode(roleNode);
            const text = extractAssistantText(turn, roleNode);
            if (text && text.length >= CONFIG.minAssistantLength) {
                candidates.push({ node: turn, roleNode, text });
            }
        }

        if (candidates.length === 0) {
            const articles = Array.from(document.querySelectorAll('article'));
            for (const article of articles) {
                if (article.querySelector('[data-message-author-role="user"]')) {
                    continue;
                }
                if (!article.querySelector('.markdown, [class*="markdown"], pre, code')) {
                    continue;
                }
                const text = extractAssistantText(article, article);
                if (text && text.length >= CONFIG.minAssistantLength) {
                    candidates.push({ node: article, roleNode: article, text });
                }
            }
        }

        if (candidates.length === 0) {
            return null;
        }

        candidates.sort((a, b) => {
            if (a.node === b.node) {
                return 0;
            }
            return a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
        });

        return candidates[candidates.length - 1];
    }


    function getUserTurnFromRoleNode(roleNode) {
        if (!roleNode || !roleNode.closest) {
            return roleNode;
        }

        return roleNode.closest('[data-testid^="conversation-turn-"]') ||
            roleNode.closest('article') ||
            roleNode.closest('[class*="group"]') ||
            roleNode;
    }

    function getLatestUserMessage() {
        const roleNodes = Array.from(document.querySelectorAll('[data-message-author-role="user"]'));
        const candidates = [];

        for (const roleNode of roleNodes) {
            const turn = getUserTurnFromRoleNode(roleNode);
            const text = normalizeSpace(roleNode.innerText || roleNode.textContent || turn.innerText || turn.textContent || '');
            if (text) {
                candidates.push({ node: turn, roleNode, text });
            }
        }

        if (candidates.length === 0) {
            return null;
        }

        candidates.sort((a, b) => {
            if (a.node === b.node) {
                return 0;
            }
            return a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
        });

        return candidates[candidates.length - 1];
    }

    function latestUserIsAfterAssistant(latestAssistant) {
        if (!latestAssistant || !latestAssistant.node) {
            return false;
        }

        const latestUser = getLatestUserMessage();
        if (!latestUser || !latestUser.node) {
            return false;
        }

        return Boolean(latestAssistant.node.compareDocumentPosition(latestUser.node) & Node.DOCUMENT_POSITION_FOLLOWING);
    }

    function assistantIsAfterLatestUser(latestAssistant) {
        if (!latestAssistant || !latestAssistant.node) {
            return false;
        }

        const latestUser = getLatestUserMessage();
        if (!latestUser || !latestUser.node) {
            return true;
        }

        return Boolean(latestUser.node.compareDocumentPosition(latestAssistant.node) & Node.DOCUMENT_POSITION_FOLLOWING);
    }

    function latestAssistantHashMatches(expectedHash) {
        if (!expectedHash) {
            return true;
        }

        const latest = getLatestAssistantMessage();
        if (!latest || !latest.text) {
            return false;
        }

        return hashText(latest.text) === expectedHash;
    }

    function pageLooksGenerating() {
        const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
        for (const button of buttons) {
            if (!isElementVisible(button)) {
                continue;
            }
            const label = textOf(button);
            if (GENERATING_LABEL_RE.test(label)) {
                return true;
            }
        }
        return false;
    }

    function scoreGeneratingStopButton(control) {
        if (!control || !isElementVisible(control) || control.closest('#cgas-widget')) {
            return -1;
        }

        const label = textOf(control);
        if (!label || !GENERATING_STOP_LABEL_RE.test(label) || GENERATING_STOP_BAD_LABEL_RE.test(label)) {
            return -1;
        }

        let score = 0;
        const dataTestId = String(control.getAttribute('data-testid') || '');
        const ariaLabel = String(control.getAttribute('aria-label') || '');
        const combined = normalizeSpace([label, dataTestId, ariaLabel].join(' '));
        const composerRoot = findComposerRoot();
        const rect = control.getBoundingClientRect();

        if (/stop\s+generating|stop\s+streaming|arr[eê]ter.*g[eé]n[eé]ration/i.test(combined)) {
            score += 220;
        }
        if (/\bstop\b/i.test(combined)) {
            score += 80;
        }
        if (/stop/i.test(dataTestId)) {
            score += 90;
        }
        if (composerRoot && composerRoot.contains(control)) {
            score += 90;
        }
        if (rect.top > window.innerHeight * 0.55) {
            score += 45;
        }
        if (rect.width >= 18 && rect.width <= 84 && rect.height >= 18 && rect.height <= 84) {
            score += 20;
        }

        return score;
    }

    function findGeneratingStopButton() {
        const controls = Array.from(document.querySelectorAll('button, [role="button"]'));
        const candidates = [];

        for (const control of controls) {
            const score = scoreGeneratingStopButton(control);
            if (score >= 80) {
                candidates.push({ control, score });
            }
        }

        candidates.sort((a, b) => b.score - a.score);
        return candidates.length ? candidates[0].control : null;
    }

    async function waitUntilGeneratingLooksStopped(timeoutMs) {
        const started = now();
        while (now() - started < timeoutMs) {
            if (!pageLooksGenerating()) {
                return true;
            }
            await sleep(250);
        }
        return !pageLooksGenerating();
    }

    function revealMessageActions(node) {
        try {
            node.scrollIntoView({ block: 'center', inline: 'nearest' });
            for (const type of ['mouseover', 'mouseenter', 'mousemove']) {
                node.dispatchEvent(new MouseEvent(type, {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            }
        } catch (error) {
            console.log('[CGAS] revealMessageActions failed:', error.message);
        }
    }

    function findButtonByLabel(root, labelRe) {
        const searchRoot = root && root.querySelectorAll ? root : document;
        const controls = Array.from(searchRoot.querySelectorAll('button, [role="button"], [role="menuitem"], a'));

        for (const control of controls) {
            if (!isElementVisible(control)) {
                continue;
            }

            const label = textOf(control);
            if (labelRe.test(label)) {
                return control;
            }
        }

        return null;
    }

    function findMoreButton(root) {
        const searchRoot = root && root.querySelectorAll ? root : document;
        const controls = Array.from(searchRoot.querySelectorAll('button, [role="button"]'));

        for (const control of controls) {
            if (!isElementVisible(control)) {
                continue;
            }

            const label = textOf(control);
            if (READ_LABEL_RE.test(label)) {
                continue;
            }
            if (MORE_LABEL_RE.test(label)) {
                return control;
            }
        }

        const buttons = controls.filter(isElementVisible);
        for (const button of buttons) {
            const aria = String(button.getAttribute('aria-haspopup') || '').toLowerCase();
            const expanded = String(button.getAttribute('aria-expanded') || '').toLowerCase();
            if (aria === 'menu' || expanded === 'false' || expanded === 'true') {
                return button;
            }
        }

        return null;
    }

    async function clickReadAloudForLatest(latest) {
        if (!latest || !latest.node) {
            return false;
        }

        revealMessageActions(latest.node);
        await sleep(CONFIG.revealWaitMs);

        let readButton = findButtonByLabel(latest.node, READ_LABEL_RE);
        if (readButton) {
            readButton.click();
            return true;
        }

        const moreButton = findMoreButton(latest.node);
        if (!moreButton) {
            return false;
        }

        moreButton.click();
        await sleep(CONFIG.menuWaitMs);

        readButton = findButtonByLabel(document, READ_LABEL_RE);
        if (readButton) {
            readButton.click();
            return true;
        }

        return false;
    }

    async function monitorAssistantForReadAloud() {
        if (!isSupportedUrl() || !flowIsActive() || !state.autoRead || readRunning) {
            return;
        }

        const latest = getLatestAssistantMessage();
        if (!latest || !latest.text) {
            return;
        }

        if (latestUserIsAfterAssistant(latest) || (lastSendAt && !assistantIsAfterLatestUser(latest) && now() - lastSendAt < CONFIG.pendingAnswerGuardMs)) {
            setCurrentStep('think');
            setStatus('Waiting assistant answer');
            return;
        }

        const currentHash = hashText(latest.text);

        if (assistantHashAtLastSend && currentHash === assistantHashAtLastSend && now() - lastSendAt < CONFIG.pendingAnswerGuardMs) {
            setCurrentStep('think');
            setStatus('Waiting new response');
            return;
        }

        if (currentHash !== lastAssistantHashSeen) {
            lastAssistantHashSeen = currentHash;
            assistantStableSince = now();
            return;
        }

        if (currentHash === lastReadHash) {
            return;
        }

        if (now() - assistantStableSince < CONFIG.assistantStableMs) {
            return;
        }

        if (now() - lastReadAt < CONFIG.readCooldownMs) {
            return;
        }

        if (!workflowActionAllowed('read_aloud')) {
            setStatus('Dev blocked: read step OFF');
            return;
        }

        if (pageLooksGenerating()) {
            setCurrentStep('think');
            return;
        }

        readRunning = true;
        try {
            const ok = await clickReadAloudForLatest(latest);
            if (ok) {
                markReadStarted(currentHash, latest.text);
                setStatus('Read aloud clicked');
                if (state.autoLoop) {
                    restartVoiceInputAfterRead(latest, currentHash);
                }
            } else {
                setStatus('Read aloud not found');
            }
        } catch (error) {
            setStatus('Read aloud failed: ' + error.message);
        } finally {
            readRunning = false;
        }
    }


    function scoreReadAloudStopButton(control) {
        if (!control || !isElementVisible(control) || control.closest('#cgas-widget')) {
            return -1;
        }

        const label = textOf(control);
        if (!label || !READ_STOP_LABEL_RE.test(label) || READ_STOP_BAD_LABEL_RE.test(label)) {
            return -1;
        }

        let score = 0;
        const dataTestId = String(control.getAttribute('data-testid') || '');
        const ariaLabel = String(control.getAttribute('aria-label') || '');
        const combined = normalizeSpace([label, dataTestId, ariaLabel].join(' '));
        const rect = control.getBoundingClientRect();

        if (/stop\s+reading|stop\s+audio|arr[eê]ter\s+(la\s+)?lecture|arr[eê]ter\s+(l['’])?audio/i.test(combined)) {
            score += 260;
        }
        if (/\bstop\b/i.test(combined)) {
            score += 90;
        }
        if (/read|reading|audio|speaker|haut-parleur|lecture/i.test(combined)) {
            score += 90;
        }
        if (/stop/i.test(dataTestId)) {
            score += 45;
        }
        if (rect.top > window.innerHeight * 0.20 && rect.top < window.innerHeight * 0.88) {
            score += 12;
        }
        if (rect.width >= 18 && rect.width <= 110 && rect.height >= 18 && rect.height <= 110) {
            score += 20;
        }

        return score;
    }

    function findReadAloudStopButton() {
        const controls = Array.from(document.querySelectorAll('button, [role="button"], [role="menuitem"]'));
        const candidates = [];

        for (const control of controls) {
            const score = scoreReadAloudStopButton(control);
            if (score >= 100) {
                candidates.push({ control, score });
            }
        }

        candidates.sort((a, b) => b.score - a.score);
        return candidates.length ? candidates[0].control : null;
    }

    function pageLooksReadingAloud() {
        if (findReadAloudStopButton()) {
            return true;
        }

        const controls = Array.from(document.querySelectorAll('button, [role="button"], [role="menuitem"]'));
        for (const control of controls) {
            if (!isElementVisible(control) || control.closest('#cgas-widget')) {
                continue;
            }
            const label = textOf(control);
            if (READ_ACTIVE_LABEL_RE.test(label) && !READ_STOP_BAD_LABEL_RE.test(label)) {
                return true;
            }
        }

        try {
            if (window.speechSynthesis && window.speechSynthesis.speaking) {
                return true;
            }
        } catch (error) {
            console.log('[CGAS] speechSynthesis status unavailable:', error.message);
        }

        return false;
    }

    function estimateReadMs(text) {
        const words = normalizeSpace(text).split(/\s+/).filter(Boolean).length;
        /*
         * v6.0: be deliberately conservative. ChatGPT Read aloud can be
         * slower than a simple TTS estimate, especially in French. The Loop
         * step must wait too long rather than restart the mic while the answer
         * is still being spoken through the speakers.
         */
        const estimated = Math.round((words / 1.85) * 1000) + 6500;
        return Math.min(CONFIG.loopMaxReadWaitMs, Math.max(CONFIG.loopMinReadWaitMs, estimated));
    }

    async function waitForReadAloudCompletion(text, expectedEpoch) {
        const started = now();
        const estimatedWait = estimateReadMs(text);
        const maxWait = Math.min(CONFIG.loopMaxReadWaitMs, Math.max(estimatedWait + 15000, 18000));
        let sawActiveReadState = false;
        let inactiveSince = 0;

        await sleep(1200);

        while (now() - started < maxWait) {
            if (!flowIsActive() || !state.autoLoop || (typeof expectedEpoch === 'number' && expectedEpoch !== automationEpoch)) {
                setStatus('Read wait cancelled');
                return false;
            }

            const active = pageLooksReadingAloud();

            if (active) {
                sawActiveReadState = true;
                inactiveSince = 0;
                setStatus('Reading… restart locked');
                await sleep(CONFIG.loopMonitorMs);
                continue;
            }

            if (sawActiveReadState) {
                if (!inactiveSince) {
                    inactiveSince = now();
                    setStatus('Read stopped? safety wait');
                    await sleep(CONFIG.loopMonitorMs);
                    continue;
                }

                if (now() - inactiveSince >= CONFIG.loopReadActiveStableOffMs) {
                    await sleep(CONFIG.loopPostReadSafetyMs);
                    return true;
                }

                await sleep(CONFIG.loopMonitorMs);
                continue;
            }

            /*
             * If the page exposes no explicit Stop/Pause reading control, do
             * not trust a short fallback. Wait the conservative text-duration
             * estimate plus a safety delay. This prevents the TTS self-listening
             * bug when ChatGPT hides the active Read aloud state from the DOM.
             */
            if (now() - started >= estimatedWait) {
                await sleep(CONFIG.loopPostReadSafetyMs);
                setStatus('Start locked: read stop not confirmed');
                return false;
            }

            setStatus('Reading estimate… restart locked');
            await sleep(CONFIG.loopMonitorMs);
        }

        await sleep(CONFIG.loopPostReadSafetyMs);
        return sawActiveReadState && !pageLooksReadingAloud();
    }

    function scoreDictationButton(button, composerRoot) {
        if (!button || button.disabled || !isElementVisible(button)) {
            return -1;
        }

        if (composerRoot && !composerRoot.contains(button)) {
            return -1;
        }

        const label = textOf(button);
        const ariaLabel = String(button.getAttribute('aria-label') || '');
        const title = String(button.getAttribute('title') || '');
        const dataTestId = String(button.getAttribute('data-testid') || '');
        const combined = normalizeSpace([label, ariaLabel, title, dataTestId].join(' '));

        if (!combined || BAD_MIC_LABEL_RE.test(combined)) {
            return -1;
        }

        let score = 0;

        if (/dictate|dictation|dicter|dictée|dictee|saisie\s+vocale|transcription\s+vocale/i.test(combined)) {
            score += 120;
        }

        if (/microphone|\bmic\b|micro/i.test(combined)) {
            score += 90;
        }

        if (/voice\s+input|entrée\s+vocale/i.test(combined)) {
            score += 35;
        }

        if (/voice/i.test(combined) && !/voice\s+input/i.test(combined)) {
            score -= 80;
        }

        if (/mode|conversation|audio|call|appel/i.test(combined)) {
            score -= 160;
        }

        if (!MIC_LABEL_RE.test(combined) && score < 90) {
            return -1;
        }

        return score;
    }

    function findVoiceInputButton() {
        const composerRoot = findComposerRoot();
        if (!composerRoot) {
            return null;
        }

        const selectors = [
            'button[data-testid*="dict" i]',
            'button[data-testid*="micro" i]',
            'button[data-testid*="mic" i]',
            'button[aria-label*="dict" i]',
            'button[aria-label*="micro" i]',
            'button[aria-label*="mic" i]',
            'button[aria-label*="dicter" i]',
            'button[aria-label*="dictée" i]',
            'button[aria-label*="dictee" i]',
            'button[aria-label*="saisie vocale" i]',
            'button[aria-label*="voice input" i]',
            '[role="button"][aria-label*="dict" i]',
            '[role="button"][aria-label*="micro" i]',
            '[role="button"][aria-label*="mic" i]',
            'button'
        ];

        const candidates = [];
        const seen = new Set();

        for (const selector of selectors) {
            for (const button of Array.from(composerRoot.querySelectorAll(selector))) {
                if (seen.has(button)) {
                    continue;
                }

                seen.add(button);

                const score = scoreDictationButton(button, composerRoot);
                if (score < 70) {
                    continue;
                }

                const rect = button.getBoundingClientRect();
                candidates.push({ button, score, left: rect.left, top: rect.top });
            }
        }

        if (candidates.length === 0) {
            return null;
        }

        candidates.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.left - b.left;
        });

        const best = candidates[0];
        const second = candidates[1];

        if (second && best.score === second.score && Math.abs(best.left - second.left) < 120) {
            return null;
        }

        return best.button;
    }

    async function restartVoiceInputAfterRead(latest, currentHash) {
        const jobEpoch = automationEpoch;

        if (!flowIsActive() || !state.autoLoop || loopRunning) {
            return;
        }

        if (currentHash && currentHash === lastLoopHash) {
            return;
        }

        if (now() - lastMicClickAt < CONFIG.loopMicCooldownMs) {
            return;
        }

        loopRunning = true;
        try {
            setCurrentStep('read');
            setStatus('Waiting read end…');
            const readStopped = await waitForReadAloudCompletion(latest && latest.text ? latest.text : '', jobEpoch);
            if (!readStopped || pageLooksReadingAloud() || jobEpoch !== automationEpoch || !state.autoLoop || !flowIsActive()) {
                setStatus('Start locked: read stop not confirmed');
                return;
            }
            markReadCompleted(currentHash || '');

            if (latest && !assistantIsAfterLatestUser(latest)) {
                setStatus('Start locked: not latest answer');
                return;
            }

            if (!autoStartTranscriptionAllowed(currentHash, jobEpoch)) {
                return;
            }

            const microphoneButton = findVoiceInputButton();
            if (!microphoneButton) {
                setStatus('Mic button not found');
                return;
            }

            setCurrentStep('transcript');
            microphoneButton.click();
            lastLoopHash = currentHash || '';
            lastMicClickAt = now();
            setStatus('Transcription started');
        } catch (error) {
            setStatus('Restart failed: ' + error.message);
        } finally {
            loopRunning = false;
        }
    }


    function resetTosState() {
        tosVoiceSeen = false;
        tosSilenceSince = 0;
    }

    function stopAudioMonitor() {
        if (audioStream) {
            for (const track of audioStream.getTracks()) {
                try {
                    track.stop();
                } catch (error) {
                    console.log('[CGAS] Audio track stop failed:', error.message);
                }
            }
        }

        audioStream = null;
        audioAnalyser = null;
        audioData = null;

        if (audioContext) {
            try {
                audioContext.close();
            } catch (error) {
                console.log('[CGAS] AudioContext close failed:', error.message);
            }
        }

        audioContext = null;
        resetTosState();
    }

    async function ensureAudioMonitor() {
        if (audioAnalyser && audioData) {
            return true;
        }

        if (audioPermissionFailed || tosStartInProgress) {
            return false;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            audioPermissionFailed = true;
            setStatus('TOS no getUserMedia');
            return false;
        }

        tosStartInProgress = true;
        try {
            /*
             * v5.3: use the same microphone constraint profile as the previous
             * working Whisper widget. Browser-side processing stays enabled by
             * default instead of forcing raw noisy headset input.
             */
            audioStream = await navigator.mediaDevices.getUserMedia({
                audio: { channelCount: 1, sampleRate: 16000 },
                video: false
            });

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) {
                audioPermissionFailed = true;
                setStatus('TOS no AudioContext');
                return false;
            }

            audioContext = new AudioCtx();
            const source = audioContext.createMediaStreamSource(audioStream);
            audioAnalyser = audioContext.createAnalyser();
            audioAnalyser.fftSize = 2048;
            source.connect(audioAnalyser);
            audioData = new Uint8Array(audioAnalyser.fftSize);
            audioPermissionFailed = false;
            resetTosState();
            setStatus('TOS audio ready');
            return true;
        } catch (error) {
            audioPermissionFailed = true;
            setStatus('TOS mic denied');
            console.log('[CGAS] TOS microphone unavailable:', error.message);
            stopAudioMonitor();
            return false;
        } finally {
            tosStartInProgress = false;
        }
    }

    function currentMicRms() {
        if (!audioAnalyser || !audioData) {
            return 0;
        }

        audioAnalyser.getByteTimeDomainData(audioData);
        let sum = 0;
        for (let i = 0; i < audioData.length; i += 1) {
            const normalized = (audioData[i] - 128) / 128;
            sum += normalized * normalized;
        }
        tosLastRms = Math.sqrt(sum / audioData.length);
        tosLastLevel = tosLevelFromRms(tosLastRms);
        updateVolumeMeter();
        return tosLastRms;
    }

    function scoreTranscriptionFinishButton(button, composerRoot, allowGlobal) {
        if (!button || (typeof button.disabled === 'boolean' && button.disabled) || !isElementVisible(button)) {
            return -1;
        }

        if (!allowGlobal && composerRoot && !composerRoot.contains(button)) {
            return -1;
        }

        if (button.closest && button.closest('#cgas-widget')) {
            return -1;
        }

        const label = textOf(button);
        const ariaLabel = String(button.getAttribute('aria-label') || '');
        const title = String(button.getAttribute('title') || '');
        const dataTestId = String(button.getAttribute('data-testid') || '');
        const classes = String(button.getAttribute('class') || '');
        const combined = normalizeSpace([label, ariaLabel, title, dataTestId, classes].join(' '));

        if (combined && TRANSCRIPTION_BAD_FINISH_LABEL_RE.test(combined)) {
            return -1;
        }

        let score = 0;
        if (combined && TRANSCRIPTION_FINISH_LABEL_RE.test(combined)) {
            score += 220;
        }
        if (/stop\s+dictation|end\s+dictation|stop\s+recording|arr[eê]ter.*dict|terminer|valider|confirmer/i.test(combined)) {
            score += 180;
        }
        if (/check|done|confirm|accept|complete|finish|valider|terminer/i.test(combined)) {
            score += 140;
        }
        if (/record|dict|voice|micro|audio|transcri/i.test(combined) && !TRANSCRIPTION_BAD_FINISH_LABEL_RE.test(combined)) {
            score += 35;
        }

        const svg = button.querySelector('svg');
        if (svg) {
            score += 18;
            const svgText = normalizeSpace(svg.getAttribute('aria-label') || svg.getAttribute('data-testid') || svg.getAttribute('class') || '');
            if (/check|done|confirm|tick/i.test(svgText)) {
                score += 120;
            }
        }

        const rect = button.getBoundingClientRect();
        if (rect.width >= 18 && rect.width <= 84 && rect.height >= 18 && rect.height <= 84) {
            score += 15;
        }

        /*
         * TOS v5.5: during ChatGPT dictation the validation control may be
         * rendered outside the normal composer root. Keep global fallback
         * conservative: only reward controls near the bottom half of the page.
         */
        if (rect.top > window.innerHeight * 0.45) {
            score += 22;
        }
        if (rect.bottom > window.innerHeight * 0.70) {
            score += 18;
        }

        return score;
    }

    function collectTranscriptionFinishCandidates(root, composerRoot, allowGlobal) {
        const selectors = [
            'button[data-testid*="done" i]',
            'button[data-testid*="finish" i]',
            'button[data-testid*="confirm" i]',
            'button[data-testid*="check" i]',
            '[role="button"][data-testid*="done" i]',
            '[role="button"][data-testid*="finish" i]',
            '[role="button"][data-testid*="confirm" i]',
            '[role="button"][data-testid*="check" i]',
            'button[aria-label*="done" i]',
            'button[aria-label*="finish" i]',
            'button[aria-label*="confirm" i]',
            'button[aria-label*="check" i]',
            'button[aria-label*="valider" i]',
            'button[aria-label*="terminer" i]',
            '[role="button"][aria-label*="done" i]',
            '[role="button"][aria-label*="finish" i]',
            '[role="button"][aria-label*="confirm" i]',
            '[role="button"][aria-label*="check" i]',
            '[role="button"][aria-label*="valider" i]',
            '[role="button"][aria-label*="terminer" i]',
            'button[title*="done" i]',
            'button[title*="finish" i]',
            'button[title*="confirm" i]',
            'button[title*="valider" i]',
            'button[title*="terminer" i]',
            'button',
            '[role="button"]'
        ];

        const candidates = [];
        const seen = new Set();
        const searchRoot = root && root.querySelectorAll ? root : document;

        for (const selector of selectors) {
            for (const button of Array.from(searchRoot.querySelectorAll(selector))) {
                if (seen.has(button)) {
                    continue;
                }
                seen.add(button);

                const score = scoreTranscriptionFinishButton(button, composerRoot, allowGlobal);
                if (score < 25) {
                    continue;
                }

                const rect = button.getBoundingClientRect();
                candidates.push({
                    button,
                    score,
                    left: rect.left,
                    right: rect.right,
                    top: rect.top,
                    bottom: rect.bottom,
                    width: rect.width,
                    height: rect.height,
                    label: textOf(button)
                });
            }
        }

        return candidates;
    }

    function chooseBestTranscriptionFinishCandidate(candidates) {
        if (!candidates || candidates.length === 0) {
            return null;
        }

        candidates.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            if (b.bottom !== a.bottom) {
                return b.bottom - a.bottom;
            }
            return b.right - a.right;
        });

        const best = candidates[0];
        const second = candidates[1];

        if (best.score >= 150) {
            return best.button;
        }

        /*
         * v5.5: accept a single low-label compact SVG/button in the lower page.
         * This is the practical equivalent of the user's "petit V" control.
         * It is intentionally only used after explicit bad labels were rejected.
         */
        const compactLower = candidates.filter((candidate) => {
            const button = candidate.button;
            const label = candidate.label;
            const lowerEnough = candidate.top > window.innerHeight * 0.45 || candidate.bottom > window.innerHeight * 0.70;
            return (
                lowerEnough &&
                (!label || label.length < 24) &&
                candidate.width >= 16 && candidate.width <= 96 &&
                candidate.height >= 16 && candidate.height <= 96 &&
                (button.querySelector('svg') || candidate.score >= 70)
            );
        });

        if (compactLower.length === 1) {
            return compactLower[0].button;
        }

        if (compactLower.length > 1) {
            compactLower.sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                if (b.bottom !== a.bottom) {
                    return b.bottom - a.bottom;
                }
                return b.right - a.right;
            });

            const first = compactLower[0];
            const secondCompact = compactLower[1];
            if (!secondCompact || first.score - secondCompact.score >= 12) {
                return first.button;
            }
        }

        if (second && Math.abs(best.score - second.score) < 20 && best.score < 120) {
            return null;
        }

        return best.score >= 70 ? best.button : null;
    }

    function findTranscriptionFinishButton() {
        const composerRoot = findComposerRoot();
        const allCandidates = [];
        const seen = new Set();

        if (composerRoot) {
            for (const candidate of collectTranscriptionFinishCandidates(composerRoot, composerRoot, false)) {
                if (!seen.has(candidate.button)) {
                    seen.add(candidate.button);
                    allCandidates.push(candidate);
                }
            }
        }

        /*
         * v5.5: global lower-screen scan. The previous working Whisper widget
         * did not need DOM button selection at all; this extension does. Live
         * testing showed RMS/VOL was OK, but the V control was not selected.
         */
        for (const candidate of collectTranscriptionFinishCandidates(document, composerRoot, true)) {
            if (seen.has(candidate.button)) {
                continue;
            }
            const lowerEnough = candidate.top > window.innerHeight * 0.42 || candidate.bottom > window.innerHeight * 0.66;
            if (!lowerEnough && candidate.score < 150) {
                continue;
            }
            seen.add(candidate.button);
            allCandidates.push(candidate);
        }

        return chooseBestTranscriptionFinishCandidate(allCandidates);
    }

    async function monitorSilenceToFinishTranscription() {
        if (!isSupportedUrl() || !flowIsActive() || !state.tosEnabled) {
            return;
        }

        const ok = await ensureAudioMonitor();
        if (!ok) {
            return;
        }

        if (pageLooksGenerating() || pageLooksReadingAloud() || readGuardActive()) {
            resetTosState();
            setStatus('TOS locked: Think/Read', true);
            return;
        }

        const rms = currentMicRms();
        const level = tosLevelFromRms(rms);
        const rmsThreshold = tosEffectiveRmsThreshold();
        const finishButton = findTranscriptionFinishButton();

        if (!finishButton) {
            if (tosLastButtonSeenAt && now() - tosLastButtonSeenAt > CONFIG.tosNoButtonResetMs) {
                resetTosState();
            }
            setStatus('TOS no V / VOL ' + level, true);
            return;
        }

        tosLastButtonSeenAt = now();

        if (now() - tosLastFinishClickAt < CONFIG.tosFinishCooldownMs) {
            return;
        }

        if (!workflowActionAllowed('transcription_request')) {
            setStatus('Dev blocked: transcription request OFF', true);
            return;
        }

        /*
         * v5.3: proven RMS silence detection, copied in spirit from the older
         * working Whisper widget:
         *   rms > threshold  => sound detected, reset silence timer
         *   rms <= threshold => silence candidate, count until Sec expires
         * THR is displayed as RMS × 1000. Therefore THR 10 equals 0.01.
         */
        if (rms > rmsThreshold) {
            tosVoiceSeen = true;
            tosSilenceSince = 0;
            setStatus('Sound VOL ' + level + ' > THR ' + state.tosThreshold, true);
            return;
        }

        if (!tosSilenceSince) {
            tosSilenceSince = now();
            setStatus('Silence ' + state.tosSeconds + 's / VOL ' + level, true);
            return;
        }

        const silenceMs = now() - tosSilenceSince;
        const remainingMs = Math.max(0, (state.tosSeconds * 1000) - silenceMs);
        if (remainingMs > 0) {
            setStatus('Silence ' + Math.ceil(remainingMs / 1000) + 's / VOL ' + level, true);
            return;
        }

        if (!tosVoiceSeen) {
            tosSilenceSince = now();
            setStatus('TOS waiting voice / VOL ' + level, true);
            return;
        }

        try {
            setWorkflowStep('transcription_request');
            finishButton.click();
            tosLastFinishClickAt = now();
            resetTosState();
            setStatus('TOS clicked V / VOL ' + level, true);
        } catch (error) {
            setStatus('TOS failed: ' + error.message);
        }
    }




    async function clickReadAloudStopControl() {
        const readStopButton = findReadAloudStopButton();
        if (!readStopButton || !isElementVisible(readStopButton)) {
            return false;
        }

        readStopButton.click();
        return true;
    }

    async function clickTranscriptionFinishNow(reason) {
        if (!workflowActionAllowed('transcription_request')) {
            setStatus('Dev blocked: transcription request OFF');
            return false;
        }

        const finishButton = findTranscriptionFinishButton();
        if (!finishButton) {
            setStatus('No transcription V button');
            return false;
        }

        try {
            setWorkflowStep('transcription_request');
            finishButton.click();
            tosLastFinishClickAt = now();
            resetTosState();
            setStatus(reason || 'Transcription requested');
            return true;
        } catch (error) {
            setStatus('Transcription request failed: ' + error.message);
            return false;
        }
    }

    async function sendComposerTextNow(reason) {
        if (!workflowActionAllowed('send_to_chatgpt')) {
            setStatus('Dev blocked: send step OFF');
            return false;
        }

        const composerText = getComposerText();
        const sendButton = composerText ? findSendButton() : null;

        if (!sendButton) {
            setStatus('No sendable composer text');
            return false;
        }

        try {
            noteSendCycleStart();
            sendButton.click();
            lastSentHash = hashText(composerText);
            lastSendAt = now();
            setWorkflowStep('thinking');
            setStatus(reason || 'Sent to ChatGPT');
            return true;
        } catch (error) {
            setStatus('Send failed: ' + error.message);
            return false;
        }
    }

    async function startReadAloudNow(reason) {
        if (!workflowActionAllowed('read_aloud')) {
            setStatus('Dev blocked: read step OFF');
            return false;
        }

        const latest = getLatestAssistantMessage();

        if (!latest || !latest.text || latestUserIsAfterAssistant(latest) || pageLooksGenerating()) {
            setStatus('No ready assistant answer');
            return false;
        }

        try {
            const ok = await clickReadAloudForLatest(latest);
            if (!ok) {
                setStatus('Read aloud control not found');
                return false;
            }

            const currentHash = hashText(latest.text);
            markReadStarted(currentHash, latest.text);
            setStatus(reason || 'Read aloud started');

            if (state.autoLoop) {
                restartVoiceInputAfterRead(latest, currentHash);
            }

            return true;
        } catch (error) {
            setStatus('Read aloud failed: ' + error.message);
            return false;
        }
    }

    async function stopCurrentFlow(reason) {
        bumpAutomationEpoch(reason || 'manual-stop');
        resetTosState();
        loopRunning = false;
        readRunning = false;
        manualNextInProgress = false;

        if (pageLooksReadingAloud() || readGuardActive()) {
            const clicked = await clickReadAloudStopControl();
            if (clicked) {
                await sleep(CONFIG.manualNextDelayMs);
                await waitUntilReadingLooksStopped(6500);
            }
            markReadCompleted(lastReadStartedHash || lastReadHash || '');
            readGuardUntil = 0;
            setCurrentStep('idle');
            setStatus(clicked ? 'Stopped Read aloud' : 'Stop: read control missing');
            return;
        }

        if (pageLooksGenerating()) {
            const stopGeneratingButton = findGeneratingStopButton();
            if (stopGeneratingButton) {
                stopGeneratingButton.click();
                await waitUntilGeneratingLooksStopped(6500);
                responseCycleOpen = false;
                responseCycleHash = '';
                lastReadCompletedHash = '';
                setCurrentStep('idle');
                setStatus('Stopped Think/Writing');
                return;
            }
            setStatus('Stop: generating control missing');
            return;
        }

        if (findTranscriptionFinishButton()) {
            setWorkflowStep('voice_recording');
            setStatus('Stop: voice recording visible; use ChatGPT control if needed');
            return;
        }

        setCurrentStep('idle');
        setStatus('Stopped');
    }


    async function waitUntilReadingLooksStopped(timeoutMs) {
        const started = now();
        while (now() - started < timeoutMs) {
            if (!pageLooksReadingAloud()) {
                return true;
            }
            await sleep(300);
        }
        return !pageLooksReadingAloud();
    }

    async function clickVoiceInputNow(reason, options = {}) {
        const allowDuringThink = Boolean(options.allowDuringThink);
        const ignoreResponseCycle = Boolean(options.ignoreResponseCycle);

        if (!flowIsActive()) {
            setStatus('Flow OFF');
            return false;
        }
        if (!state.autoLoop && !options.ignoreStartToggle) {
            setStatus('Start transcription OFF');
            return false;
        }
        if (!workflowActionAllowed('voice_record_start')) {
            setStatus('Dev blocked: start recording OFF');
            return false;
        }
        if (String(reason || '').toLowerCase().includes('loop') && !workflowActionAllowed('loop_restart')) {
            setStatus('Dev blocked: loop restart OFF');
            return false;
        }
        if (!allowDuringThink && !ignoreResponseCycle && (answerStillPendingAfterSend() || (responseCycleOpen && !lastReadCompletedHash))) {
            setStatus('Next blocked: waiting response/read');
            return false;
        }
        if (!allowDuringThink && pageLooksGenerating()) {
            setStatus('Next blocked: thinking');
            return false;
        }
        if (pageLooksReadingAloud() || readGuardActive()) {
            setStatus('Next blocked: still reading');
            return false;
        }
        const microphoneButton = findVoiceInputButton();
        if (!microphoneButton) {
            setStatus('Mic button not found');
            return false;
        }
        setCurrentStep('transcript');
        microphoneButton.click();
        lastMicClickAt = now();
        setStatus(reason || 'Transcription started');
        return true;
    }

    async function goToNextStep() {
        if (manualNextInProgress) {
            setStatus('Next already running');
            return;
        }

        if (!flowIsActive()) {
            setStatus('Flow OFF');
            return;
        }

        manualNextInProgress = true;
        try {
            const finishButton = findTranscriptionFinishButton();
            if (finishButton) {
                try {
                    setCurrentStep('send');
                    finishButton.click();
                    tosLastFinishClickAt = now();
                    resetTosState();
                    setStatus('Next: V clicked');
                } catch (error) {
                    setStatus('Next V failed: ' + error.message);
                }
                return;
            }

            const visibleStep = inferCurrentStepFromPage();
            const readLooksActive = visibleStep === 'read' || pageLooksReadingAloud() || readGuardActive();

            if (readLooksActive) {
                try {
                    bumpAutomationEpoch('manual-next-stop-read');
                    const clickedStop = await clickReadAloudStopControl();
                    if (!clickedStop) {
                        setStatus('Next blocked: Read Stop missing');
                        return;
                    }
                    setStatus('Stopping Read aloud…');
                    await sleep(CONFIG.manualNextDelayMs);
                    const stopped = await waitUntilReadingLooksStopped(6500);
                    if (!stopped || pageLooksReadingAloud()) {
                        setStatus('Next blocked: read still active');
                        return;
                    }
                    markReadCompleted(lastReadStartedHash || lastReadHash || '');
                    readGuardUntil = 0;
                    setStatus('Read aloud stopped');
                    if (state.autoLoop) {
                        await clickVoiceInputNow('Next: transcription', { ignoreResponseCycle: true });
                    } else {
                        setCurrentStep('idle');
                        setStatus('Next: Start Transcription OFF');
                    }
                } catch (error) {
                    setStatus('Next failed: ' + error.message);
                }
                return;
            }

            if (visibleStep === 'think' || pageLooksGenerating()) {
                const stopGeneratingButton = findGeneratingStopButton();
                if (!stopGeneratingButton) {
                    setStatus('Next blocked: Stop generating missing');
                    return;
                }

                bumpAutomationEpoch('manual-next-stop-think');
                try {
                    stopGeneratingButton.click();
                    setStatus('Stopping Think…');
                    const stopped = await waitUntilGeneratingLooksStopped(6500);
                    if (!stopped || pageLooksGenerating()) {
                        setStatus('Next blocked: still thinking');
                        return;
                    }
                    responseCycleOpen = false;
                    responseCycleHash = '';
                    lastReadCompletedHash = '';
                    readGuardUntil = 0;
                    setStatus('Think stopped');
                    if (state.autoLoop) {
                        await clickVoiceInputNow('Next: transcription', { allowDuringThink: true, ignoreResponseCycle: true });
                    } else {
                        setCurrentStep('idle');
                        setStatus('Next: Start Transcription OFF');
                    }
                } catch (error) {
                    setStatus('Next Think failed: ' + error.message);
                }
                return;
            }

            const composerText = getComposerText();
            const sendButton = composerText ? findSendButton() : null;
            if (sendButton) {
                try {
                    setCurrentStep('send');
                    noteSendCycleStart();
                    sendButton.click();
                    lastSentHash = hashText(composerText);
                    lastSendAt = now();
                    setCurrentStep('think');
                    setStatus('Next: sent, thinking');
                } catch (error) {
                    setStatus('Next send failed: ' + error.message);
                }
                return;
            }

            const latest = getLatestAssistantMessage();
            if (latest && latest.text && !latestUserIsAfterAssistant(latest) && !pageLooksGenerating()) {
                try {
                    const ok = await clickReadAloudForLatest(latest);
                    if (ok) {
                        const currentHash = hashText(latest.text);
                        markReadStarted(currentHash, latest.text);
                        setStatus('Next: Read aloud');
                        if (state.autoLoop) {
                            restartVoiceInputAfterRead(latest, currentHash);
                        }
                        return;
                    }
                } catch (error) {
                    setStatus('Next read failed: ' + error.message);
                    return;
                }
            }

            if (state.autoLoop) {
                await clickVoiceInputNow('Next: transcription');
            } else {
                setStatus('Next: Start Transcription OFF');
            }
        } finally {
            manualNextInProgress = false;
        }
    }


    function setupMessages() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (!message || typeof message !== 'object') {
                return false;
            }

            if (message.type === 'CGAS_PING') {
                sendResponse({ ok: true, version: VERSION });
                return false;
            }

            if (message.type === 'CGAS_TOGGLE_WIDGET') {
                if (state.widgetVisible && state.widgetMinimized) {
                    state.widgetMinimized = false;
                    saveStatePatch({ widgetVisible: true, widgetMinimized: false });
                    createWidget();
                    updateWidget();
                    sendResponse({ ok: true, visible: true, minimized: false });
                    return false;
                }

                state.widgetVisible = !state.widgetVisible;
                if (!state.widgetVisible) {
                    bumpAutomationEpoch('widget-hidden');
                    resetTosState();
                    stopAudioMonitor();
                    setCurrentStep('idle');
                } else if (state.flowEnabled && state.tosEnabled) {
                    ensureAudioMonitor();
                }
                if (!state.widgetVisible) {
                    state.widgetMinimized = false;
                }
                saveStatePatch({ widgetVisible: state.widgetVisible, widgetMinimized: state.widgetMinimized });
                createWidget();
                updateWidget();
                sendResponse({ ok: true, visible: state.widgetVisible, minimized: state.widgetMinimized });
                return false;
            }

            if (message.type === 'CGAS_SHOW_WIDGET') {
                state.widgetVisible = true;
                state.widgetMinimized = false;
                if (state.flowEnabled && state.tosEnabled) {
                    ensureAudioMonitor();
                }
                saveStatePatch({ widgetVisible: true, widgetMinimized: false });
                createWidget();
                updateWidget();
                sendResponse({ ok: true, visible: true, minimized: false });
                return false;
            }

            return false;
        });
    }

    async function boot() {
        if (!isSupportedUrl()) {
            return;
        }

        await loadState();
        createWidget();
        setupWidgetSelfHeal();
        setupMessages();

        window.setInterval(monitorComposer, CONFIG.monitorMs);
        window.setInterval(refreshCurrentStepFromPage, 700);
        window.setInterval(() => {
            monitorAssistantForReadAloud();
        }, CONFIG.readMonitorMs);

        window.setInterval(() => {
            monitorSilenceToFinishTranscription();
        }, CONFIG.tosMonitorMs);

        window.__CGAS_STOP_RUNTIME__ = function stopRuntimeFromConsole() {
            bumpAutomationEpoch('runtime-stop');
            resetTosState();
            stopAudioMonitor();
            setCurrentStep('idle');
            setStatus('Runtime stopped');
        };

        window.addEventListener('beforeunload', stopAudioMonitor);

        setStatus('Ready');
    }

    boot();
}());
