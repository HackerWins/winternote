import {DOMElement} from './DOMElement';
import {DOMEventObject} from './DOMEventObject';
import {EventMachine} from './EventMachine';
import { 
  CHECK_SAPARATOR, 
  EventPositionInterface,
  EventUtil,
  KEY_ALT,   
  KEY_CONTROL, 
  KEY_META,  
  KEY_SHIFT, 
  NAME_SAPARATOR, 
  SAPARATOR
} from './EventUtil';
import { debounce, includes, pushArray } from './func';

const META_KEYS = [ KEY_CONTROL, KEY_SHIFT, KEY_ALT, KEY_META];

interface HTMLElementEvent<T extends HTMLElement> extends Event {
  target: T;
  $delegateTarget: DOMElement;
  xy: EventPositionInterface;
}

export class EventParser {

  static parse (key: string, context: EventMachine): void {
    const checkMethodFilters: string[] = key.split(CHECK_SAPARATOR).map(it => it.trim());
    const eventSelectorAndBehave: string = checkMethodFilters.shift() ;

    const [eventName, ...params] = eventSelectorAndBehave.split(SAPARATOR);
    const eventNames: string[] =  EventParser.getEventNames(eventName);
    const callback = context[key].bind(context);
    
    eventNames.forEach(eventName => {
      const eventInfo: string[] = pushArray([eventName], params);
      EventParser.bindingEvent(eventInfo, checkMethodFilters, callback, context);
    });
  }  

  static getEventNames (eventName: string): string[] {
    let results: string[] = [];

    eventName.split(NAME_SAPARATOR).forEach(e => {
      const arr = e.split(NAME_SAPARATOR);

      results = pushArray<string>(results, arr);
    });

    return results; 
  }


  static getDefaultDomElement (dom: string, context: EventMachine): Element {
    let el: Element| DOMElement; 

    if (dom) {
      el = context.refs[dom] || context[dom] || window[dom]; 
    } else {
      el = context.$el || context.$root; 
    }

    if (el instanceof DOMElement) {
      return el.getElement();
    }

    return el;
  }

  /* magic check method  */ 

  static getDefaultEventObject (eventName: string, checkMethodFilters: string[]): DOMEventObject {
    const isControl = includes(checkMethodFilters, KEY_CONTROL);
    const isShift =  includes(checkMethodFilters, KEY_SHIFT);
    const isAlt = includes(checkMethodFilters, KEY_ALT);
    const isMeta =  includes(checkMethodFilters, KEY_META);

    let arr = checkMethodFilters.filter((code) => {
      return includes(META_KEYS, code.toUpperCase()) === false;
    });
    
    const checkMethodList = arr.filter(code => {
        return !!this[code];
    });

    const delay = arr.filter(code => {
      if (code.indexOf('debounce(')  > -1) {
        return true; 
      } 
      return false; 
    });

    let debounceTime = 0; 
    if (delay.length) {
      debounceTime = +(delay[0].replace('debounce(', '').replace(')', ''));
    }

    // capture 
    const capturing = arr.filter(code => {
      if (code.indexOf('capture')  > -1) {
        return true; 
      } 
      return false; 
    });

    let useCapture = false; 
    if (capturing.length) {
      useCapture = true; 
    }
    
    arr = arr.filter(code => {
      return includes(checkMethodList, code) === false 
            && includes(delay, code) === false 
            && includes(capturing, code) === false; 
    }).map(code => {
      return code.toLowerCase();
    });

    return new DOMEventObject(
      eventName,
      isControl,
      isShift,
      isAlt,
      isMeta,
      arr,
      useCapture,
      debounceTime,
      checkMethodList
    );
  }

  static bindingEvent (
    [ eventName, dom, ...delegate]: string[], 
    checkMethodFilters: string[], 
    callback: Function, 
    context: EventMachine
  ): void {
    const eventObject = EventParser.getDefaultEventObject(eventName, checkMethodFilters);

    eventObject.dom = EventParser.getDefaultDomElement(dom, context);
    eventObject.delegate = delegate.join(SAPARATOR);

    EventParser.addEvent(eventObject, callback, context);
  }

  static matchPath(el: Element, selector: string): Element| null {
    if (el) {
      if (el.matches(selector)) { return el; }
      return EventParser.matchPath(el.parentElement, selector);
    }
    return null;
  }

  static checkEventType (e, eventObject: DOMEventObject ): boolean {
    const onlyControl = eventObject.isControl ? e.ctrlKey : true;
    const onlyShift = eventObject.isShift ? e.shiftKey : true; 
    const onlyAlt = eventObject.isAlt ? e.altKey : true; 
    const onlyMeta = eventObject.isMeta ? e.metaKey : true; 

    let hasKeyCode = true; 
    if (eventObject.codes.length) {

      hasKeyCode =  (
        e.code ? includes(eventObject.codes, e.code.toLowerCase()) : false
      ) || (
        e.key ? includes(eventObject.codes, e.key.toLowerCase()) : false
      );
      
    }

    let isAllCheck = true;  
    if (eventObject.checkMethodList.length) {  
      isAllCheck = eventObject.checkMethodList.every(method => {
        return this[method].call(this, e);
      });
    }

    return (onlyControl && onlyAlt && onlyShift && onlyMeta && hasKeyCode && isAllCheck);
  }

  static makeCallback ( eventObject: DOMEventObject, callback: Function): EventListener {

    if (eventObject.debounce) {
      callback = debounce(callback, eventObject.debounce);
    }

    if (eventObject.delegate) {
      return (e: HTMLElementEvent<HTMLElement>) => {
        const delegateTarget = this.matchPath(e.target || e.srcElement, eventObject.delegate);

        if (delegateTarget) { // delegate target 이 있는 경우만 callback 실행 
          e.$delegateTarget = new DOMElement(delegateTarget);
          e.xy = EventUtil.posXY(e);

          if (this.checkEventType(e, eventObject)) {
            return callback(e, e.$delegateTarget, e.xy);
          } 

        } 

      };
    }  else {
      return (e: HTMLElementEvent<HTMLElement>) => {
        e.xy = EventUtil.posXY(e);  
        if (this.checkEventType(e, eventObject)) { 
          return callback(e);
        }
      };
    }
  }

  static addEvent(deo: DOMEventObject, callback: Function, context: EventMachine): void {
    deo.callback = EventParser.makeCallback(deo, callback);
    context.addBinding(deo);
    EventUtil.addEvent(deo.dom, deo.eventName, deo.callback, deo.useCapture);
  }

  static removeEventAll (context: EventMachine): void {
    context.getBindings().forEach(obj => {
      EventParser.removeEvent(obj, context);
    });
    context.initBindings();
  }

  static removeEvent({eventName, dom, callback}: DOMEventObject, context: EventMachine): void {
    EventUtil.removeEvent(dom, eventName, callback);
  }
}
