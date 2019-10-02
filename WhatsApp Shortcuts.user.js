// ==UserScript==
// @name         WhatsApp Shortcuts
// @namespace    WA-Shortcuts
// @version      0.1
// @description  Adding shortcuts to WhatsApp web application.
// @author       lai32290
// @match        https://web.whatsapp.com/
// @require      https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.3/mousetrap.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let currentReply = null;

    const WhatsApp = {
        findParent: function(el, sel) {
            while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el, sel)));
            return el;
        },

        isLoading: function() {
            const input = this.getSearchInput();
            return input === null;
        },

        focusSearch: function() {
            this.getSearchInput().focus();
        },

        getSearchInput: function() {
            return document.querySelector('input._2zCfw');
        },

        getMessageInput: function() {
            return document.querySelector("._3FeAD > .selectable-text");
        },

        getPrevMessage() {
            if (currentReply === null || this.findParent.call(this, currentReply, "body") === null) {
                const messages = document.querySelectorAll(".FTBzM");
                return messages[messages.length - 1];
            }

            return currentReply.previousSibling;
        },

        getNextMessage() {
            if (currentReply === null || this.findParent.call(this, currentReply, "body") === null) {
                const messages = document.querySelectorAll(".FTBzM");
                return messages[messages.length - 1];
            }

            return currentReply.nextSibling;
        }
    }

    function doubleClick(selector, _element = null) {
        const element = _element || document.querySelector(selector);

        if (!element) return;

        const event = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });

        element.dispatchEvent(event);
    }

    function click(selector, _element = null) {
        const element = _element || document.querySelector(selector);

        if (!element) return;

        const event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });

        element.dispatchEvent(event);
    }

    function bindSearch() {
        let input;
        while (input == null) {
            input = WhatsApp.getSearchInput();
        }

        Mousetrap.bind(['ctrl+/', 'command+/'], function() {
            WhatsApp.focusSearch();
        });
    }

    function bindChangeConversation() {
        Mousetrap.bind(['alt+up', 'alt+k', 'command+k', 'command+up'], function() {
            const message = WhatsApp.getPrevMessage();
            if (message) {
                doubleClick("", message);
                currentReply = message;
            }
        });

        Mousetrap.bind(['alt+down', 'alt+j', 'command+j', 'command+down'], function() {
            const message = WhatsApp.getNextMessage();
            if (message) {
                doubleClick("", message);
                currentReply = message;
            }
        });

        document.addEventListener("keyup", function(e) {
            if (e.target.classList.contains("_3u328")) {
                if (e.keyCode === 27 || e.keyCode === 13) {
                    currentReply = null;
                }
            }
        });
    }

    function start() {
        if (WhatsApp.isLoading()) {
            setTimeout(start, 200);
            return;
        }

        bindSearch();
        bindChangeConversation();

        document.addEventListener("keydown", function(e) {
            if (e.target.classList.contains("selectable-text")) {
                const input = WhatsApp.getMessageInput();
                input.classList.add("mousetrap");
            }
        });
    }

    start();
})();