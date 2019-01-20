import { DefaultVariableType } from "../util/BaseStore";
import { isNotString, isString, isUndefined } from "./func";

export interface DOMOffsetInterface {
  top: number;
  left: number;
}

export interface KeyValue {
  key: string;
  value: string;
}

export class DOMElement {
  element: HTMLElement;

  constructor (tag: string | object | HTMLElement, className?:string, attr:object = {}) {
  
      if (isNotString(tag)) {
          this.element = tag as HTMLElement;
      } else {
  
          const element  = document.createElement('' + tag);

          if (className) {
            element.className = className;
          }

          attr = attr || {};
  
          for(const k in attr) {
            if (attr.hasOwnProperty(k)) {
              element.setAttribute(k, attr[k]);
            }
          }
  
          this.element = element;
      }
  }

  static getScrollTop (): number {
    return Math.max(
      window.pageYOffset, 
      document.documentElement.scrollTop, 
      document.body.scrollTop
    );
  }

  static getScrollLeft(): number {
    return Math.max(
      window.pageXOffset, 
      document.documentElement.scrollLeft, 
      document.body.scrollLeft
    );
  }

  attr (key: string, value?: DefaultVariableType): DefaultVariableType|DOMElement {
      if (arguments.length === 1) {
          return this.element.getAttribute(key);
      }

      this.element.setAttribute(key, value as string);

      return this; 
  }

  getAttirbutes (): string[] {
    const attrs = this.element.attributes;
    const results = [];
    for (let i = 0, len = attrs.length; i < len; i++) {
      results.push(attrs[i]);
    }

    return results;
  }

  attrs (...args: string[]): KeyValue[] {
      return args.map(key => {
          return { key, value: this.element.getAttribute(key) };
      });
  }

  removeAttr (key: string): DOMElement {
      this.element.removeAttribute(key);

      return this; 
  }

  is (checkElement: DOMElement|Element): boolean {
    if (checkElement instanceof DOMElement) {
      return this.element === checkElement.element;
    } else if (checkElement instanceof Element) {
      return this.element === checkElement;
    }
    
    return false; 
  }

  closest (cls: string): DOMElement | null {
      
      let temp: DOMElement = this;
      let checkCls = temp.hasClass(cls);

      while(!checkCls) {
          if (temp.element.parentNode) {
              temp = new DOMElement(temp.element.parentNode);
          } else {
              return null;
          }
          checkCls = temp.hasClass(cls);
      }
  
      if (checkCls) {
          return temp;
      }
  
      return null;
  }

  parent (): DOMElement {
      return new DOMElement(this.element.parentNode);
  }
  
  removeClass (...args: string[]): DOMElement {

      if (this.element.className) {
          let className = this.element.className;

          args.forEach(cls => {
              className = ((` ${className} `).replace(` ${cls} `, ' ')).trim();    
          });

          this.element.className = className;
      }

      return this; 
  }
  
  hasClass (cls: string): boolean {
      if (!this.element.className)
      {
          return false;
      } else {
          const newClass = ` ${this.element.className} `;
          return newClass.indexOf(` ${cls} `) > -1;
      }
  }
  
  addClass (cls: string): DOMElement {
      if (!this.hasClass(cls)) {
          this.element.className = `${this.element.className} ${cls}`.trim();
      }

      return this; 
  
  }

