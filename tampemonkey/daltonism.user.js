// ==UserScript==
// @name         Daltonism Color Adaptation (Injected)
// @namespace    https://daltonism.pingpal.news
// @version      1.1
// @description  Inject Daltonism color adaptation script by fetching its content.
// @author       Henry Letellier
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @sandbox      none
// ==/UserScript==

'use strict';

// Configuration
const config = {
    scriptUrls: [
        'https://daltonism.pingpal.news/non-bootstrap-daltonian-standalone/js/daltonism.js',
        'https://raw.githubusercontent.com/Asperboard/daltonism-filter/refs/heads/main/non-bootstrap-daltonian-standalone/js/daltonism.js',
        '',
        ''
    ],
    timeout: 5000, // Timeout in milliseconds for each load attempt
    initDelay: 500 // Delay before checking if script initialized properly
};


// Logger utility
const logger = {
    info: (msg) => console.log(`[Daltonism] ${msg}`),
    warn: (msg) => console.warn(`[Daltonism] ${msg}`),
    error: (msg) => console.error(`[Daltonism] ${msg}`)
};

// Script loader module
const scriptLoader = {
    currentAttempt: 0,

    loadNextScript: function () {
        if (this.currentAttempt >= config.scriptUrls.length) {
            logger.error("Failed to fetch from all sources");
            return;
        }

        const currentUrl = config.scriptUrls[this.currentAttempt];
        logger.info(`Attempting to fetch script from: ${currentUrl}`);

        GM_xmlhttpRequest({
            method: "GET",
            url: currentUrl,
            timeout: config.timeout,
            onload: function (response) {
                if (response.status === 200) {
                    logger.info(`Successfully fetched script from: ${currentUrl}`);
                    scriptInjector.injectCode(response.responseText);
                } else {
                    logger.warn(`Failed to fetch script from: ${currentUrl} (Status: ${response.status})`);
                    scriptLoader.currentAttempt++;
                    scriptLoader.loadNextScript();
                }
            },
            onerror: function () {
                logger.warn(`Network error fetching from: ${currentUrl}`);
                scriptLoader.currentAttempt++;
                scriptLoader.loadNextScript();
            },
            ontimeout: function () {
                logger.warn(`Timeout fetching from: ${currentUrl}`);
                scriptLoader.currentAttempt++;
                scriptLoader.loadNextScript();
            }
        });
    }
};

// Script injection module
const scriptInjector = {
    injectCode: function (code) {
        try {
            GM_addElement(document.head, 'script', { textContent: code });
            logger.info("Script injected successfully");
            persistenceManager.enablePersistence();
        } catch (e) {
            logger.error("Failed to inject script: " + e.message);
        }
    }
};

// Persistence manager module
const persistenceManager = {
    enablePersistence: function () {
        setTimeout(() => {
            try {
                localStorage.setItem("daltonism-use-local-storage", "true");
                logger.info("Persistence enabled successfully");
            } catch (e) {
                logger.error("Failed to enable persistence: " + e.message);
            }
        }, config.initDelay);
    }
};

// Main initialization
const init = function () {
    logger.info("Initializing Daltonism color adaptation script");
    scriptLoader.loadNextScript();
};

// Start when page is fully loaded
if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}
