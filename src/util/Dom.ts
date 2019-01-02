import { isNotString, isString, isUndefined, spread } from "./func";

export default class Dom {
  el: any;

    constructor (tag: string | object | Element, className?:string, attr:object = {}) {
    
        if (isNotString(tag)) {
            this.el = tag;
        } else {
    
            var el  = document.createElement('' + tag);

            if (className) {
                el.className = className;
            }

            attr = attr || {};
    
            for(var k in attr) {
                el.setAttribute(k, attr[k]);
            }
    
            this.el = el;
        }
    }

    static getScrollTop (): number {
        return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
    }

    static getScrollLeft(): number {
        return Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft)
    }

    attr (key: string, value: any): any {
        if (arguments.length == 1) {
            return this.el.getAttribute(key);
        }

        this.el.setAttribute(key, value);

        return this; 
    }

    getAttirbutes () {
      return spread(this.el.attributes);
    }

    attrs (...args: string[]): any[] {
        return args.map(key => {
            return this.el.getAttribute(key);
        })
    }

    removeAttr (key: string): Dom {
        this.el.removeAttribute(key);

        return this; 
    }

    is (checkElement: any): boolean {
        return this.el === (checkElement.el || checkElement);
    }

    closest (cls: string): Dom | null {
        
        var temp: Dom = this;
        var checkCls: boolean = false;
    
        while(!(checkCls = temp.hasClass(cls))) {
            if (temp.el.parentNode) {
                temp = new Dom(temp.el.parentNode);
            } else {
                return null;
            }
        }
    
        if (checkCls) {
            return temp;
        }
    
        return null;
    }

    parent (): Dom {
        return new Dom(this.el.parentNode);
    }
    
    removeClass (...args: string[]): Dom {

        if (this.el.className) {
            var className = this.el.className;

            args.forEach(cls => {
                className = ((` ${className} `).replace(` ${cls} `, ' ')).trim();    
            })

            this.el.className = className;
        }

        return this; 
    }
    
    hasClass (cls: string): boolean {
        if (!this.el.className)
        {
            return false;
        } else {
            var newClass = ` ${this.el.className} `;
            return newClass.indexOf(` ${cls} `) > -1;
        }
    }
    
    addClass (cls: string): Dom {
        if (!this.hasClass(cls)) {
            this.el.className = `${this.el.className} ${cls}`;
        }

        return this; 
    
    }

    toggleClass (cls: string, isForce:boolean = false) {

        if (arguments.length == 2) {
            if (isForce) {
                this.addClass(cls)
            } else {
                this.removeClass(cls);
            }
        } else {
            if (this.hasClass(cls)) {
                this.removeClass(cls);
            } else {
                this.addClass(cls);
            }
        }
    }
    
    html (html:any): Dom {

        if (arguments.length == 0) {
            return this.el.innerHTML;
        }

        if (isString( html )) {
            this.el.innerHTML = html;
        } else {
            this.empty().append(html);
        }

        return this;
    }

    find (selector:string): Element {
        return this.el.querySelector(selector)
    } 

    $ (selector: string): Dom | null {
        var node: Element = this.find(selector);
        return node ? new Dom(node) : null; 
    }

    findAll (selector: string): NodeList { 
        return this.el.querySelectorAll(selector)
    } 

    $$ (selector: string): Dom[] {
        return spread(this.findAll(selector)).map(node => {
            return new Dom(node)
        })
    }

    
    empty (): Dom {
        return this.html('');
    }
    
    append (el: any): Dom {
    
        if (isString( el )) {
            this.el.appendChild(document.createTextNode(el));
        } else {
            this.el.appendChild(el.el || el);
        }
    
        return this;
    }
    
    appendTo (target: any): Dom {
        var t = target.el ? target.el : target;
    
        t.appendChild(this.el);
    
        return this;
    }
    
    remove (): Dom {
        if (this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
    
        return this;
    }
    
    text (value?: string): Dom | string {
        if (arguments.length == 0) {
            return this.el.textContent;
        } else {
            this.el.textContent = value; 
            return this; 
        }
        
    }

    /**
     * 
     * $el.css`
     *  border-color: yellow;
     * `
     * 
     * @param {*} key 
     * @param {*} value 
     */
    
    css (key: any, value?: any): any {
        if (arguments.length == 2) {
            this.el.style[key] = value;
        } else if (arguments.length == 1) {
    
            if (isString( key )) {
                return getComputedStyle(this.el)[key];
            } else {
                var keys = key || {};
                Object.keys(keys).forEach(k => {
                    this.el.style[k] = keys[k];    
                })
            } 
    
        }
    
        return this;
    }

    cssText (value: string): Dom| string {
        if (isUndefined( value ))  {
            return this.el.style.cssText;
        }

        this.el.style.cssText = value;

        return this; 
    }

    cssFloat (key: string): number {
        return parseFloat(this.css(key));
    }

    cssInt (key: string): number {
        return parseInt(this.css(key));
    }

    px (key: string, value: any): Dom {
        return this.css(key, value + 'px' )
    }

    rect (): any {
        return this.el.getBoundingClientRect()
    }
    
    offset () {
        var rect = this.rect();

        var scrollTop = Dom.getScrollTop()
        var scrollLeft = Dom.getScrollLeft()

        return { 
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft
        };
    }

    offsetLeft () {
        return this.offset().left; 
    }

    offsetTop () {
        return this.offset().top; 
    }
    
    position () {

        if (this.el.style.top) {
            return {
                top: parseFloat(this.css('top')),
                left: parseFloat(this.css('left'))
            };
        } else {
            return this.rect();
        }

    }

    size () {
        return [this.width(), this.height()]
    }
    
    width () {
        return this.el.offsetWidth || this.rect().width;
    }

    contentWidth() {
        return this.width() - this.cssFloat('padding-left') - this.cssFloat('padding-right');
    }
    
    height () {
        return this.el.offsetHeight || this.rect().height;
    }


    contentHeight() {
        return this.height() - this.cssFloat('padding-top') - this.cssFloat('padding-bottom');
    }
    
    val (value?: any): string| Dom {
        if (arguments.length == 0) {
            return this.el.value;
        } else if (arguments.length == 1) {
            this.el.value = value;
        }
    
        return this;
    }
    
    int () {
        return parseInt(this.el.value, 10);
    }

    float () {
        return parseFloat(this.el.value);
    }
    
    show () {
        return this.css('display', 'block');
    }
    
    hide () {
        return this.css('display', 'none');
    }

    toggle (isForce) {

        var currentHide = this.css('display') == 'none'

        if (arguments.length == 1) {
            currentHide = isForce
        }

        if (currentHide) {
            return this.show();
        } else {
            return this.hide();
        }
    }

    scrollTop () {
        if (this.el === document.body) {
            return Dom.getScrollTop()
        }

        return this.el.scrollTop
    } 

    scrollLeft () {
        if (this.el === document.body) {
            return Dom.getScrollLeft()
        }

        return this.el.scrollLeft
    }

    on (eventName, callback, opt1, opt2) {
        this.el.addEventListener(eventName, callback, opt1, opt2);

        return this; 
    }

    off (eventName, callback ) {
        this.el.removeEventListener(eventName, callback);

        return this; 
    }

    getElement ( ) {
        return this.el;
    }

    createChild (tag: string, className: string = '', attrs: any = {}, css: any = {}): Dom {
        let $element = new Dom(tag, className, attrs);
        $element.css(css);

        this.append($element);

        return $element;
    }

    firstChild () {
        return new Dom(this.el.firstElementChild);
    }

    children () {
        var element = this.el.firstElementChild; 

        if (!element) {
            return [] 
        }

        var results = [] 

        do {
            results.push(new Dom(element));
            element = element.nextElementSibling;
        } while (element);

        return results; 
    }

    childLength () {
        return this.el.children.length;
    }

    replace (newElement) {

        this.el.parentNode.replaceChild(newElement.el || newElement, this.el);

        return this; 
    }

    checked (isChecked = false) {

        if (arguments.length == 0) {
            return !!this.el.checked; 
        }

        this.el.checked = !!isChecked;

        return this;
    }
}

