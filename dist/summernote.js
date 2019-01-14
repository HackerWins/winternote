(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.summernote = {}));
}(this, function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function debounce(callback, delay) {
        var t = undefined;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (t)
                clearTimeout(t);
            t = setTimeout(function () {
                callback.apply(void 0, args);
            }, delay || 300);
        };
    }
    function isUndefined(value) {
        return typeof value === 'undefined' || value === null;
    }
    function isString(value) {
        return typeof value === 'string';
    }
    function isNotString(value) {
        return isString(value) === false;
    }
    function isFunction(value) {
        return typeof value === 'function';
    }
    function uuid() {
        var dt = (new Date()).getTime();
        var uuid = 'summernote-xy-2019xyy'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    function includes(array, value) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === value)
                return true;
        }
        return false;
    }
    function pushArray(a, b) {
        a.push.apply(a, b);
        return a;
    }

    var GETTER_PREFIX = '*/';
    var ACTION_PREFIX = '/';
    function GETTER(str) {
        return GETTER_PREFIX + str;
    }
    function ACTION(str) {
        return ACTION_PREFIX + str;
    }
    var PREVENT = 'PREVENT';
    var BaseStore = /** @class */ (function () {
        function BaseStore(opt) {
            this.callbacks = [];
            this.actions = [];
            this.getters = [];
            this.modules = opt.modules || {};
            this.items = {};
            this.initialize();
        }
        BaseStore.prototype.initialize = function () {
            this.initializeModule();
        };
        BaseStore.prototype.initializeModule = function () {
            var _this = this;
            Object.keys(this.modules).forEach(function (moduleClassName) {
                var moduleClass = _this.modules[moduleClassName];
                if (moduleClass) {
                    new moduleClass(_this);
                }
            });
        };
        BaseStore.prototype.set = function (key, value) {
            this.items[key] = value;
        };
        BaseStore.prototype.get = function (key, defaultValue$$1) {
            if (isUndefined(defaultValue$$1)) {
                return this.items[key];
            }
            return this.items[key] || defaultValue$$1;
        };
        BaseStore.prototype.has = function (key) {
            return !!this.items[key];
        };
        BaseStore.prototype.action = function (action, context) {
            var actionName = action.substr(action.indexOf(ACTION_PREFIX) + ACTION_PREFIX.length);
            this.actions[actionName] = {
                context: context,
                callback: context[action]
            };
        };
        BaseStore.prototype.getter = function (action, context) {
            var actionName = action.substr(action.indexOf(GETTER_PREFIX) + GETTER_PREFIX.length);
            this.getters[actionName] = {
                context: context,
                callback: context[action]
            };
        };
        BaseStore.prototype.dispatch = function (action) {
            var opts = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                opts[_i - 1] = arguments[_i];
            }
            var m = this.actions[action];
            if (m) {
                var ret = this.run.apply(this, [action].concat(opts));
                if (ret !== PREVENT) {
                    m.context.afterDispatch();
                }
            }
            else {
                throw new Error('action : ' + action + ' is not a valid.');
            }
        };
        BaseStore.prototype.run = function (action) {
            var opts = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                opts[_i - 1] = arguments[_i];
            }
            var m = this.actions[action];
            if (m) {
                return m.callback.apply(m.context, [this].concat(opts));
            }
            else {
                throw new Error('action : ' + action + ' is not a valid.');
            }
        };
        BaseStore.prototype.read = function (action) {
            var opts = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                opts[_i - 1] = arguments[_i];
            }
            var m = this.getters[action];
            if (m) {
                return m.callback.apply(m.context, [this].concat(opts));
            }
            else {
                throw new Error('getter : ' + action + ' is not a valid.');
            }
        };
        BaseStore.prototype.clone = function (action) {
            var opts = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                opts[_i - 1] = arguments[_i];
            }
            return JSON.parse(JSON.stringify(this.read.apply(this, [action].concat(opts))));
        };
        BaseStore.prototype.on = function (event, originalCallback, context, delay) {
            if (delay === void 0) { delay = 0; }
            var callback = delay > 0 ? debounce(originalCallback, delay) : originalCallback;
            this.callbacks.push({
                event: event,
                callback: callback,
                context: context,
                originalCallback: originalCallback
            });
        };
        BaseStore.prototype.off = function (event, originalCallback) {
            if (arguments.length === 0) {
                this.callbacks = [];
            }
            else if (arguments.length === 1) {
                this.callbacks = this.callbacks.filter(function (f) {
                    return f.event !== event;
                });
            }
            else if (arguments.length === 2) {
                this.callbacks = this.callbacks.filter(function (f) {
                    return !(f.event === event && f.originalCallback === originalCallback);
                });
            }
        };
        BaseStore.prototype.emit = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var event = args.shift();
            this.callbacks.filter(function (f) {
                return (f.event === event);
            }).forEach(function (f) {
                if (f && isFunction(f.callback) && f.context.source !== _this.source) {
                    f.callback.apply(f, args);
                }
            });
        };
        return BaseStore;
    }());

    var BaseModule = /** @class */ (function () {
        function BaseModule($store) {
            this.$store = $store;
            this.initialize();
        }
        BaseModule.prototype.afterDispatch = function () {
        };
        BaseModule.prototype.initialize = function () {
            var _this = this;
            this.filterProps(ACTION_PREFIX).forEach(function (key) {
                _this.$store.action(key, _this);
            });
            this.filterProps(GETTER_PREFIX).forEach(function (key) {
                _this.$store.getter(key, _this);
            });
        };
        BaseModule.prototype.getProto = function () {
            return Object.getPrototypeOf(this);
        };
        BaseModule.prototype.filterProps = function (pattern) {
            if (pattern === void 0) { pattern = '/'; }
            return Object.getOwnPropertyNames(this.getProto()).filter(function (key) {
                return key.indexOf(pattern) === 0;
            });
        };
        return BaseModule;
    }());

    var EditorManager = /** @class */ (function (_super) {
        __extends(EditorManager, _super);
        function EditorManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EditorManager.prototype[GETTER('editor.name')] = function ($store) {
            return $store.get('editor.name', 'summernote');
        };
        EditorManager.prototype[GETTER('editor.savedata')] = function ($store) {
            return $store.get('editor.savedata');
        };
        EditorManager.prototype[ACTION('editor.name')] = function ($store, name) {
            $store.set('editor.name', name);
        };
        EditorManager.prototype[ACTION('editor.save')] = function ($store) {
            $store.set('editor.savedata', true);
            $store.emit('summernote.change');
        };
        return EditorManager;
    }(BaseModule));

    var modules = [
        EditorManager
    ];

    var DOMElement = /** @class */ (function () {
        function DOMElement(tag, className, attr) {
            if (attr === void 0) { attr = {}; }
            if (isNotString(tag)) {
                this.element = tag;
            }
            else {
                var element = document.createElement('' + tag);
                if (className) {
                    element.className = className;
                }
                attr = attr || {};
                for (var k in attr) {
                    if (attr.hasOwnProperty(k)) {
                        element.setAttribute(k, attr[k]);
                    }
                }
                this.element = element;
            }
        }
        DOMElement.getScrollTop = function () {
            return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
        };
        DOMElement.getScrollLeft = function () {
            return Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft);
        };
        DOMElement.prototype.attr = function (key, value) {
            if (arguments.length === 1) {
                return this.element.getAttribute(key);
            }
            this.element.setAttribute(key, value);
            return this;
        };
        DOMElement.prototype.getAttirbutes = function () {
            var attrs = this.element.attributes;
            var results = [];
            for (var i = 0, len = attrs.length; i < len; i++) {
                results.push(attrs[i]);
            }
            return results;
        };
        DOMElement.prototype.attrs = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.map(function (key) {
                return { key: key, value: _this.element.getAttribute(key) };
            });
        };
        DOMElement.prototype.removeAttr = function (key) {
            this.element.removeAttribute(key);
            return this;
        };
        DOMElement.prototype.is = function (checkElement) {
            if (checkElement instanceof DOMElement) {
                return this.element === checkElement.element;
            }
            else if (checkElement instanceof Element) {
                return this.element === checkElement;
            }
            return false;
        };
        DOMElement.prototype.closest = function (cls) {
            var temp = this;
            var checkCls = temp.hasClass(cls);
            while (!checkCls) {
                if (temp.element.parentNode) {
                    temp = new DOMElement(temp.element.parentNode);
                }
                else {
                    return null;
                }
                checkCls = temp.hasClass(cls);
            }
            if (checkCls) {
                return temp;
            }
            return null;
        };
        DOMElement.prototype.parent = function () {
            return new DOMElement(this.element.parentNode);
        };
        DOMElement.prototype.removeClass = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.element.className) {
                var className_1 = this.element.className;
                args.forEach(function (cls) {
                    className_1 = ((" " + className_1 + " ").replace(" " + cls + " ", ' ')).trim();
                });
                this.element.className = className_1;
            }
            return this;
        };
        DOMElement.prototype.hasClass = function (cls) {
            if (!this.element.className) {
                return false;
            }
            else {
                var newClass = " " + this.element.className + " ";
                return newClass.indexOf(" " + cls + " ") > -1;
            }
        };
        DOMElement.prototype.addClass = function (cls) {
            if (!this.hasClass(cls)) {
                this.element.className = (this.element.className + " " + cls).trim();
            }
            return this;
        };
        DOMElement.prototype.toggleClass = function (cls, isForce) {
            if (isForce === void 0) { isForce = false; }
            if (arguments.length === 2) {
                if (isForce) {
                    this.addClass(cls);
                }
                else {
                    this.removeClass(cls);
                }
            }
            else {
                if (this.hasClass(cls)) {
                    this.removeClass(cls);
                }
                else {
                    this.addClass(cls);
                }
            }
            return this;
        };
        DOMElement.prototype.html = function (html) {
            if (arguments.length === 0) {
                return this.element.innerHTML;
            }
            if (isString(html)) {
                this.element.innerHTML = html + '';
            }
            else if (html instanceof DOMElement) {
                this.empty().append(html);
            }
            else if (html instanceof Element) {
                this.empty().append(html);
            }
            else if (html instanceof DocumentFragment) {
                this.empty().append(html);
            }
            return this;
        };
        DOMElement.prototype.find = function (selector) {
            return this.element.querySelector(selector);
        };
        DOMElement.prototype.$ = function (selector) {
            var node = this.find(selector);
            return node ? new DOMElement(node) : null;
        };
        DOMElement.prototype.findAll = function (selector) {
            return this.element.querySelectorAll(selector);
        };
        DOMElement.prototype.$$ = function (selector) {
            var list = this.findAll(selector);
            var results = [];
            for (var i = 0, len = list.length; i < len; i++) {
                results.push(new DOMElement(list[i]));
            }
            return results;
        };
        DOMElement.prototype.empty = function () {
            return this.html('');
        };
        DOMElement.prototype.append = function (el) {
            if (isString(el)) {
                this.element.appendChild(document.createTextNode(el));
            }
            else if (el instanceof DOMElement) {
                this.element.appendChild(el.element);
            }
            else if (el instanceof Element) {
                this.element.appendChild(el);
            }
            else if (el instanceof DocumentFragment) {
                this.element.appendChild(el);
            }
            return this;
        };
        DOMElement.prototype.appendTo = function (target) {
            var t = (target instanceof DOMElement) ? target.element : target;
            t.appendChild(this.element);
            return this;
        };
        DOMElement.prototype.remove = function () {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            return this;
        };
        DOMElement.prototype.text = function (value) {
            if (arguments.length === 0) {
                return this.element.textContent;
            }
            else {
                this.element.textContent = value;
                return this;
            }
        };
        /**
         *
         * $el.css`
         *  border-color: yellow;
         * `
         *
         * @param {*} key
         * @param {*} value
         */
        DOMElement.prototype.css = function ($1, $2) {
            var _this = this;
            if (arguments.length === 2) {
                this.element.style[$1] = $2;
            }
            else if (arguments.length === 1) {
                var key = $1;
                if (isString(key)) {
                    var keyString = key;
                    return getComputedStyle(this.element)[keyString] || this.element.style[keyString];
                }
                else {
                    var keys_1 = key || {};
                    Object.keys(keys_1).forEach(function (k) {
                        _this.element.style[k] = keys_1[k];
                    });
                }
            }
            return this;
        };
        DOMElement.prototype.cssText = function (value) {
            if (isUndefined(value)) {
                return this.element.style.cssText;
            }
            this.element.style.cssText = value;
            return this;
        };
        DOMElement.prototype.cssFloat = function (key) {
            return +this.css(key);
        };
        DOMElement.prototype.cssInt = function (key) {
            return Math.floor(+this.css(key));
        };
        DOMElement.prototype.px = function (key, value) {
            return this.css(key, value + 'px');
        };
        DOMElement.prototype.rect = function () {
            return this.element.getBoundingClientRect();
        };
        DOMElement.prototype.offset = function () {
            var rect = this.rect();
            var scrollTop = DOMElement.getScrollTop();
            var scrollLeft = DOMElement.getScrollLeft();
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        };
        DOMElement.prototype.offsetLeft = function () {
            return this.offset().left;
        };
        DOMElement.prototype.offsetTop = function () {
            return this.offset().top;
        };
        DOMElement.prototype.position = function () {
            if (this.element.style.top) {
                return {
                    top: +this.css('top'),
                    left: +this.css('left')
                };
            }
            else {
                return this.rect();
            }
        };
        DOMElement.prototype.size = function () {
            return [this.width(), this.height()];
        };
        DOMElement.prototype.width = function () {
            return this.element.offsetWidth || this.rect().width;
        };
        DOMElement.prototype.contentWidth = function () {
            return this.width() - this.cssFloat('padding-left') - this.cssFloat('padding-right');
        };
        DOMElement.prototype.height = function () {
            return this.element.offsetHeight || this.rect().height;
        };
        DOMElement.prototype.contentHeight = function () {
            return this.height() - this.cssFloat('padding-top') - this.cssFloat('padding-bottom');
        };
        DOMElement.prototype.val = function (value) {
            if (arguments.length === 0) {
                return this.element.value;
            }
            else if (arguments.length === 1) {
                var input = this.element;
                input.value = value;
            }
            return this;
        };
        DOMElement.prototype.int = function () {
            return Math.floor(this.float());
        };
        DOMElement.prototype.float = function () {
            return +this.element.value;
        };
        DOMElement.prototype.show = function () {
            return this.css('display', 'block');
        };
        DOMElement.prototype.hide = function () {
            return this.css('display', 'none');
        };
        DOMElement.prototype.toggle = function (isForce) {
            if (isForce === void 0) { isForce = false; }
            var currentHide = this.css('display') === 'none';
            if (arguments.length === 1) {
                currentHide = isForce;
            }
            if (currentHide) {
                return this.show();
            }
            else {
                return this.hide();
            }
        };
        DOMElement.prototype.scrollTop = function () {
            if (this.element === document.body) {
                return DOMElement.getScrollTop();
            }
            return this.element.scrollTop;
        };
        DOMElement.prototype.scrollLeft = function () {
            if (this.element === document.body) {
                return DOMElement.getScrollLeft();
            }
            return this.element.scrollLeft;
        };
        DOMElement.prototype.on = function (eventName, callback, opt1) {
            this.element.addEventListener(eventName, callback, opt1);
            return this;
        };
        DOMElement.prototype.off = function (eventName, callback) {
            this.element.removeEventListener(eventName, callback);
            return this;
        };
        DOMElement.prototype.getElement = function () {
            return this.element;
        };
        DOMElement.prototype.createChild = function (tag, className, attrs, css) {
            if (className === void 0) { className = ''; }
            if (attrs === void 0) { attrs = {}; }
            if (css === void 0) { css = {}; }
            var $element = new DOMElement(tag, className, attrs);
            $element.css(css);
            this.append($element);
            return $element;
        };
        DOMElement.prototype.firstChild = function () {
            return new DOMElement(this.element.firstElementChild);
        };
        DOMElement.prototype.children = function () {
            var element = this.element.firstElementChild;
            if (!element) {
                return [];
            }
            var results = [];
            do {
                results.push(new DOMElement(element));
                element = element.nextElementSibling;
            } while (element);
            return results;
        };
        DOMElement.prototype.childLength = function () {
            return this.element.children.length;
        };
        DOMElement.prototype.replace = function (newElement) {
            var element = newElement;
            if (element instanceof DOMElement) {
                element = element.element;
            }
            this.element.parentNode.replaceChild(element, this.element);
            return this;
        };
        DOMElement.prototype.checked = function (isChecked) {
            if (isChecked === void 0) { isChecked = false; }
            if (arguments.length === 0) {
                return !!this.element.checked;
            }
            var input = this.element;
            input.checked = !!isChecked;
            return this;
        };
        return DOMElement;
    }());

    var DOMEventObject = /** @class */ (function () {
        function DOMEventObject(eventName, isControl, isShift, isAlt, isMeta, codes, useCapture, debounce, checkMethodList) {
            this.eventName = eventName;
            this.isControl = isControl;
            this.isShift = isShift;
            this.isAlt = isAlt;
            this.isMeta = isMeta;
            this.codes = codes;
            this.useCapture = useCapture;
            this.debounce = debounce;
            this.checkMethodList = checkMethodList;
            this.dom = null;
            this.delegate = null;
            this.callback = null;
        }
        return DOMEventObject;
    }());

    // event name regular expression
    var LOAD_SAPARATOR = 'load ';
    var LOAD_CHECK_PATTERN = new RegExp("^" + LOAD_SAPARATOR + "(.*)", 'ig');

    var KEY_ALT = 'ALT';
    var KEY_SHIFT = 'SHIFT';
    var KEY_META = 'META';
    var KEY_CONTROL = 'CONTROL';
    var NAME_SAPARATOR = ':';
    var CHECK_SAPARATOR = '|';
    var SAPARATOR = ' ';
    var DOM_EVENT_MAKE = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        var key = keys.join(NAME_SAPARATOR);
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return [key].concat(args).join(SAPARATOR);
        };
    };
    var CUSTOM = DOM_EVENT_MAKE;
    var CLICK = DOM_EVENT_MAKE('click');
    var DOUBLECLICK = DOM_EVENT_MAKE('dblclick');
    var MOUSEDOWN = DOM_EVENT_MAKE('mousedown');
    var MOUSEUP = DOM_EVENT_MAKE('mouseup');
    var MOUSEMOVE = DOM_EVENT_MAKE('mousemove');
    var MOUSEOVER = DOM_EVENT_MAKE('mouseover');
    var MOUSEOUT = DOM_EVENT_MAKE('mouseout');
    var MOUSEENTER = DOM_EVENT_MAKE('mouseenter');
    var MOUSELEAVE = DOM_EVENT_MAKE('mouseleave');
    var TOUCHSTART = DOM_EVENT_MAKE('touchstart');
    var TOUCHMOVE = DOM_EVENT_MAKE('touchmove');
    var TOUCHEND = DOM_EVENT_MAKE('touchend');
    var KEYDOWN = DOM_EVENT_MAKE('keydown');
    var KEYUP = DOM_EVENT_MAKE('keyup');
    var KEYPRESS = DOM_EVENT_MAKE('keypress');
    var DRAG = DOM_EVENT_MAKE('drag');
    var DRAGSTART = DOM_EVENT_MAKE('dragstart');
    var DROP = DOM_EVENT_MAKE('drop');
    var DRAGOVER = DOM_EVENT_MAKE('dragover');
    var DRAGENTER = DOM_EVENT_MAKE('dragenter');
    var DRAGLEAVE = DOM_EVENT_MAKE('dragleave');
    var DRAGEXIT = DOM_EVENT_MAKE('dragexit');
    var DRAGOUT = DOM_EVENT_MAKE('dragout');
    var DRAGEND = DOM_EVENT_MAKE('dragend');
    var CONTEXTMENU = DOM_EVENT_MAKE('contextmenu');
    var CHANGE = DOM_EVENT_MAKE('change');
    var INPUT = DOM_EVENT_MAKE('input');
    var PASTE = DOM_EVENT_MAKE('paste');
    var RESIZE = DOM_EVENT_MAKE('resize');
    var SCROLL = DOM_EVENT_MAKE('scroll');
    var POINTERSTART = CUSTOM('mousedown', 'touchstart');
    var POINTERMOVE = CUSTOM('mousemove', 'touchmove');
    var POINTEREND = CUSTOM('mouseup', 'touchend');
    var CHANGEINPUT = CUSTOM('change', 'input');
    var EventUtil = /** @class */ (function () {
        function EventUtil() {
        }
        EventUtil.addEvent = function (obj, eventName, callback, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            if (obj) {
                obj.addEventListener(eventName, callback, useCapture);
            }
        };
        EventUtil.removeEvent = function (obj, eventName, callback) {
            if (obj) {
                obj.removeEventListener(eventName, callback);
            }
        };
        EventUtil.pos = function (e) {
            if (e instanceof TouchEvent && e.touches && e.touches[0]) {
                return e.touches[0];
            }
            return e;
        };
        EventUtil.posXY = function (e) {
            var pos = EventUtil.pos(e);
            return {
                x: pos.pageX,
                y: pos.pageY
            };
        };
        return EventUtil;
    }());

    var META_KEYS = [KEY_CONTROL, KEY_SHIFT, KEY_ALT, KEY_META];
    var EventParser = /** @class */ (function () {
        function EventParser() {
        }
        EventParser.parse = function (key, context) {
            var checkMethodFilters = key.split(CHECK_SAPARATOR).map(function (it) { return it.trim(); });
            var eventSelectorAndBehave = checkMethodFilters.shift();
            var _a = eventSelectorAndBehave.split(SAPARATOR), eventName = _a[0], params = _a.slice(1);
            var eventNames = EventParser.getEventNames(eventName);
            var callback = context[key].bind(context);
            eventNames.forEach(function (eventName) {
                var eventInfo = pushArray([eventName], params);
                EventParser.bindingEvent(eventInfo, checkMethodFilters, callback, context);
            });
        };
        EventParser.getEventNames = function (eventName) {
            var results = [];
            eventName.split(NAME_SAPARATOR).forEach(function (e) {
                var arr = e.split(NAME_SAPARATOR);
                results = pushArray(results, arr);
            });
            return results;
        };
        EventParser.getDefaultDomElement = function (dom, context) {
            var el;
            if (dom) {
                el = context.refs[dom] || context[dom] || window[dom];
            }
            else {
                el = context.$el || context.$root;
            }
            if (el instanceof DOMElement) {
                return el.getElement();
            }
            return el;
        };
        /* magic check method  */
        EventParser.getDefaultEventObject = function (eventName, checkMethodFilters) {
            var _this = this;
            var isControl = includes(checkMethodFilters, KEY_CONTROL);
            var isShift = includes(checkMethodFilters, KEY_SHIFT);
            var isAlt = includes(checkMethodFilters, KEY_ALT);
            var isMeta = includes(checkMethodFilters, KEY_META);
            var arr = checkMethodFilters.filter(function (code) {
                return includes(META_KEYS, code.toUpperCase()) === false;
            });
            var checkMethodList = arr.filter(function (code) {
                return !!_this[code];
            });
            var delay = arr.filter(function (code) {
                if (code.indexOf('debounce(') > -1) {
                    return true;
                }
                return false;
            });
            var debounceTime = 0;
            if (delay.length) {
                debounceTime = +(delay[0].replace('debounce(', '').replace(')', ''));
            }
            // capture 
            var capturing = arr.filter(function (code) {
                if (code.indexOf('capture') > -1) {
                    return true;
                }
                return false;
            });
            var useCapture = false;
            if (capturing.length) {
                useCapture = true;
            }
            arr = arr.filter(function (code) {
                return includes(checkMethodList, code) === false
                    && includes(delay, code) === false
                    && includes(capturing, code) === false;
            }).map(function (code) {
                return code.toLowerCase();
            });
            return new DOMEventObject(eventName, isControl, isShift, isAlt, isMeta, arr, useCapture, debounceTime, checkMethodList);
        };
        EventParser.bindingEvent = function (_a, checkMethodFilters, callback, context) {
            var eventName = _a[0], dom = _a[1], delegate = _a.slice(2);
            var eventObject = EventParser.getDefaultEventObject(eventName, checkMethodFilters);
            eventObject.dom = EventParser.getDefaultDomElement(dom, context);
            eventObject.delegate = delegate.join(SAPARATOR);
            EventParser.addEvent(eventObject, callback, context);
        };
        EventParser.matchPath = function (el, selector) {
            if (el) {
                if (el.matches(selector)) {
                    return el;
                }
                return EventParser.matchPath(el.parentElement, selector);
            }
            return null;
        };
        EventParser.checkEventType = function (e, eventObject) {
            var _this = this;
            var onlyControl = eventObject.isControl ? e.ctrlKey : true;
            var onlyShift = eventObject.isShift ? e.shiftKey : true;
            var onlyAlt = eventObject.isAlt ? e.altKey : true;
            var onlyMeta = eventObject.isMeta ? e.metaKey : true;
            var hasKeyCode = true;
            if (eventObject.codes.length) {
                hasKeyCode = (e.code ? includes(eventObject.codes, e.code.toLowerCase()) : false) || (e.key ? includes(eventObject.codes, e.key.toLowerCase()) : false);
            }
            var isAllCheck = true;
            if (eventObject.checkMethodList.length) {
                isAllCheck = eventObject.checkMethodList.every(function (method) {
                    return _this[method].call(_this, e);
                });
            }
            return (onlyControl && onlyAlt && onlyShift && onlyMeta && hasKeyCode && isAllCheck);
        };
        EventParser.makeCallback = function (eventObject, callback) {
            var _this = this;
            if (eventObject.debounce) {
                callback = debounce(callback, eventObject.debounce);
            }
            if (eventObject.delegate) {
                return function (e) {
                    var delegateTarget = _this.matchPath(e.target || e.srcElement, eventObject.delegate);
                    if (delegateTarget) { // delegate target 이 있는 경우만 callback 실행 
                        e.$delegateTarget = new DOMElement(delegateTarget);
                        e.xy = EventUtil.posXY(e);
                        if (_this.checkEventType(e, eventObject)) {
                            return callback(e, e.$delegateTarget, e.xy);
                        }
                    }
                };
            }
            else {
                return function (e) {
                    e.xy = EventUtil.posXY(e);
                    if (_this.checkEventType(e, eventObject)) {
                        return callback(e);
                    }
                };
            }
        };
        EventParser.addEvent = function (deo, callback, context) {
            deo.callback = EventParser.makeCallback(deo, callback);
            context.addBinding(deo);
            EventUtil.addEvent(deo.dom, deo.eventName, deo.callback, deo.useCapture);
        };
        EventParser.removeEventAll = function (context) {
            context.getBindings().forEach(function (obj) {
                EventParser.removeEvent(obj, context);
            });
            context.initBindings();
        };
        EventParser.removeEvent = function (_a, context) {
            var eventName = _a.eventName, dom = _a.dom, callback = _a.callback;
            EventUtil.removeEvent(dom, eventName, callback);
        };
        return EventParser;
    }());

    var CHECK_CLICK_PATTERN = 'click';
    var CHECK_MOUSE_PATTERN = 'mouse(down|up|move|over|out|enter|leave)';
    var CHECK_POINTER_PATTERN = 'pointer(start|move|end)';
    var CHECK_TOUCH_PATTERN = 'touch(start|move|end)';
    var CHECK_KEY_PATTERN = 'key(down|up|press)';
    var CHECK_DRAGDROP_PATTERN = 'drag|drop|drag(start|over|enter|leave|exit|end)';
    var CHECK_CONTEXT_PATTERN = 'contextmenu';
    var CHECK_INPUT_PATTERN = 'change|input';
    var CHECK_CLIPBOARD_PATTERN = 'paste';
    var CHECK_BEHAVIOR_PATTERN = 'resize|scroll';
    var CHECK_PATTERN_LIST = [
        CHECK_CLICK_PATTERN,
        CHECK_MOUSE_PATTERN,
        CHECK_POINTER_PATTERN,
        CHECK_TOUCH_PATTERN,
        CHECK_KEY_PATTERN,
        CHECK_DRAGDROP_PATTERN,
        CHECK_CONTEXT_PATTERN,
        CHECK_INPUT_PATTERN,
        CHECK_CLIPBOARD_PATTERN,
        CHECK_BEHAVIOR_PATTERN
    ].join('|');
    var DOM_EVENT_CHECK_PATTERN = new RegExp("^(" + CHECK_PATTERN_LIST + ")", "ig");

    var EventMachine = /** @class */ (function () {
        function EventMachine(opt, props, parent) {
            if (opt === void 0) { opt = {}; }
            if (props === void 0) { props = {}; }
            this.opt = opt || {};
            this.parent = parent;
            this.props = props || {};
            this.refs = {};
            this.children = {};
        }
        EventMachine.prototype.render = function ($container) {
            var ret = this.template();
            this.$el = this.parseTemplate(ret);
            this.refs['$el'] = this.$el;
            if ($container)
                $container.html(this.$el);
            this.load();
            this.afterRender();
        };
        EventMachine.prototype.afterRender = function () {
        };
        /**
         * Define Child Component
         */
        EventMachine.prototype.components = function () {
            return {};
        };
        EventMachine.prototype.parseTemplate = function (html) {
            var _this = this;
            var $tempDiv = new DOMElement("div");
            $tempDiv.html(html);
            var list = $tempDiv.children();
            var fragment = document.createDocumentFragment();
            list.forEach(function ($el) {
                if ($el.attr('ref')) {
                    _this.refs[$el.attr('ref')] = $el;
                }
                var refs = $el.$$('[ref]');
                refs.slice().forEach(function ($dom) {
                    var name = $dom.attr('ref');
                    _this.refs[name] = $dom;
                });
                fragment.appendChild($el.element);
            });
            return list[0];
        };
        EventMachine.prototype.parseTemplateLoad = function (html) {
            var _this = this;
            var parseString = '';
            if (isString(html)) {
                parseString = html + '';
            }
            else {
                html = html;
                parseString = html.slice().join('');
            }
            var $tempDiv = new DOMElement("div");
            $tempDiv.html(parseString);
            var list = $tempDiv.children();
            var fragment = document.createDocumentFragment();
            list.forEach(function ($el) {
                // ref element 정리 
                if ($el.attr('ref')) {
                    _this.refs[$el.attr('ref')] = $el;
                }
                var refs = $el.$$('[ref]');
                refs.slice().forEach(function ($dom) {
                    var name = $dom.attr('ref');
                    _this.refs[name] = $dom;
                });
                fragment.appendChild($el.element);
            });
            return fragment;
        };
        EventMachine.prototype.parseComponent = function () {
            var _this = this;
            var $el = this.$el;
            var childComponents = this.components();
            Object.keys(childComponents).forEach(function (componentName) {
                var componentClass = childComponents[componentName];
                var targets = $el.$$("" + componentName.toLowerCase());
                targets.forEach(function ($dom) {
                    var props = {};
                    $dom.attrs().filter(function (t) {
                        return ['ref'].indexOf(t.key) < 0;
                    }).forEach(function (t) {
                        props[t.key] = t.value;
                    });
                    var refName = $dom.attr('ref') || componentName;
                    if (refName) {
                        if (componentClass) {
                            var instance = new componentClass(_this.opt, props, _this);
                            _this.children[refName] = instance;
                            _this.refs[refName] = instance.$el;
                            if (instance) {
                                instance.render();
                                $dom.replace(instance.$el);
                            }
                        }
                    }
                });
            });
        };
        EventMachine.prototype.load = function () {
            var _this = this;
            this.filterProps(LOAD_CHECK_PATTERN).forEach(function (callbackName) {
                var elName = callbackName.split(LOAD_SAPARATOR)[1];
                if (_this.refs[elName]) {
                    var ret = _this[callbackName].call(_this);
                    if (isString(ret)) {
                        ret = [ret];
                    }
                    _this.refs[elName].html(_this.parseTemplateLoad(ret));
                }
            });
            this.parseComponent();
        };
        EventMachine.prototype.template = function () {
            return '<div></div>';
        };
        EventMachine.prototype.initialize = function () {
        };
        EventMachine.prototype.eachChildren = function (callback) {
            var _this = this;
            if (!isFunction(callback))
                return;
            Object.keys(this.children).forEach(function (childComponentName) {
                callback(_this.children[childComponentName]);
            });
        };
        EventMachine.prototype.initializeEvent = function () {
            this.initializeEventMachin();
            this.eachChildren(function (comp) {
                comp.initializeEvent();
            });
        };
        EventMachine.prototype.destroy = function () {
            this.destroyEventMachin();
            this.eachChildren(function (comp) {
                comp.destroy();
            });
        };
        EventMachine.prototype.destroyEventMachin = function () {
            this.removeEventAll();
        };
        EventMachine.prototype.initializeEventMachin = function () {
            this.filterProps(DOM_EVENT_CHECK_PATTERN).forEach(this.parseEvent.bind(this));
        };
        EventMachine.prototype.collectProps = function () {
            if (!this.collapsedProps) {
                var p = Object.getPrototypeOf(this);
                var results = [];
                do {
                    results = pushArray(results, Object.getOwnPropertyNames(p));
                    p = Object.getPrototypeOf(p);
                } while (p);
                this.collapsedProps = results;
            }
            return this.collapsedProps;
        };
        EventMachine.prototype.filterProps = function (pattern) {
            return this.collectProps().filter(function (key) {
                return key.match(pattern);
            });
        };
        EventMachine.prototype.parseEvent = function (key) {
            EventParser.parse(key, this);
        };
        /* magic check method  */
        EventMachine.prototype.self = function (e) {
            return e.$delegateTarget.element === e.target;
        };
        EventMachine.prototype.getBindings = function () {
            if (!this._bindings) {
                this.initBindings();
            }
            return this._bindings;
        };
        EventMachine.prototype.addBinding = function (obj) {
            this.getBindings().push(obj);
        };
        EventMachine.prototype.initBindings = function () {
            this._bindings = [];
        };
        EventMachine.prototype.removeEventAll = function () {
            EventParser.removeEventAll(this);
        };
        return EventMachine;
    }());

    var CHECK_STORE_MULTI_PATTERN = /^ME@/;
    var PREFIX = '@';
    var MULTI_PREFIX = 'ME@';
    var SPLITTER = '|';
    var PIPE = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args.join(SPLITTER);
    };
    var EVENT = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return MULTI_PREFIX + PIPE.apply(void 0, args);
    };
    var Component = /** @class */ (function (_super) {
        __extends(Component, _super);
        function Component(opt, props, parent) {
            if (opt === void 0) { opt = {}; }
            if (props === void 0) { props = {}; }
            var _this = _super.call(this, opt, props, parent) || this;
            _this.source = uuid();
            // window[this.source] = this; 
            if (_this.parent && _this.parent.$store) {
                _this.$store = _this.parent.$store;
            }
            _this.created();
            _this.initialize();
            _this.initializeStoreEvent();
            return _this;
        }
        Component.prototype.created = function () {
        };
        Component.prototype.getRealEventName = function (e, s) {
            if (s === void 0) { s = PREFIX; }
            var startIndex = e.indexOf(s);
            return e.substr(startIndex === 0 ? 0 : startIndex + s.length);
        };
        /**
         * initialize store event
         *
         * you can define '@xxx' method(event) in Component
         *
         *
         */
        Component.prototype.initializeStoreEvent = function () {
            var _this = this;
            this.storeEvents = {};
            this.filterProps(CHECK_STORE_MULTI_PATTERN).forEach(function (key) {
                var events = _this.getRealEventName(key, MULTI_PREFIX);
                var callback = _this[key].bind(_this);
                events.split(SPLITTER).forEach(function (e) {
                    e = _this.getRealEventName(e);
                    _this.storeEvents[e] = callback;
                    _this.on(e, _this.storeEvents[e], _this);
                });
            });
        };
        Component.prototype.destoryStoreEvent = function () {
            var _this = this;
            Object.keys(this.storeEvents).forEach(function (event) {
                _this.off(event, _this.storeEvents[event]);
            });
        };
        Component.prototype.read = function (action) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            return (_a = this.$store).read.apply(_a, [action].concat(args));
        };
        Component.prototype.i18n = function (key) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.read.apply(this, ['i18n/get', key].concat(args));
        };
        Component.prototype.run = function (action) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            return (_a = this.$store).run.apply(_a, [action].concat(args));
        };
        Component.prototype.dispatch = function (action) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            this.$store.source = this.source;
            return (_a = this.$store).dispatch.apply(_a, [action].concat(args));
        };
        Component.prototype.on = function (eventType, callback, context) {
            if (context === void 0) { context = {}; }
            this.$store.on(eventType, callback, context);
        };
        Component.prototype.off = function (eventType, callback) {
            this.$store.off(eventType, callback);
        };
        Component.prototype.emit = function (eventType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            this.$store.source = this.source;
            (_a = this.$store).emit.apply(_a, [eventType].concat(args));
        };
        return Component;
    }(EventMachine));

    var BaseEditor = /** @class */ (function (_super) {
        __extends(BaseEditor, _super);
        function BaseEditor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseEditor.prototype.initialize = function (externalModules) {
            if (externalModules === void 0) { externalModules = []; }
            this.$store = new BaseStore({
                modules: __assign({}, modules, externalModules)
            });
            this.$body = new DOMElement(this.getContainer());
            this.$root = new DOMElement('div', 'summernote');
            this.$body.append(this.$root);
            if (this.opt.type) {
                this.$root.addClass(this.opt.type);
            }
            this.render(this.$root);
            this.initializeEvent();
        };
        BaseEditor.prototype.getContainer = function () {
            return this.opt.container || document.body;
        };
        return BaseEditor;
    }(Component));

    var Toolbar = /** @class */ (function (_super) {
        __extends(Toolbar, _super);
        function Toolbar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Toolbar.prototype.template = function () {
            return "\n      <div class='summernote-toolbar'>\n        <button type='button' ref=\"$clickButton\" >Click</button>\n      </div>\n    ";
        };
        Toolbar.prototype[CLICK('$clickButton')] = function () {
            this.dispatch('editor.save', { savedata: true });
            this.emit('SAVE');
        };
        return Toolbar;
    }(Component));

    var Editor = /** @class */ (function (_super) {
        __extends(Editor, _super);
        function Editor(opt, props) {
            if (opt === void 0) { opt = {}; }
            if (props === void 0) { props = {}; }
            return _super.call(this, opt, props, null) || this;
        }
        Editor.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.$root.cssText("\n      width: 400px;\n      height: 400px;\n      background-color: yellow;\n    ");
            this.$el.cssText("\n      position: relative;\n      width: 100%;\n      height: 100%;\n    ");
        };
        Editor.prototype.template = function () {
            return "\n      <div class='summernote-layout'>\n        <Toolbar></Toolbar>\n        <div class='summernote-editable'></div>\n        <div class='summernote-codable'></div>\n      </div>\n    ";
        };
        Editor.prototype.components = function () {
            return { Toolbar: Toolbar };
        };
        Editor.prototype[EVENT('SAVE')] = function () {
            console.info('fire save event', this.read('editor.savedata'));
        };
        return Editor;
    }(BaseEditor));

    function create(place) {
        var editor = new Editor({
            container: place
        });
        return editor;
    }
    function main(selector) {
        var editor = create(document.querySelector(selector));
        // tslint:disable-next-line
        console.log(editor.read('editor.name'));
    }

    exports.create = create;
    exports.main = main;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
