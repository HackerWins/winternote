import Event, { CHECK_PATTERN, NAME_SAPARATOR, CHECK_SAPARATOR, SAPARATOR, KEY_CONTROL, KEY_SHIFT, KEY_ALT, KEY_META } from './Event'
import Dom from './Dom'
import { debounce, isFunction, spread, includes, pushArray } from './func';
import EventMachin from './EventMachin';
import DomEventObject from './DomEventObject';

const META_KEYS = [ KEY_CONTROL, KEY_SHIFT, KEY_ALT, KEY_META];

export default class EventParser {

  static parse (key: string, context: EventMachin) {
    let checkMethodFilters: Array<string> = key.split(CHECK_SAPARATOR).map(it => it.trim());
    var eventSelectorAndBehave: string = checkMethodFilters.shift() ;

    var [eventName, ...params] = eventSelectorAndBehave.split(SAPARATOR);
    var eventNames: Array<string> =  EventParser.getEventNames(eventName)
    var callback = context[key].bind(context)
    
    eventNames.forEach(eventName => {
      var eventInfo: Array<string> = pushArray([eventName], params)
      EventParser.bindingEvent(eventInfo, checkMethodFilters, callback, context);
    })
  }  

  static getEventNames (eventName: string): Array<string> {
    let results: Array<string> = [] 

    eventName.split(NAME_SAPARATOR).forEach(e => {
      var arr = e.split(NAME_SAPARATOR)

      results = pushArray<string>(results, arr)
    })

    return results; 
  }


  static getDefaultDomElement (dom: string, context: EventMachin): Element {
    let el: Element; 

    if (dom) {
      el = context.refs[dom] || context[dom] || window[dom]; 
    } else {
      el = context.el || context.$el || context.$root; 
    }

    if (el instanceof Dom) {
      return el.getElement();
    }

    return el;
  }

  /* magic check method  */ 

  static getDefaultEventObject (eventName: string, checkMethodFilters: Array<string>): DomEventObject {
    const isControl = includes(checkMethodFilters, KEY_CONTROL);
    const isShift =  includes(checkMethodFilters, KEY_SHIFT);
    const isAlt = includes(checkMethodFilters, KEY_ALT);
    const isMeta =  includes(checkMethodFilters, KEY_META);

    var arr = checkMethodFilters.filter((code) => {
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
    })

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
    })

    let useCapture = false; 
    if (capturing.length) {
      useCapture = true; 
    }
    
    arr = arr.filter(code => {
      return includes(checkMethodList, code) === false 
            && includes(delay, code) === false 
            && includes(capturing, code) === false; 
    }).map(code => {
      return code.toLowerCase() 
    });

    return new DomEventObject(
      eventName,
      isControl,
      isShift,
      isAlt,
      isMeta,
      arr,
      useCapture,
      debounceTime,
      checkMethodList
    )
  }

  static bindingEvent ([ eventName, dom, ...delegate]: any[], checkMethodFilters: Array<string>, callback: Function, context: EventMachin) {
    let eventObject: DomEventObject = EventParser.getDefaultEventObject(eventName, checkMethodFilters);

    eventObject.dom = EventParser.getDefaultDomElement(dom, context);
    eventObject.delegate = delegate.join(SAPARATOR);

    EventParser.addEvent(eventObject, callback, context);
  }

  static matchPath(el: Element, selector: string) {
    if (el) {
      if (el.matches(selector)) { return el; }
      return EventParser.matchPath(el.parentElement, selector);
    }
    return null;
  }

  static checkEventType (e, eventObject ) {
    var onlyControl = eventObject.isControl ? e.ctrlKey : true;
    var onlyShift = eventObject.isShift ? e.shiftKey : true; 
    var onlyAlt = eventObject.isAlt ? e.altKey : true; 
    var onlyMeta = eventObject.isMeta ? e.metaKey : true; 

    var hasKeyCode = true; 
    if (eventObject.codes.length) {

      hasKeyCode =  (
        e.code ? eventObject.codes.includes(e.code.toLowerCase()) : false
      ) || (
        e.key ? eventObject.codes.includes(e.key.toLowerCase()) : false
      )        
      
    }

    var isAllCheck = true;  
    if (eventObject.checkMethodList.length) {  
      isAllCheck = eventObject.checkMethodList.every(method => {
        return this[method].call(this, e);
      });
    }

    return (onlyControl && onlyAlt && onlyShift && onlyMeta && hasKeyCode && isAllCheck);
  }

  static makeCallback ( eventObject: DomEventObject, callback: Function) {

    if (eventObject.debounce) {
      callback = debounce(callback, eventObject.debounce)
    }

    if (eventObject.delegate) {
      return (e) => {
        const delegateTarget = this.matchPath(e.target || e.srcElement, eventObject.delegate);

        if (delegateTarget) { // delegate target 이 있는 경우만 callback 실행 
          e.$delegateTarget = new Dom(delegateTarget);
          e.xy = Event.posXY(e)

          if (this.checkEventType(e, eventObject)) {
            return callback(e, e.$delegateTarget, e.xy);
          } 

        } 

      }
    }  else {
      return (e) => {
        e.xy = Event.posXY(e)        
        if (this.checkEventType(e, eventObject)) { 
          return callback(e);
        }
      }
    }
  }

  static addEvent(eventObject: DomEventObject, callback: Function, context: EventMachin) {
    eventObject.callback = EventParser.makeCallback(eventObject, callback)
    context.addBinding(eventObject);
    Event.addEvent(eventObject.dom, eventObject.eventName, eventObject.callback, eventObject.useCapture)
  }

  static removeEventAll (context: EventMachin) {
    context.getBindings().forEach(obj => {
      EventParser.removeEvent(obj, context);
    });
    context.initBindings();
  }

  static removeEvent({eventName, dom, callback}: DomEventObject, context: EventMachin) {
    Event.removeEvent(dom, eventName, callback);
  }
}
