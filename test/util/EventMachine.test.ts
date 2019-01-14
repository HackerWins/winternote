import { assert } from 'chai';
import * as sinon from 'sinon';
import { DOMElement } from '../../src/util/DOMElement';
import { EventMachine } from '../../src/util/EventMachine';
import { CLICK, LOAD, RESIZE, SHIFT } from '../../src/util/EventUtil';

const createMouseEvent = (
  eventName: string, 
  shiftKey: boolean, 
  ctrlKey: boolean, 
  altKey: boolean, 
  metaKey: boolean
): MouseEvent => {
  const event = new MouseEvent(eventName);

  event.initMouseEvent(eventName, false, false, document.defaultView,
    0, 0, 0, 0, 0,
    ctrlKey, altKey, shiftKey, metaKey, 0, null);

  return event;
};

const createAltClickEvent = (): MouseEvent => {
  return createMouseEvent('click', false, false, true, false);
};

const createShiftClickEvent = (): MouseEvent => {
  return createMouseEvent('click', true, false, false, false);
};

const fireEvent = (obj: DOMElement|EventMachine|HTMLElement|Window|Document, eventObject) => {

  if (obj instanceof DOMElement) {
    obj.element.dispatchEvent(eventObject);
  } else if (obj instanceof EventMachine) {
    obj.$el.element.dispatchEvent(eventObject);
  } else if (obj instanceof HTMLElement || obj instanceof Window || obj instanceof Document) {
    obj.dispatchEvent(eventObject);        
  } 
};

const CLICK_EVENT: string = CLICK();
const CLICK_EVENT_WITH_SHIFT: string = CLICK() + SHIFT;
const RESIZE_EVENT_WITH_WINDOW: string = RESIZE('window');

describe('util: EventMachine', () => {
  let checkCallback = null; 
  beforeEach ( () => {
    checkCallback = sinon.spy();
  });

  it('check to create EventMachine', () => {
    const machine = new EventMachine();

    assert.equal(machine.template(), '<div></div>');
  });

  it('check to define click event', () => {
    
    class TempElement extends EventMachine {
      [CLICK_EVENT] (e): void {
        checkCallback(CLICK_EVENT);
      }
    }

    const temp = new TempElement();
    temp.render(new DOMElement(document.body));
    temp.initializeEvent();

    fireEvent(temp, new MouseEvent(CLICK_EVENT));

    assert.equal(checkCallback.calledWith('click'), true);
    
  });

  it('check to define click event with shift key', () => {
    
    class TempElement extends EventMachine {
      [CLICK_EVENT_WITH_SHIFT] (e): void {
        checkCallback(CLICK_EVENT_WITH_SHIFT);
      }
    }

    const temp = new TempElement();
    temp.render(new DOMElement(document.body));
    temp.initializeEvent();
    
    fireEvent(temp, createShiftClickEvent());

    assert.equal(checkCallback.calledWith(CLICK_EVENT_WITH_SHIFT), true);
    
  });  

  it('check to define window event', () => {
    class TempElement extends EventMachine {
      [RESIZE_EVENT_WITH_WINDOW] (e): void {
        checkCallback(RESIZE_EVENT_WITH_WINDOW);
      }
    }

    const temp = new TempElement();
    temp.render(new DOMElement(document.body));
    temp.initializeEvent();

    fireEvent(window, new Event('resize'));

    assert.equal(checkCallback.calledWith(RESIZE_EVENT_WITH_WINDOW), true);
    
  });

  it('check to set default template', () => {
    class TempElement extends EventMachine {
      template(): string { return `<div class="summernote"></div>`; }
    }

    const temp = new TempElement();
    temp.render(new DOMElement(document.body));

    assert.equal(temp.$el.hasClass('summernote'), true);
  });

  it('check to load template', () => {
    class TempElement extends EventMachine {
      template(): string { return `<div class="summernote"></div>`; }
      [LOAD('$el')] (): string { return `<div class="sample-list"><a class='link'>Link</a></div>`; }
    }

    const temp = new TempElement();
    temp.render(new DOMElement(document.body));

    assert.equal( temp.$el.$('a').hasClass('link'), true);
  }); 

  it('check to define custom element', () => {

    class CustomElement extends EventMachine {
      template (): string { return `<div class='custom'>Hello, Custom Element</div>`; }
    }

    class TempElement extends EventMachine {
      components(): object { return { CustomElement }; }
      template(): string { return `<div class="summernote"><CustomElement></CustomElement></div>`; }

    }

    const temp = new TempElement();
    temp.render(new DOMElement(document.body));

    assert.equal(temp.children['CustomElement'] instanceof CustomElement, true);
    assert.isNotNull( temp.$el.$('.custom'));
  });


  it('check to define custom element with reference', () => {

    class CustomElement extends EventMachine {
      template (): string { return `<div class='custom'>Hello, Custom Element</div>`; }
      show (): boolean { return true; }
    }

    class TempElement extends EventMachine {
      components(): object { return { CustomElement }; }
      template(): string { return `
        <div class="summernote"><CustomElement ref="yellowElement"></CustomElement></div>
      `; }

    }

    const temp = new TempElement();
    temp.render(new DOMElement(document.body));

    assert.equal(temp.children['yellowElement'] instanceof CustomElement, true);
    assert.equal(temp.children['yellowElement'].$el.text(), 'Hello, Custom Element');
    assert.equal(temp.children['yellowElement'].show(), true);
  });
});
