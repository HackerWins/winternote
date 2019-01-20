import { assert } from 'chai';
import * as sinon from 'sinon';
import { BaseStore, BaseStoreOption } from '../../src/util/BaseStore';
import { Component, EVENT } from '../../src/util/Component';
import { CLICK } from '../../src/util/EventUtil';


describe('util: Component', () => {
  let checkCallback = null; 
  beforeEach ( () => {
    checkCallback = sinon.spy();
  });

  it('check to create Component', () => {
    const component = new Component();

    assert.equal(component.template(), '<div></div>');
  });

  it('check to define click event', () => {
    
    class TempComponent extends Component {

      initialize (): void {
        this.$store = new BaseStore({} as BaseStoreOption);

        this.render();

        this.initializeEvent();
      }

      components(): object {
        return { TempSecondComponent };
      }

      template(): string {
        return `<div><TempSecondComponent ref="second"></TempSecondComponent></div>`;
      }

      [EVENT('CLICK_EVENT')] (): void {
        checkCallback('CLICK_EVENT');
      }

      start(): void {
        this.emit('CLICK_BUTTON');
      }
    }

    class TempSecondComponent extends Component {
      template (): string {
        return `<button></button>`;
      }

      [CLICK()] (e): void {
        this.emit('CLICK_EVENT');
      }

      [EVENT('CLICK_BUTTON')] (): void {
        this.$el.element.click();
      }
    }

    const temp = new TempComponent();
    temp.start();

    assert.equal(checkCallback.called, true);
    
  });


  it('check to define custom message event', () => {
    
    class TempComponent extends Component {

      initialize (): void {
        this.$store = new BaseStore({} as BaseStoreOption);

        this.render();

        this.initializeEvent();
      }

      start(): void {
        this.emit('message', 'call message');
      }
    }

    const temp = new TempComponent();
    temp.on('message', (msg: string): void => {
      checkCallback(msg);
    });
    temp.start();

    assert.equal(checkCallback.calledWith('call message'), true);
    
  });

});
