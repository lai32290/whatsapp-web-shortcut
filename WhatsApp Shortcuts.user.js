// ==UserScript==
// @name         WhatsApp Shortcuts
// @namespace    WA-Shortcuts
// @version      0.1
// @description  Adding shortcuts to WhatsApp web application.
// @author       lai32290
// @match        https://web.whatsapp.com/
// @require      https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.3/mousetrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.jQuery;

    const WhatsApp = {
        isLoading: function() {
            const input = this.getSearchInput();
            return input === null;
        },
        focusSearch: function() {
            this.getSearchInput().focus();
        },

        getSearchInput: function() {
            return document.querySelector('input[title="Search or start new chat"]');
        },

        getMessageInput: function() {
            return $("div:contains('Type a message'):parent > .selectable-text")[0];
        }
    }

    let selectedMessage;

    function doubleClick(selector) {
        const element = document.querySelector(selector);

        if (!element) return;

        const event = new MouseEvent('dblclick', {
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

        Mousetrap.bind('ctrl+/', function() {
            WhatsApp.focusSearch();
        });
    }

    function start() {
        if (WhatsApp.isLoading()) {
            setTimeout(start, 200);
            return;
        }

        bindSearch();

        $(document).on('keydown', "div:contains('Type a message'):parent > .selectable-text", function() {
            const input = WhatsApp.getMessageInput();
            $(input).addClass("mousetrap");
        });
    }

    start();
})();