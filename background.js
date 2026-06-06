/**
 * ============================================================================
 * PATH         : ./background.js
 * SCRIPT NAME  : background.js
 * AUTHOR       : Bruno DELNOZ
 * EMAIL        : bruno.delnoz@protonmail.com
 * TARGET USAGE : Manifest V3 action toggler for ChatGPT VTT-TTV Flow extension
 * VERSION      : v11.3.0
 * DATE         : 2026-06-06 04:55
 * ============================================================================
 * CHANGELOG:
 *   v11.3.0 – 2026-06-06 04:55 – Bruno DELNOZ
 *       Changed:
 *       - Version synchronization for mini button widget package.
 *   v11.2.0 – 2026-06-05 14:35 – Bruno DELNOZ
 *       Added:
 *       - Added Native Messaging developer update bridge.
 *       - Added background update request handler.
 *       - Added post-reload ChatGPT tab refresh to reduce manual clicks.
 *   v11.1.0 – 2026-06-05 13:20 – Bruno DELNOZ
 *       Fixed:
 *       - Version sync for Developer Mode ON/OFF control fix.
 *   v11.0.0 – 2026-06-05 12:15 – Bruno DELNOZ
 *       Added:
 *       - Added background-side CGAS_RELOAD_EXTENSION handler.
 *       - Added runtime reload support for the Developer Mode reload button.
 *   v10.2.0 – 2026-06-05 19:35 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped background package for Developer Mode reset and compact layout fix.
 *   v10.1.0 – 2026-06-05 18:35 – Bruno DELNOZ
 *       Fixed:
 *       - Version bump for manifest import fix and Developer Mode step selector package.
 *   v10.1.0 – 2026-06-05 18:10 – Bruno DELNOZ
 *       Changed:
 *       - Runtime package bump for the developer state-machine rebuild.
 *       - Keeps v8.8 as code base and uses v9.0 changelog fixes as reference.
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



 *   v8.8.0 – 2026-06-04 00:35 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped runtime for hardened Think/Read/Next handling.
 *   v8.7.0 – 2026-06-03 23:20 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped runtime for Think/Read/Next step guard corrections and grouped step pills.
 *   v8.5.0 – 2026-06-03 22:55 – Bruno DELNOZ
 *       Changed:
 *       - Bumped runtime for compact widget layout, shorter title, Mini/Maxi wording and visible version badge.
 *       - Kept v8.4 hard post-send Start transcription lock unchanged.
 *   v8.4.0 – 2026-06-03 22:35 – Bruno DELNOZ
 *       Fixed:
 *       - Bumped runtime for hard post-send Start transcription lock.
 *       - Bumped runtime for No/Yes ordering and smaller Mini widget layout.
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

const CGAS_BACKGROUND_VERSION = '11.3.0';
const SUPPORTED_ORIGIN_RE = /^https:\/\/(chatgpt\.com|chat\.openai\.com)\//;
const CGAS_NATIVE_HOST_NAME = 'be.noxoz.voiceflow.dev_updater';
const CGAS_POST_RELOAD_TAB_REFRESH_KEY = 'cgas.postReloadTabRefresh';

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


function chromeStorageSet(values) {
    return new Promise((resolve) => {
        try {
            chrome.storage.local.set(values, () => resolve());
        } catch (error) {
            console.error('[CGAS Background] storage.set failed:', error);
            resolve();
        }
    });
}

function chromeStorageGet(keys) {
    return new Promise((resolve) => {
        try {
            chrome.storage.local.get(keys, (result) => resolve(result || {}));
        } catch (error) {
            console.error('[CGAS Background] storage.get failed:', error);
            resolve({});
        }
    });
}

function chromeStorageRemove(keys) {
    return new Promise((resolve) => {
        try {
            chrome.storage.local.remove(keys, () => resolve());
        } catch (error) {
            console.error('[CGAS Background] storage.remove failed:', error);
            resolve();
        }
    });
}

async function markTabsForRefreshAfterReload() {
    await chromeStorageSet({ [CGAS_POST_RELOAD_TAB_REFRESH_KEY]: true });
}

async function refreshOpenChatGPTTabsIfRequested() {
    const stored = await chromeStorageGet([CGAS_POST_RELOAD_TAB_REFRESH_KEY]);

    if (!stored[CGAS_POST_RELOAD_TAB_REFRESH_KEY]) {
        return;
    }

    await chromeStorageRemove([CGAS_POST_RELOAD_TAB_REFRESH_KEY]);

    let tabs = [];
    try {
        tabs = await chrome.tabs.query({
            url: [
                'https://chatgpt.com/*',
                'https://chat.openai.com/*'
            ]
        });
    } catch (error) {
        console.error('[CGAS Background] tab query failed:', error);
        return;
    }

    for (const tab of tabs) {
        if (!tab || !tab.id) {
            continue;
        }

        try {
            await chrome.tabs.reload(tab.id);
        } catch (error) {
            console.error('[CGAS Background] tab reload failed:', tab.id, error);
        }
    }
}

async function requestExtensionReloadWithTabRefresh(sendResponse) {
    await markTabsForRefreshAfterReload();

    sendResponse({
        ok: true,
        version: CGAS_BACKGROUND_VERSION,
        action: 'reload',
        tabRefresh: true
    });

    setTimeout(() => {
        chrome.runtime.reload();
    }, 180);
}

function requestNativeDevUpdate(sendResponse) {
    try {
        chrome.runtime.sendNativeMessage(
            CGAS_NATIVE_HOST_NAME,
            { action: 'updateLatest' },
            async (response) => {
                const error = chrome.runtime.lastError;

                if (error) {
                    sendResponse({
                        ok: false,
                        error: error.message || String(error),
                        host: CGAS_NATIVE_HOST_NAME
                    });
                    return;
                }

                if (!response || response.ok !== true) {
                    sendResponse({
                        ok: false,
                        error: response && response.error ? response.error : 'Native updater returned no OK response.',
                        response: response || null,
                        host: CGAS_NATIVE_HOST_NAME
                    });
                    return;
                }

                await markTabsForRefreshAfterReload();

                sendResponse({
                    ok: true,
                    action: 'update-dev',
                    host: CGAS_NATIVE_HOST_NAME,
                    response
                });

                setTimeout(() => {
                    chrome.runtime.reload();
                }, 400);
            }
        );
    } catch (error) {
        sendResponse({
            ok: false,
            error: error.message || String(error),
            host: CGAS_NATIVE_HOST_NAME
        });
    }

    return true;
}

setTimeout(() => {
    refreshOpenChatGPTTabsIfRequested();
}, 700);


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

    if (message.type === 'CGAS_RELOAD_EXTENSION') {
        requestExtensionReloadWithTabRefresh(sendResponse);
        return true;
    }

    if (message.type === 'CGAS_UPDATE_DEV_VERSION') {
        return requestNativeDevUpdate(sendResponse);
    }

    return false;
});
