/**
 * ============================================================================
 * PATH         : ./background.js
 * SCRIPT NAME  : background.js
 * AUTHOR       : Bruno DELNOZ
 * EMAIL        : bruno.delnoz@protonmail.com
 * TARGET USAGE : Manifest V3 action toggler for ChatGPT VTT-TTV Flow extension
 * VERSION      : v8.3.1
 * DATE         : 2026-06-03 21:35
 * ============================================================================
 * CHANGELOG:
 *   v1.0.0 – 2026-06-03 07:05 – Bruno DELNOZ
 *       Added:
 *       - Initial minimal runtime action toggler.
 *       - Injected ChatGPT Auto-send content script and CSS.
 *   v1.1.0 – 2026-06-03 07:30 – Bruno DELNOZ
 *       Added:
 *       - Kept extension-icon toggle behavior.
 *       - Added support for the updated content script with Auto Read Aloud.
 *   v1.2.0 – 2026-06-03 08:05 – Bruno DELNOZ
 *       Added:
 *       - Added support for Auto Loop runtime with voice input restart.
 *   v1.2.1 – 2026-06-03 14:55 – Bruno DELNOZ
 *       Changed:
 *       - Bumped runtime version for stricter Loop microphone selection.
 *   v4.2.0 – 2026-06-03 15:11 – Bruno DELNOZ
 *       Added:
 *       - Added TOS runtime support marker for microphone-based silence flow.
 *       - Added audioCapture permission in manifest for real silence detection.
 *   v5.0.0 – 2026-06-03 16:05 – Bruno DELNOZ
 *       Added:
 *       - Added support marker for manual THR threshold control.
 *       - Added red action/default extension icons through manifest.
 *   v5.1.0 – 2026-06-03 16:35 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped runtime for widget click event-shield correction.
 *   v5.2.0 – 2026-06-03 17:05 – Bruno DELNOZ
 *       Changed:
 *       - Bumped runtime for TOS 0–30s range and visible VOL meter.
 *   v5.3.0 – 2026-06-03 17:32 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped runtime for proven RMS-based TOS silence detection.
 *   v5.4.0 – 2026-06-03 18:05 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped runtime for TOS finish-button and Send-independent testing fixes.
 *   v5.5.0 – 2026-06-03 19:05 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped runtime for lower-screen / role=button TOS finish-control detection.
 *   v6.0.0 – 2026-06-03 19:35 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped runtime for guarded Read aloud completion before Loop microphone restart.
 *   v6.1.0 – 2026-06-03 19:35 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped runtime for early microphone restart guards while ChatGPT is still thinking or reading.
 *   v6.2.0 – 2026-06-03 20:20 – Bruno DELNOZ
 *       Changed:
 *       - Renamed extension UI from Auto-send/Loop wording to VTT-TTV Flow wording.
 *       - Updated manifest-facing name and title.
 *   v8.0.0 – 2026-06-03 20:45 – Bruno DELNOZ
 *       Added:
 *       - Bumped runtime for Flow On/Off, Next step and step indicators.
 *   v8.1.0 – 2026-06-03 21:20 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped runtime for complete v8.0 widget stabilization.
 *       - Kept the same feature set while forcing safe OFF defaults on upgrade.

 *   v8.3.1 – 2026-06-03 22:05 – Bruno DELNOZ
 *       Fixed:
 *       - Fixed visible extension version metadata mismatch.
 *   v8.2.0 – 2026-06-03 21:35 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped runtime for corrected visible step-state indicators.
 *       - Kept the complete v8 feature set unchanged.
 * ============================================================================
 */

'use strict';

const CGAS_BACKGROUND_VERSION = '8.3.1';
const SUPPORTED_ORIGIN_RE = /^https:\/\/(chatgpt\.com|chat\.openai\.com)\//;

function isSupportedUrl(url) {
    return typeof url === 'string' && SUPPORTED_ORIGIN_RE.test(url);
}

async function sendToTab(tabId, message) {
    return chrome.tabs.sendMessage(tabId, message);
}

async function injectRuntime(tabId) {
    await chrome.scripting.insertCSS({
        target: { tabId },
        files: ['autosend-style.css']
    });

    await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content-autosend.js']
    });
}

async function toggleWidget(tab) {
    if (!tab || !tab.id || !isSupportedUrl(tab.url || '')) {
        return;
    }

    try {
        await sendToTab(tab.id, { type: 'CGAS_TOGGLE_WIDGET' });
        return;
    } catch (error) {
        console.log('[CGAS Background] Content script unavailable, injecting:', error.message);
    }

    try {
        await injectRuntime(tab.id);
        await sendToTab(tab.id, { type: 'CGAS_SHOW_WIDGET' });
    } catch (error) {
        console.error('[CGAS Background] Injection/toggle failed:', error);
    }
}

chrome.action.onClicked.addListener((tab) => {
    toggleWidget(tab);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || typeof message !== 'object') {
        return false;
    }

    if (message.type === 'CGAS_BACKGROUND_PING') {
        sendResponse({
            ok: true,
            version: CGAS_BACKGROUND_VERSION,
            tabId: sender && sender.tab ? sender.tab.id : null
        });
        return false;
    }

    return false;
});
