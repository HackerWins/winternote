import { LOAD_SAPARATOR } from "./pattern/LOAD_CHECK_PATTERN";

export const KEY_ALT = 'ALT';
export const KEY_SHIFT = 'SHIFT';
export const KEY_META = 'META';
export const KEY_CONTROL = 'CONTROL';

export const KEY_ARROW_UP = 'ArrowUp';
export const KEY_ARROW_DOWN = 'ArrowDown';
export const KEY_ARROW_LEFT = 'ArrowLeft';
export const KEY_ARROW_RIGHT = 'ArrowRight';

export class EventChecker {
  value: string;
  split: string;
  
  constructor (value: string, split = CHECK_SAPARATOR) {
      this.value = value; 
      this.split = split;
  }

  toString (): string {
      return ` ${this.split} ` + this.value; 
  }
}

export const NAME_SAPARATOR = ':';
export const CHECK_SAPARATOR = '|';
export const SAPARATOR = ' ';

const DOM_EVENT_MAKE = (...keys) => {
    const key = keys.join(NAME_SAPARATOR);
    return (...args) => {
        return [key, ...args].join(SAPARATOR);
    };
};


export const CUSTOM = DOM_EVENT_MAKE;
export const CLICK = DOM_EVENT_MAKE('click');
export const DOUBLECLICK = DOM_EVENT_MAKE('dblclick');
export const MOUSEDOWN = DOM_EVENT_MAKE('mousedown');
export const MOUSEUP = DOM_EVENT_MAKE('mouseup');
export const MOUSEMOVE = DOM_EVENT_MAKE('mousemove');
export const MOUSEOVER = DOM_EVENT_MAKE('mouseover');
export const MOUSEOUT = DOM_EVENT_MAKE('mouseout');
export const MOUSEENTER = DOM_EVENT_MAKE('mouseenter');
export const MOUSELEAVE = DOM_EVENT_MAKE('mouseleave');
export const TOUCHSTART = DOM_EVENT_MAKE('touchstart');
export const TOUCHMOVE = DOM_EVENT_MAKE('touchmove');
export const TOUCHEND = DOM_EVENT_MAKE('touchend');
export const KEYDOWN = DOM_EVENT_MAKE('keydown');
export const KEYUP = DOM_EVENT_MAKE('keyup');
export const KEYPRESS = DOM_EVENT_MAKE('keypress');
export const DRAG = DOM_EVENT_MAKE('drag');
export const DRAGSTART = DOM_EVENT_MAKE('dragstart');
export const DROP = DOM_EVENT_MAKE('drop');
export const DRAGOVER = DOM_EVENT_MAKE('dragover');
export const DRAGENTER = DOM_EVENT_MAKE('dragenter');
export const DRAGLEAVE = DOM_EVENT_MAKE('dragleave');
export const DRAGEXIT = DOM_EVENT_MAKE('dragexit');
export const DRAGOUT = DOM_EVENT_MAKE('dragout');
export const DRAGEND = DOM_EVENT_MAKE('dragend');
export const CONTEXTMENU = DOM_EVENT_MAKE('contextmenu');
export const CHANGE = DOM_EVENT_MAKE('change');
export const INPUT = DOM_EVENT_MAKE('input');
export const PASTE = DOM_EVENT_MAKE('paste');
export const RESIZE = DOM_EVENT_MAKE('resize');
export const SCROLL = DOM_EVENT_MAKE('scroll');
export const POINTERSTART = CUSTOM('mousedown', 'touchstart');
export const POINTERMOVE = CUSTOM('mousemove', 'touchmove');
export const POINTEREND = CUSTOM('mouseup', 'touchend');
export const CHANGEINPUT = CUSTOM('change', 'input');

// Predefined CHECKER 
export const CHECKER = (value, split = CHECK_SAPARATOR) => {
    return new EventChecker(value, split);
};

export const ALT = CHECKER('ALT');
export const SHIFT = CHECKER('SHIFT');
export const META = CHECKER('META');
export const CONTROL = CHECKER('CONTROL');

export const ARROW_UP = CHECKER('ArrowUp');
export const ARROW_DOWN = CHECKER('ArrowDown');
export const ARROW_LEFT = CHECKER('ArrowLeft');
export const ARROW_RIGHT = CHECKER('ArrowRight');

export const SELF = CHECKER('self');
export const CAPTURE = CHECKER('capture');

export const DEBOUNCE = (debounce = 100) => {
    return CHECKER(`debounce(${debounce})`);
};


// Predefined LOADER
export const LOAD = (value = '$el') => {
    return LOAD_SAPARATOR + value; 
};

export interface EventPositionInterface {
  x: number;
  y: number;
}

export class EventUtil {    

    static addEvent (
      obj: Element, 
      eventName: string, 
      callback: EventListenerOrEventListenerObject, 
      useCapture = false
    ): void {
        if (obj) {
          obj.addEventListener(eventName, callback, useCapture);
        }
    }
   
    static removeEvent(obj, eventName, callback): void {
        if (obj) {
          obj.removeEventListener(eventName, callback);
        }
    }

    static pos(e: Event|MouseEvent|TouchEvent): MouseEvent| Touch {
        if (e instanceof TouchEvent && e.touches && e.touches[0]) {
            return e.touches[0];
        }
    
        return e as MouseEvent;
    }

    static posXY (e: Event|MouseEvent|TouchEvent): EventPositionInterface {
        const pos = EventUtil.pos(e);
        return {
            x: pos.pageX,
            y: pos.pageY
        };
    }
}
