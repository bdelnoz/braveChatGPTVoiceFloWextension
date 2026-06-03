/**
 * ============================================================================
 * PATH         : ./content-autosend.js
 * SCRIPT NAME  : content-autosend.js
 * AUTHOR       : Bruno DELNOZ
 * EMAIL        : bruno.delnoz@protonmail.com
 * TARGET USAGE : ChatGPT Web Voice-to-text / Text-to-voice flow helper
 * VERSION      : v8.0.0
 * DATE         : 2026-06-03 20:45
 * ============================================================================
 * CHANGELOG:
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
 * ============================================================================
 */

(function initChatGPTAutoSendAndReadAloud() {
    'use strict';

    if (window.__CGAS_AUTOSEND_LOADED__) {
        return;
    }

    window.__CGAS_AUTOSEND_LOADED__ = true;

    const VERSION = '8.0.0';
    const SUPPORTED_ORIGIN_RE = /^https:\/\/(chatgpt\.com|chat\.openai\.com)\//;

    const STORAGE_KEYS = Object.freeze({
        autoSend: 'cgas.autoSend.enabled',
        autoRead: 'cgas.autoRead.enabled',
        autoLoop: 'cgas.autoLoop.enabled',
        widgetVisible: 'cgas.widget.visible',
        widgetLeft: 'cgas.widget.left',
        widgetTop: 'cgas.widget.top',
        flowEnabled: 'cgas.flow.enabled',
        labelsExpanded: 'cgas.widget.labelsExpanded',
        tosEnabled: 'cgas.tos.enabled',
        tosSeconds: 'cgas.tos.seconds',
        tosThreshold: 'cgas.tos.threshold'
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
        manualNextDelayMs: 900
    });

    const READ_LABEL_RE = /\bread aloud\b|\bread response\b|\blisten\b|lire\s+(à|a)\s+voix\s+haute|lire\s+la\s+r[eé]ponse|lecture\s+audio|écouter|ecouter/i;
    const READ_ACTIVE_LABEL_RE = /stop\s+reading|pause\s+reading|stop\s+audio|pause\s+audio|arr[eê]ter\s+(la\s+)?lecture|mettre.*pause|pause|reprendre\s+la\s+lecture/i;
    const MIC_LABEL_RE = /dictate|dictation|start\s+dictation|microphone|\bmic\b|dicter|dictée|dictee|micro|saisie\s+vocale|entrée\s+vocale|transcription\s+vocale/i;
    const BAD_MIC_LABEL_RE = /send|envoyer|submit|attach|upload|file|image|search|tool|reason|model|read\s+aloud|lire|stop\s+generating|stop\s+reading|pause|resume|cancel|annuler|voice\s*mode|conversation|conversationnel|advanced\s+voice|live\s+voice|start\s+voice|open\s+voice|audio\s+mode|call|appel/i;
    const MORE_LABEL_RE = /\bmore\b|more actions|options|menu|actions|ouvrir.*menu|plus|autres|\.\.\.|…/i;
    const SEND_LABEL_RE = /\bsend\b|envoyer|submit/i;
    const BAD_SEND_LABEL_RE = /stop|arr[eê]ter|cancel|annuler|voice|dictation|micro|audio|upload|attach|tool|search|reason|model/i;
    const GENERATING_LABEL_RE = /stop generating|stop streaming|arr[eê]ter|interrompre|continuer|continue generating/i;
    const TRANSCRIPTION_FINISH_LABEL_RE = /done|finish|finished|complete|confirm|accept|check|submit\s+dictation|end\s+dictation|stop\s+dictation|stop\s+recording|valider|terminer|confirmer|accepter|finir|arr[eê]ter\s+(la\s+)?dict[eé]e|arr[eê]ter\s+(l['’]?)enregistrement/i;
    const TRANSCRIPTION_BAD_FINISH_LABEL_RE = /cancel|close|dismiss|delete|remove|clear|send|envoyer|submit\s+message|attach|upload|file|image|search|tool|reason|model|read\s+aloud|lire|voice\s*mode|conversation|conversationnel|advanced\s+voice|live\s+voice|start\s+voice|open\s+voice|audio\s+mode|call|appel/i;

    let state = {
        flowEnabled: true,
        autoSend: false,
        autoRead: false,
        autoLoop: false,
        tosEnabled: false,
        tosSeconds: 10,
        tosThreshold: 35,
        widgetVisible: true,
        labelsExpanded: false,
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

    function setCurrentStep(step) {
        currentStep = step || 'idle';
        updateStepIndicator();
    }

    function updateStepIndicator() {
        const map = {
            send: 'cgas-step-send',
            read: 'cgas-step-read',
            transcript: 'cgas-step-transcript'
        };

        for (const [step, id] of Object.entries(map)) {
            const dot = document.getElementById(id);
            if (dot) {
                dot.classList.toggle('cgas-step-active', currentStep === step);
            }
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

        state.flowEnabled = boolFromStored(stored[STORAGE_KEYS.flowEnabled], true);
        state.autoSend = boolFromStored(stored[STORAGE_KEYS.autoSend], false);
        state.autoRead = boolFromStored(stored[STORAGE_KEYS.autoRead], false);
        state.autoLoop = boolFromStored(stored[STORAGE_KEYS.autoLoop], false);
        state.tosEnabled = boolFromStored(stored[STORAGE_KEYS.tosEnabled], false);
        const storedTos = Number(stored[STORAGE_KEYS.tosSeconds]);
        state.tosSeconds = clampTosSeconds(Number.isFinite(storedTos) ? storedTos : CONFIG.tosDefaultSeconds);
        const storedThreshold = Number(stored[STORAGE_KEYS.tosThreshold]);
        state.tosThreshold = clampTosThreshold(Number.isFinite(storedThreshold) ? storedThreshold : CONFIG.tosDefaultThreshold);
        state.widgetVisible = boolFromStored(stored[STORAGE_KEYS.widgetVisible], true);
        state.labelsExpanded = boolFromStored(stored[STORAGE_KEYS.labelsExpanded], false);

        const left = Number(stored[STORAGE_KEYS.widgetLeft]);
        const top = Number(stored[STORAGE_KEYS.widgetTop]);
        state.widgetLeft = Number.isFinite(left) ? left : null;
        state.widgetTop = Number.isFinite(top) ? top : null;
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
        if (Object.prototype.hasOwnProperty.call(patch, 'widgetVisible')) {
            values[STORAGE_KEYS.widgetVisible] = Boolean(patch.widgetVisible);
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

        const yes = createButton('Yes', 'cgas-choice', yesHandler);
        yes.id = yesId;
        row.appendChild(yes);

        const no = createButton('No', 'cgas-choice', noHandler);
        no.id = noId;
        row.appendChild(no);

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
            'sec',
            'silence seconds',
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
            'thr',
            'volume threshold',
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
            }, false);
        }
    }



    function createFlowMasterRow() {
        const row = document.createElement('div');
        row.id = 'cgas-flow-master-row';

        const label = createLabel(
            'cgas-label-flow',
            'Flow',
            'Flow enabled',
            'Global kill switch. When OFF, no automatic action runs even if rows below stay configured.'
        );
        row.appendChild(label);

        const on = createButton('On', 'cgas-choice cgas-flow-choice', () => setFlowEnabled(true));
        on.id = 'cgas-flow-on';
        row.appendChild(on);

        const off = createButton('Off', 'cgas-choice cgas-flow-choice', () => setFlowEnabled(false));
        off.id = 'cgas-flow-off';
        row.appendChild(off);

        return row;
    }

    function createNextStepRow() {
        const row = document.createElement('div');
        row.id = 'cgas-next-row';

        const button = createButton('Next step', 'cgas-next-button', () => {
            goToNextStep();
        });
        button.id = 'cgas-next-step';
        button.title = 'Manual flow advance: validate transcription, send text, start Read aloud, or restart transcription depending on the current visible state.';
        row.appendChild(button);

        return row;
    }

    function createStepIndicatorRow() {
        const row = document.createElement('div');
        row.id = 'cgas-step-indicators';

        const steps = [
            ['cgas-step-send', 'Send', 'Send transcription step'],
            ['cgas-step-read', 'Read', 'Read aloud step'],
            ['cgas-step-transcript', 'VTT', 'Start transcription step']
        ];

        for (const [id, label, title] of steps) {
            const item = document.createElement('div');
            item.className = 'cgas-step-indicator-item';
            item.title = title;

            const dot = document.createElement('span');
            dot.id = id;
            dot.className = 'cgas-step-dot';
            item.appendChild(dot);

            const text = document.createElement('span');
            text.textContent = label;
            item.appendChild(text);

            row.appendChild(item);
        }

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

        const dragbar = document.createElement('div');
        dragbar.id = 'cgas-dragbar';

        const title = document.createElement('div');
        title.id = 'cgas-title';
        title.textContent = 'Voice Flow';
        dragbar.appendChild(title);

        const modeToggle = createButton('Full', 'cgas-header-button', () => {
            state.labelsExpanded = !state.labelsExpanded;
            saveStatePatch({ labelsExpanded: state.labelsExpanded });
            updateWidget();
        });
        modeToggle.id = 'cgas-label-mode-toggle';
        modeToggle.title = 'Switch between compact labels and full explanatory labels.';
        dragbar.appendChild(modeToggle);

        const close = createButton('×', '', () => {
            state.widgetVisible = false;
            resetTosState();
            stopAudioMonitor();
            setCurrentStep('idle');
            saveStatePatch({ widgetVisible: false });
            updateWidget();
        });
        close.id = 'cgas-close';
        close.title = 'Hide widget. Click the extension icon to show it again.';
        dragbar.appendChild(close);

        widget.appendChild(dragbar);

        widget.appendChild(createFlowMasterRow());
        widget.appendChild(createNextStepRow());
        widget.appendChild(createStepIndicatorRow());

        widget.appendChild(createRow(
            'cgas-label-send',
            'Send tr.',
            'Send transcription',
            'cgas-send-yes',
            'cgas-send-no',
            () => setAutoSend(true),
            () => setAutoSend(false),
            'Automatically send the transcript after ChatGPT validates voice-to-text.'
        ));

        widget.appendChild(createRow(
            'cgas-label-read',
            'Read',
            'Read aloud from ChatGPT',
            'cgas-read-yes',
            'cgas-read-no',
            () => setAutoRead(true),
            () => setAutoRead(false),
            'Automatically start ChatGPT Read aloud on the latest assistant response.'
        ));

        widget.appendChild(createRow(
            'cgas-label-loop',
            'Start tr.',
            'Start transcription',
            'cgas-loop-yes',
            'cgas-loop-no',
            () => setAutoLoop(true),
            () => setAutoLoop(false),
            'After Read aloud ends, restart ChatGPT voice-to-text transcription.'
        ));

        widget.appendChild(createRow(
            'cgas-label-tos',
            'T.O.S.',
            'Time of silence',
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
        volumeLabel.dataset.shortText = 'vol';
        volumeLabel.dataset.longText = 'microphone volume';
        volumeLabel.textContent = 'vol';
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

        const title = document.getElementById('cgas-title');
        if (title) {
            title.textContent = state.labelsExpanded
                ? 'Voice to text / text to voice ChatGPT flow'
                : 'Voice Flow';
        }

        const toggle = document.getElementById('cgas-label-mode-toggle');
        if (toggle) {
            toggle.textContent = state.labelsExpanded ? 'Mini' : 'Full';
            toggle.title = state.labelsExpanded
                ? 'Switch to compact labels.'
                : 'Switch to full explanatory labels.';
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
        updateStepIndicator();

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
            resetTosState();
            stopAudioMonitor();
            setCurrentStep('idle');
            updateWidget();
            setStatus('Flow OFF');
        } else {
            if (state.tosEnabled) {
                ensureAudioMonitor();
            }
            updateWidget();
            setStatus('Flow ON');
        }
    }

    function setAutoSend(enabled) {
        state.autoSend = Boolean(enabled);
        saveStatePatch({ autoSend: state.autoSend });
        updateWidget();
        setStatus(state.autoSend ? 'Send transcript ON' : 'Send transcript OFF');
    }

    function setAutoRead(enabled) {
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
        state.autoLoop = Boolean(enabled);
        saveStatePatch({ autoLoop: state.autoLoop });
        updateWidget();
        setStatus(state.autoLoop ? 'Start transcription ON' : 'Start transcription OFF');
    }

    function setTosEnabled(enabled) {
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
            sendButton.click();
            lastSentHash = textHash;
            lastSendAt = now();
            setStatus('Transcript sent automatically');
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

        if (latestUserIsAfterAssistant(latest)) {
            setStatus('Waiting assistant answer');
            return;
        }

        const currentHash = hashText(latest.text);
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

        if (pageLooksGenerating()) {
            return;
        }

        readRunning = true;
        try {
            const ok = await clickReadAloudForLatest(latest);
            if (ok) {
                setCurrentStep('read');
                lastReadHash = currentHash;
                lastReadAt = now();
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


    function pageLooksReadingAloud() {
        const controls = Array.from(document.querySelectorAll('button, [role="button"], [role="menuitem"]'));
        for (const control of controls) {
            if (!isElementVisible(control)) {
                continue;
            }
            const label = textOf(control);
            if (READ_ACTIVE_LABEL_RE.test(label)) {
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

    async function waitForReadAloudCompletion(text) {
        const started = now();
        const estimatedWait = estimateReadMs(text);
        const maxWait = Math.min(CONFIG.loopMaxReadWaitMs, Math.max(estimatedWait + 15000, 18000));
        let sawActiveReadState = false;
        let inactiveSince = 0;

        await sleep(1200);

        while (now() - started < maxWait) {
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
                return true;
            }

            setStatus('Reading estimate… restart locked');
            await sleep(CONFIG.loopMonitorMs);
        }

        await sleep(CONFIG.loopPostReadSafetyMs);
        return true;
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
            setStatus('Waiting read end…');
            await waitForReadAloudCompletion(latest && latest.text ? latest.text : '');

            if (!state.autoLoop) {
                setStatus('Restart VTT OFF');
                return;
            }

            if (!latestAssistantHashMatches(currentHash)) {
                setStatus('Restart locked: stale answer');
                return;
            }

            const latestNow = getLatestAssistantMessage();
            if (latestUserIsAfterAssistant(latestNow)) {
                setStatus('Restart locked: pending reply');
                return;
            }

            if (pageLooksGenerating()) {
                setStatus('Restart locked: thinking');
                return;
            }

            if (pageLooksReadingAloud()) {
                setStatus('Restart locked: still reading');
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

        try {
            setCurrentStep('send');
            finishButton.click();
            tosLastFinishClickAt = now();
            resetTosState();
            setStatus('TOS clicked V / VOL ' + level, true);
        } catch (error) {
            setStatus('TOS failed: ' + error.message);
        }
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

    async function clickVoiceInputNow(reason) {
        if (!flowIsActive()) {
            setStatus('Flow OFF');
            return false;
        }
        if (pageLooksGenerating()) {
            setStatus('Next blocked: thinking');
            return false;
        }
        if (pageLooksReadingAloud()) {
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
        if (!flowIsActive()) {
            setStatus('Flow OFF');
            return;
        }

        const activeReadButton = findButtonByLabel(document, READ_ACTIVE_LABEL_RE);
        if (activeReadButton && isElementVisible(activeReadButton)) {
            try {
                activeReadButton.click();
                setStatus('Read aloud skipped');
                await sleep(CONFIG.manualNextDelayMs);
                await waitUntilReadingLooksStopped(5000);
                if (state.autoLoop) {
                    await clickVoiceInputNow('Next: transcription');
                }
            } catch (error) {
                setStatus('Next failed: ' + error.message);
            }
            return;
        }

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

        const composerText = getComposerText();
        const sendButton = composerText ? findSendButton() : null;
        if (sendButton) {
            try {
                setCurrentStep('send');
                sendButton.click();
                lastSentHash = hashText(composerText);
                lastSendAt = now();
                setStatus('Next: sent');
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
                    setCurrentStep('read');
                    lastReadHash = hashText(latest.text);
                    lastReadAt = now();
                    setStatus('Next: Read aloud');
                    if (state.autoLoop) {
                        restartVoiceInputAfterRead(latest, lastReadHash);
                    }
                    return;
                }
            } catch (error) {
                setStatus('Next read failed: ' + error.message);
                return;
            }
        }

        await clickVoiceInputNow('Next: transcription');
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
                state.widgetVisible = !state.widgetVisible;
                if (!state.widgetVisible) {
                    resetTosState();
                    stopAudioMonitor();
                    setCurrentStep('idle');
                } else if (state.flowEnabled && state.tosEnabled) {
                    ensureAudioMonitor();
                }
                saveStatePatch({ widgetVisible: state.widgetVisible });
                createWidget();
                updateWidget();
                sendResponse({ ok: true, visible: state.widgetVisible });
                return false;
            }

            if (message.type === 'CGAS_SHOW_WIDGET') {
                state.widgetVisible = true;
                if (state.flowEnabled && state.tosEnabled) {
                    ensureAudioMonitor();
                }
                saveStatePatch({ widgetVisible: true });
                createWidget();
                updateWidget();
                sendResponse({ ok: true, visible: true });
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
        setupMessages();

        window.setInterval(monitorComposer, CONFIG.monitorMs);
        window.setInterval(() => {
            monitorAssistantForReadAloud();
        }, CONFIG.readMonitorMs);

        window.setInterval(() => {
            monitorSilenceToFinishTranscription();
        }, CONFIG.tosMonitorMs);

        window.addEventListener('beforeunload', stopAudioMonitor);

        setStatus('Ready');
    }

    boot();
}());