  toggleClass (cls: string, isForce = false): DOMElement {
      if (arguments.length === 2) {
          if (isForce) {
              this.addClass(cls);
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

      return this; 
  }
  
  html (html?: string|undefined|DOMElement|Element|DocumentFragment): DOMElement| string {

      if (arguments.length === 0) {
          return this.element.innerHTML;
      }

      if (isString( html )) {
          this.element.innerHTML = html + '';
      } else if (html instanceof DOMElement) {
          this.empty().append(html as DOMElement);
      } else if (html instanceof Element) {
          this.empty().append(html as Element);
        } else if (html instanceof DocumentFragment) {
          this.empty().append(html as DocumentFragment);          
      }

      return this;
  }

  find (selector:string): Element {
      return this.element.querySelector(selector);
  } 

  $ (selector: string): DOMElement | null {
      const node: Element = this.find(selector);
      return node ? new DOMElement(node) : null; 
  }

  findAll (selector: string): NodeList { 
      return this.element.querySelectorAll(selector);
  } 

  $$ (selector: string): DOMElement[] {
    const list = this.findAll(selector);

    const results = [];

    for (let i = 0, len = list.length; i < len; i++) {
      results.push(new DOMElement(list[i]));
    }

    return results;
  }

  
  empty (): DOMElement {
      return this.html('') as DOMElement;
  }
  
  append (el: string| DOMElement| Element | DocumentFragment): DOMElement {
  
      if (isString( el )) {
          this.element.appendChild(document.createTextNode(el as string));
      } else if (el instanceof DOMElement) {
          this.element.appendChild(el.element);
      } else if (el instanceof Element) {
          this.element.appendChild(el as Element);          
        } else if (el instanceof DocumentFragment) {
          this.element.appendChild(el as DocumentFragment);                    
      }
  
      return this;
  }
  
  appendTo (target: DOMElement|Element): DOMElement {
      const t = (target instanceof DOMElement) ? target.element : target;
  
      t.appendChild(this.element);
  
      return this;
  }
  
  remove (): DOMElement {
      if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
      }
  
      return this;
  }
  
  text (value?: string): DOMElement | string {
      if (arguments.length === 0) {
          return this.element.textContent;
      } else {
          this.element.textContent = value; 
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
  
  css ($1?: string|object, $2?: string): DefaultVariableType|DOMElement {
      if (arguments.length === 2) {
          this.element.style[$1 as string] = $2;
      } else if (arguments.length === 1) {
          const key = $1;
          if (isString( key )) {
              const keyString = key as string;
              return getComputedStyle(this.element)[keyString] || this.element.style[keyString];
          } else {
              const keys = (key as object) || {};
              Object.keys(keys).forEach(k => {
                  this.element.style[k] = keys[k];    
              });
          } 
  
      }
  
      return this;
  }

  cssText (value?: string): DOMElement| string {
      if (isUndefined( value ))  {
          return this.element.style.cssText;
      }

      this.element.style.cssText = value;

      return this; 
  }

  cssFloat (key: string): number {
    return +this.css(key);
  }

  cssInt (key: string): number {
    return Math.floor(+this.css(key));
  }

  px (key: string, value: number): DOMElement {
    return this.css(key, value + 'px' ) as DOMElement;
  }

  rect (): ClientRect {
    return this.element.getBoundingClientRect();
  }
  
  offset (): DOMOffsetInterface {
    const rect = this.rect();

    const scrollTop = DOMElement.getScrollTop();
    const scrollLeft = DOMElement.getScrollLeft();

    return { 
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    };
  }

  offsetLeft (): number {
    return this.offset().left; 
  }

  offsetTop (): number {
      return this.offset().top; 
  }
  
  position (): DOMOffsetInterface {

      if (this.element.style.top) {
          return {
              top: +this.css('top'),
              left: +this.css('left')
          };
      } else {
          return this.rect();
      }

  }

  size(): number[]  {
      return [this.width(), this.height()];
  }
  
  width (): number {
      return this.element.offsetWidth || this.rect().width;
  }

  contentWidth(): number {
      return this.width() - this.cssFloat('padding-left') - this.cssFloat('padding-right');
  }
  
  height (): number {
      return this.element.offsetHeight || this.rect().height;
  }


  contentHeight(): number {
      return this.height() - this.cssFloat('padding-top') - this.cssFloat('padding-bottom');
  }
  
  val (value?: DefaultVariableType): string| DOMElement {
      if (arguments.length === 0) {
          return (this.element as HTMLInputElement).value;
      } else if (arguments.length === 1) {
          const input = (this.element as HTMLInputElement);
          input.value = value as string;
      }
  
      return this;
  }
  
  int (): number {
      return Math.floor(this.float());
  }

  float (): number {
      return +(this.element as HTMLInputElement).value;
  }
  
  show (): DOMElement {
      return this.css('display', 'block') as DOMElement;
  }
  
  hide (): DOMElement {
      return this.css('display', 'none') as DOMElement;
  }

  toggle (isForce = false): DOMElement {

      let currentHide = this.css('display') === 'none';

      if (arguments.length === 1) {
          currentHide = isForce;
      }

      if (currentHide) {
          return this.show();
      } else {
          return this.hide();
      }
  }

  scrollTop (): number {
      if (this.element === document.body) {
          return DOMElement.getScrollTop();
      }

      return this.element.scrollTop;
  } 

  scrollLeft (): number {
      if (this.element === document.body) {
          return DOMElement.getScrollLeft();
      }

      return this.element.scrollLeft;
  }

  on (eventName, callback, opt1): DOMElement {
      this.element.addEventListener(eventName, callback, opt1);

      return this; 
  }

  off (eventName, callback ): DOMElement {
      this.element.removeEventListener(eventName, callback);

      return this; 
  }

  getElement ( ): Element {
      return this.element;
  }

  createChild (tag: string, className = '', attrs= {}, css= {}): DOMElement {
      const $element = new DOMElement(tag, className, attrs);
      $element.css(css);

      this.append($element);

      return $element;
  }

  firstChild (): DOMElement {
      return new DOMElement(this.element.firstElementChild);
  }

  children (): DOMElement[] {
      let element = this.element.firstElementChild; 

      if (!element) {
          return [];
      }

      const results = [];

      do {
          results.push(new DOMElement(element));
          element = element.nextElementSibling;
      } while (element);

      return results; 
  }

  childLength (): number {
      return this.element.children.length;
  }

  replace (newElement: DOMElement|Element): DOMElement {

      let element = newElement;

      if (element instanceof DOMElement) {
        element = element.element; 
      }

      this.element.parentNode.replaceChild(element, this.element);

      return this; 
  }

  checked (isChecked = false): DOMElement|boolean {

      if (arguments.length === 0) {
          return !! (this.element as HTMLInputElement).checked; 
      }

      const input = this.element as HTMLInputElement;
      input.checked = !!isChecked;

      return this;
  }
}

