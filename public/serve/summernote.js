
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var summernote = (function (exports) {
    'use strict';

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

    function debounce(callback, delay) {
        var t = undefined;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (t) {
                clearTimeout(t);
            }
            t = setTimeout(function () {
                callback.apply(void 0, args);
            }, delay || 300);
        };
    }
    function isUndefined(value) {
        return typeof value == 'undefined' || value == null;
    }
    function isString(value) {
        return typeof value == 'string';
    }
    function isNotString(value) {
        return isString(value) === false;
    }
    function isFunction(value) {
        return typeof value == 'function';
    }
    function spread(arg) {
        return Array.prototype.slice.call(arg);
    }
    function uuid() {
        var dt = (new Date()).getTime();
        var uuid = 'summernote-xy-2019xyy'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
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
    //# sourceMappingURL=func.js.map

    var Dom = /** @class */ (function () {
        function Dom(tag, className, attr) {
            if (attr === void 0) { attr = {}; }
            if (isNotString(tag)) {
                this.el = tag;
            }
            else {
                var el = document.createElement('' + tag);
                if (className) {
                    el.className = className;
                }
                attr = attr || {};
                for (var k in attr) {
                    el.setAttribute(k, attr[k]);
                }
                this.el = el;
            }
        }
        Dom.getScrollTop = function () {
            return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
        };
        Dom.getScrollLeft = function () {
            return Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft);
        };
        Dom.prototype.attr = function (key, value) {
            if (arguments.length == 1) {
                return this.el.getAttribute(key);
            }
            this.el.setAttribute(key, value);
            return this;
        };
        Dom.prototype.getAttirbutes = function () {
            return spread(this.el.attributes);
        };
        Dom.prototype.attrs = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.map(function (key) {
                return _this.el.getAttribute(key);
            });
        };
        Dom.prototype.removeAttr = function (key) {
            this.el.removeAttribute(key);
            return this;
        };
        Dom.prototype.is = function (checkElement) {
            return this.el === (checkElement.el || checkElement);
        };
        Dom.prototype.closest = function (cls) {
            var temp = this;
            var checkCls = false;
            while (!(checkCls = temp.hasClass(cls))) {
                if (temp.el.parentNode) {
                    temp = new Dom(temp.el.parentNode);
                }
                else {
                    return null;
                }
            }
            if (checkCls) {
                return temp;
            }
            return null;
        };
        Dom.prototype.parent = function () {
            return new Dom(this.el.parentNode);
        };
        Dom.prototype.removeClass = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.el.className) {
                var className = this.el.className;
                args.forEach(function (cls) {
                    className = ((" " + className + " ").replace(" " + cls + " ", ' ')).trim();
                });
                this.el.className = className;
            }
            return this;
        };
        Dom.prototype.hasClass = function (cls) {
            if (!this.el.className) {
                return false;
            }
            else {
                var newClass = " " + this.el.className + " ";
                return newClass.indexOf(" " + cls + " ") > -1;
            }
        };
        Dom.prototype.addClass = function (cls) {
            if (!this.hasClass(cls)) {
                this.el.className = this.el.className + " " + cls;
            }
            return this;
        };
        Dom.prototype.toggleClass = function (cls, isForce) {
            if (isForce === void 0) { isForce = false; }
            if (arguments.length == 2) {
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
        };
        Dom.prototype.html = function (html) {
            if (arguments.length == 0) {
                return this.el.innerHTML;
            }
            if (isString(html)) {
                this.el.innerHTML = html;
            }
            else {
                this.empty().append(html);
            }
            return this;
        };
        Dom.prototype.find = function (selector) {
            return this.el.querySelector(selector);
        };
        Dom.prototype.$ = function (selector) {
            var node = this.find(selector);
            return node ? new Dom(node) : null;
        };
        Dom.prototype.findAll = function (selector) {
            return this.el.querySelectorAll(selector);
        };
        Dom.prototype.$$ = function (selector) {
            return spread(this.findAll(selector)).map(function (node) {
                return new Dom(node);
            });
        };
        Dom.prototype.empty = function () {
            return this.html('');
        };
        Dom.prototype.append = function (el) {
            if (isString(el)) {
                this.el.appendChild(document.createTextNode(el));
            }
            else {
                this.el.appendChild(el.el || el);
            }
            return this;
        };
        Dom.prototype.appendTo = function (target) {
            var t = target.el ? target.el : target;
            t.appendChild(this.el);
            return this;
        };
        Dom.prototype.remove = function () {
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
            return this;
        };
        Dom.prototype.text = function (value) {
            if (arguments.length == 0) {
                return this.el.textContent;
            }
            else {
                this.el.textContent = value;
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
        Dom.prototype.css = function (key, value) {
            var _this = this;
            if (arguments.length == 2) {
                this.el.style[key] = value;
            }
            else if (arguments.length == 1) {
                if (isString(key)) {
                    return getComputedStyle(this.el)[key];
                }
                else {
                    var keys = key || {};
                    Object.keys(keys).forEach(function (k) {
                        _this.el.style[k] = keys[k];
                    });
                }
            }
            return this;
        };
        Dom.prototype.cssText = function (value) {
            if (isUndefined(value)) {
                return this.el.style.cssText;
            }
            this.el.style.cssText = value;
            return this;
        };
        Dom.prototype.cssFloat = function (key) {
            return parseFloat(this.css(key));
        };
        Dom.prototype.cssInt = function (key) {
            return parseInt(this.css(key));
        };
        Dom.prototype.px = function (key, value) {
            return this.css(key, value + 'px');
        };
        Dom.prototype.rect = function () {
            return this.el.getBoundingClientRect();
        };
        Dom.prototype.offset = function () {
            var rect = this.rect();
            var scrollTop = Dom.getScrollTop();
            var scrollLeft = Dom.getScrollLeft();
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        };
        Dom.prototype.offsetLeft = function () {
            return this.offset().left;
        };
        Dom.prototype.offsetTop = function () {
            return this.offset().top;
        };
        Dom.prototype.position = function () {
            if (this.el.style.top) {
                return {
                    top: parseFloat(this.css('top')),
                    left: parseFloat(this.css('left'))
                };
            }
            else {
                return this.rect();
            }
        };
        Dom.prototype.size = function () {
            return [this.width(), this.height()];
        };
        Dom.prototype.width = function () {
            return this.el.offsetWidth || this.rect().width;
        };
        Dom.prototype.contentWidth = function () {
            return this.width() - this.cssFloat('padding-left') - this.cssFloat('padding-right');
        };
        Dom.prototype.height = function () {
            return this.el.offsetHeight || this.rect().height;
        };
        Dom.prototype.contentHeight = function () {
            return this.height() - this.cssFloat('padding-top') - this.cssFloat('padding-bottom');
        };
        Dom.prototype.val = function (value) {
            if (arguments.length == 0) {
                return this.el.value;
            }
            else if (arguments.length == 1) {
                this.el.value = value;
            }
            return this;
        };
        Dom.prototype.int = function () {
            return parseInt(this.el.value, 10);
        };
        Dom.prototype.float = function () {
            return parseFloat(this.el.value);
        };
        Dom.prototype.show = function () {
            return this.css('display', 'block');
        };
        Dom.prototype.hide = function () {
            return this.css('display', 'none');
        };
        Dom.prototype.toggle = function (isForce) {
            var currentHide = this.css('display') == 'none';
            if (arguments.length == 1) {
                currentHide = isForce;
            }
            if (currentHide) {
                return this.show();
            }
            else {
                return this.hide();
            }
        };
        Dom.prototype.scrollTop = function () {
            if (this.el === document.body) {
                return Dom.getScrollTop();
            }
            return this.el.scrollTop;
        };
        Dom.prototype.scrollLeft = function () {
            if (this.el === document.body) {
                return Dom.getScrollLeft();
            }
            return this.el.scrollLeft;
        };
        Dom.prototype.on = function (eventName, callback, opt1, opt2) {
            this.el.addEventListener(eventName, callback, opt1, opt2);
            return this;
        };
        Dom.prototype.off = function (eventName, callback) {
            this.el.removeEventListener(eventName, callback);
            return this;
        };
        Dom.prototype.getElement = function () {
            return this.el;
        };
        Dom.prototype.createChild = function (tag, className, attrs, css) {
            if (className === void 0) { className = ''; }
            if (attrs === void 0) { attrs = {}; }
            if (css === void 0) { css = {}; }
            var $element = new Dom(tag, className, attrs);
            $element.css(css);
            this.append($element);
            return $element;
        };
        Dom.prototype.firstChild = function () {
            return new Dom(this.el.firstElementChild);
        };
        Dom.prototype.children = function () {
            var element = this.el.firstElementChild;
            if (!element) {
                return [];
            }
            var results = [];
            do {
                results.push(new Dom(element));
                element = element.nextElementSibling;
            } while (element);
            return results;
        };
        Dom.prototype.childLength = function () {
            return this.el.children.length;
        };
        Dom.prototype.replace = function (newElement) {
            this.el.parentNode.replaceChild(newElement.el || newElement, this.el);
            return this;
        };
        Dom.prototype.checked = function (isChecked) {
            if (isChecked === void 0) { isChecked = false; }
            if (arguments.length == 0) {
                return !!this.el.checked;
            }
            this.el.checked = !!isChecked;
            return this;
        };
        return Dom;
    }());
    //# sourceMappingURL=Dom.js.map

    var KEY_ALT = 'ALT';
    var KEY_SHIFT = 'SHIFT';
    var KEY_META = 'META';
    var KEY_CONTROL = 'CONTROL';
    // event name regular expression
    var CHECK_LOAD_PATTERN = /^load (.*)/ig;
    var CHECK_PATTERN = /^(click|mouse(down|up|move|over|out|enter|leave)|pointer(start|move|end)|touch(start|move|end)|key(down|up|press)|drag|dragstart|drop|dragover|dragenter|dragleave|dragexit|dragend|contextmenu|change|input|ttingttong|tt|paste|resize|scroll)/ig;
    var NAME_SAPARATOR = ':';
    var CHECK_SAPARATOR = '|';
    var LOAD_SAPARATOR = 'load ';
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
    var Event = {
        addEvent: function (dom, eventName, callback, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            if (dom) {
                dom.addEventListener(eventName, callback, useCapture);
            }
        },
        removeEvent: function (dom, eventName, callback) {
            if (dom) {
                dom.removeEventListener(eventName, callback);
            }
        },
        pos: function (e) {
            if (e.touches && e.touches[0]) {
                return e.touches[0];
            }
            return e;
        },
        posXY: function (e) {
            var pos = this.pos(e);
            return {
                x: pos.pageX,
                y: pos.pageY
            };
        }
    };
    //# sourceMappingURL=Event.js.map

    var DomEventObject = /** @class */ (function () {
        function DomEventObject(eventName, isControl, isShift, isAlt, isMeta, codes, useCapture, debounce, checkMethodList) {
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
        return DomEventObject;
    }());
    //# sourceMappingURL=DomEventObject.js.map

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
                el = context.el || context.$el || context.$root;
            }
            if (el instanceof Dom) {
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
            return new DomEventObject(eventName, isControl, isShift, isAlt, isMeta, arr, useCapture, debounceTime, checkMethodList);
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
                hasKeyCode = (e.code ? eventObject.codes.includes(e.code.toLowerCase()) : false) || (e.key ? eventObject.codes.includes(e.key.toLowerCase()) : false);
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
                        e.$delegateTarget = new Dom(delegateTarget);
                        e.xy = Event.posXY(e);
                        if (_this.checkEventType(e, eventObject)) {
                            return callback(e, e.$delegateTarget, e.xy);
                        }
                    }
                };
            }
            else {
                return function (e) {
                    e.xy = Event.posXY(e);
                    if (_this.checkEventType(e, eventObject)) {
                        return callback(e);
                    }
                };
            }
        };
        EventParser.addEvent = function (eventObject, callback, context) {
            eventObject.callback = EventParser.makeCallback(eventObject, callback);
            context.addBinding(eventObject);
            Event.addEvent(eventObject.dom, eventObject.eventName, eventObject.callback, eventObject.useCapture);
        };
        EventParser.removeEventAll = function (context) {
            context.getBindings().forEach(function (obj) {
                EventParser.removeEvent(obj, context);
            });
            context.initBindings();
        };
        EventParser.removeEvent = function (_a, context) {
            var eventName = _a.eventName, dom = _a.dom, callback = _a.callback;
            Event.removeEvent(dom, eventName, callback);
        };
        return EventParser;
    }());

    var EventMachin = /** @class */ (function () {
        function EventMachin() {
            this.refs = {};
            this.children = {};
            this.childComponents = this.components();
        }
        EventMachin.prototype.render = function ($container) {
            this.$el = this.parseTemplate(this.template());
            this.refs.$el = this.$el;
            if ($container)
                $container.html(this.$el);
            this.load();
            this.afterRender();
        };
        EventMachin.prototype.afterRender = function () { };
        /**
         * Define Child Component
         */
        EventMachin.prototype.components = function () {
            return {};
        };
        EventMachin.prototype.parseTemplate = function (html, isLoad) {
            var _this = this;
            if (Array.isArray(html)) {
                html = html.join('');
            }
            var list = new Dom("div").html(html).children();
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
                fragment.appendChild($el.el);
            });
            if (!isLoad) {
                return list[0];
            }
            return fragment;
        };
        EventMachin.prototype.parseComponent = function () {
            var _this = this;
            var $el = this.$el;
            Object.keys(this.childComponents).forEach(function (ComponentName) {
                var Component = _this.childComponents[ComponentName];
                var targets = $el.$$("" + ComponentName.toLowerCase());
                targets.forEach(function ($dom) {
                    var props = {};
                    $dom.attrs().filter(function (t) {
                        return ['ref'].indexOf(t.nodeName) < 0;
                    }).forEach(function (t) {
                        props[t.nodeName] = t.nodeValue;
                    });
                    var refName = $dom.attr('ref') || ComponentName;
                    if (refName) {
                        if (Component) {
                            var instance = new Component(_this, props);
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
        EventMachin.prototype.load = function () {
            var _this = this;
            this.filterProps(CHECK_LOAD_PATTERN).forEach(function (callbackName) {
                var elName = callbackName.split(LOAD_SAPARATOR)[1];
                if (_this.refs[elName]) {
                    var fragment = _this.parseTemplate(_this[callbackName].call(_this), true);
                    _this.refs[elName].html(fragment);
                }
            });
            this.parseComponent();
        };
        EventMachin.prototype.template = function () {
            return '<div></div>';
        };
        EventMachin.prototype.initialize = function () {
        };
        EventMachin.prototype.eachChildren = function (callback) {
            var _this = this;
            if (!isFunction(callback))
                return;
            Object.keys(this.children).forEach(function (ChildComponentName) {
                callback(_this.children[ChildComponentName]);
            });
        };
        EventMachin.prototype.initializeEvent = function () {
            this.initializeEventMachin();
            this.eachChildren(function (Component) {
                Component.initializeEvent();
            });
        };
        EventMachin.prototype.destroy = function () {
            this.destroyEventMachin();
            // this.refs = {} 
            this.eachChildren(function (Component) {
                Component.destroy();
            });
        };
        EventMachin.prototype.destroyEventMachin = function () {
            this.removeEventAll();
        };
        EventMachin.prototype.initializeEventMachin = function () {
            this.filterProps(CHECK_PATTERN).forEach(this.parseEvent.bind(this));
        };
        EventMachin.prototype.collectProps = function () {
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
        EventMachin.prototype.filterProps = function (pattern) {
            return this.collectProps().filter(function (key) {
                return key.match(pattern);
            });
        };
        EventMachin.prototype.parseEvent = function (key) {
            EventParser.parse(key, this);
        };
        /* magic check method  */
        EventMachin.prototype.self = function (e) {
            return e.$delegateTarget.el == e.target;
        };
        EventMachin.prototype.getBindings = function () {
            if (!this._bindings) {
                this.initBindings();
            }
            return this._bindings;
        };
        EventMachin.prototype.addBinding = function (obj) {
            this.getBindings().push(obj);
        };
        EventMachin.prototype.initBindings = function () {
            this._bindings = [];
        };
        EventMachin.prototype.removeEventAll = function () {
            EventParser.removeEventAll(this);
        };
        return EventMachin;
    }());
    //# sourceMappingURL=EventMachin.js.map

    // const CHECK_STORE_PATTERN = /^@/
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
    var UIElement = /** @class */ (function (_super) {
        __extends(UIElement, _super);
        function UIElement(opt, props) {
            var _this = _super.call(this) || this;
            _this.opt = opt || {};
            _this.parent = _this.opt;
            _this.props = props || {};
            _this.source = uuid();
            // window[this.source] = this; 
            if (opt && opt.$store) {
                _this.$store = opt.$store;
            }
            _this.created();
            _this.initialize();
            _this.initializeStoreEvent();
            return _this;
        }
        UIElement.prototype.created = function () {
        };
        UIElement.prototype.getRealEventName = function (e, s) {
            if (s === void 0) { s = PREFIX; }
            var startIndex = e.indexOf(s);
            return e.substr(startIndex == 0 ? 0 : startIndex + s.length);
        };
        /**
         * initialize store event
         *
         * you can define '@xxx' method(event) in UIElement
         *
         *
         */
        UIElement.prototype.initializeStoreEvent = function () {
            var _this = this;
            this.storeEvents = {};
            this.filterProps(CHECK_STORE_MULTI_PATTERN).forEach(function (key) {
                var events = _this.getRealEventName(key, MULTI_PREFIX);
                var callback = _this[key].bind(_this);
                events.split(SPLITTER).forEach(function (e) {
                    e = _this.getRealEventName(e);
                    _this.storeEvents[e] = callback;
                    _this.$store.on(e, _this.storeEvents[e], _this);
                });
            });
        };
        UIElement.prototype.destoryStoreEvent = function () {
            var _this = this;
            Object.keys(this.storeEvents).forEach(function (event) {
                _this.$store.off(event, _this.storeEvents[event]);
            });
        };
        UIElement.prototype.read = function (action) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            return (_a = this.$store).read.apply(_a, [action].concat(args));
        };
        UIElement.prototype.i18n = function (key) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.read.apply(this, ['i18n/get', key].concat(args));
        };
        UIElement.prototype.run = function (action) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            return (_a = this.$store).run.apply(_a, [action].concat(args));
        };
        UIElement.prototype.dispatch = function (action) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            this.$store.source = this.source;
            return (_a = this.$store).dispatch.apply(_a, [action].concat(args));
        };
        UIElement.prototype.emit = function (eventType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            this.$store.source = this.source;
            (_a = this.$store).emit.apply(_a, [eventType].concat(args));
        };
        UIElement.prototype.commit = function (eventType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.run.apply(this, ['item/set'].concat(args));
            this.emit.apply(this, [eventType].concat(args));
        };
        return UIElement;
    }(EventMachin));
    //# sourceMappingURL=UIElement.js.map

    var GETTER_PREFIX = '*/';
    var ACTION_PREFIX = '/';
    function GETTER(str) {
        return GETTER_PREFIX + str;
    }
    function ACTION(str) {
        return ACTION_PREFIX + str;
    }
    //# sourceMappingURL=Store.js.map

    var PREVENT = 'PREVENT';
    var BaseStore = /** @class */ (function () {
        function BaseStore(opt) {
            this.callbacks = [];
            this.actions = [];
            this.getters = [];
            this.modules = opt.modules || [];
            this.items = {};
            this.initialize();
        }
        BaseStore.prototype.initialize = function () {
            this.initializeModule();
        };
        BaseStore.prototype.initializeModule = function () {
            var _this = this;
            this.modules.forEach(function (ModuleClass) {
                _this.addModule(ModuleClass);
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
                if (ret != PREVENT) {
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
                m.callback.apply(m.context, [this].concat(opts));
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
        BaseStore.prototype.addModule = function (ModuleClass) {
            return new ModuleClass(this);
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
            if (arguments.length == 0) {
                this.callbacks = [];
            }
            else if (arguments.length == 1) {
                this.callbacks = this.callbacks.filter(function (f) {
                    return f.event != event;
                });
            }
            else if (arguments.length == 2) {
                this.callbacks = this.callbacks.filter(function (f) {
                    return !(f.event == event && f.originalCallback == originalCallback);
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
                return (f.event == event);
            }).forEach(function (f) {
                if (f && isFunction(f.callback) && f.context.source != _this.source) {
                    f.callback.apply(f, args);
                }
            });
        };
        return BaseStore;
    }());
    //# sourceMappingURL=BaseStore.js.map

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
    //# sourceMappingURL=BaseModule.js.map

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
        EditorManager.prototype[ACTION('editor.save')] = function ($store, value) {
            $store.set('editor.savedata', value.savedata || false);
        };
        return EditorManager;
    }(BaseModule));
    //# sourceMappingURL=EditorManager.js.map

    var ModuleList = [
        EditorManager
    ];
    //# sourceMappingURL=index.js.map

    var BaseEditor = /** @class */ (function (_super) {
        __extends(BaseEditor, _super);
        function BaseEditor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseEditor.prototype.initialize = function (modules) {
            if (modules === void 0) { modules = []; }
            this.$store = new BaseStore({
                modules: ModuleList.concat(modules)
            });
            this.$body = new Dom(this.getContainer());
            this.$root = new Dom('div', 'summernote');
            this.$body.append(this.$root);
            if (this.opt.type) { // to change css style
                this.$root.addClass(this.opt.type);
            }
            this.render(this.$root);
            // 이벤트 연결 
            this.initializeEvent();
        };
        BaseEditor.prototype.getContainer = function () {
            return this.opt.container || document.body;
        };
        return BaseEditor;
    }(UIElement));
    //# sourceMappingURL=BaseEditor.js.map

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
            console.log(this.read('editor.savedata'));
            this.emit('SAVE');
        };
        return Toolbar;
    }(UIElement));
    //# sourceMappingURL=Toolbar.js.map

    var Editor = /** @class */ (function (_super) {
        __extends(Editor, _super);
        function Editor(opt, props) {
            return _super.call(this, opt, props) || this;
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
            console.log('fire save event');
        };
        return Editor;
    }(BaseEditor));
    //# sourceMappingURL=editor.js.map

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
    //# sourceMappingURL=main.js.map

    exports.create = create;
    exports.main = main;

    return exports;

}({}));
