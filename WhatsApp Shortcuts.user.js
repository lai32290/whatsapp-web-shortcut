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

    let currentReply = null;

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
        },

        isMessageInputFocused() {
            return $(this.getMessageInput()).is(":focus");
        },

        getActivedConversation() {
            const conversation = $("#pane-side ._3mMX1");

            if (conversation)
                return $(conversation).parents('.X7YrQ');
        },

        getFirstConversation() {
            return this.getConversations().first();
        },

        getConversations() {
            return $("#pane-side .X7YrQ");
        },

        getPrevMessage() {
            if (currentReply === null || $(currentReply).parents("body")[0] === undefined) {
                return $(".FTBzM").last()[0];
            }

            return $(currentReply).prev()[0];
        },

        getNextMessage() {
            if (currentReply === null || $(currentReply).parents("body")[0] === undefined) {
                return $(".FTBzM").last()[0];
            }

            return $(currentReply).next()[0];
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

        $(document).on('keyup', '._3u328', function(e) {
            if (e.keyCode === 27 || e.keyCode === 13) {
                currentReply = null;
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

        $(document).on('keydown', "div:contains('Type a message'):parent > .selectable-text", function() {
            const input = WhatsApp.getMessageInput();
            $(input).addClass("mousetrap");
        });
    }

    start();
})();