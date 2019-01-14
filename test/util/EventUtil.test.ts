import { assert } from 'chai';
import { ALT, CLICK, CUSTOM, DEBOUNCE, SELF, SHIFT } from '../../src/util/EventUtil';


describe('util: EventUtil', () => {
  it('check CLICK() event', () => {
    assert.equal( CLICK(), 'click' );
    assert.equal( CLICK('yellow'), 'click yellow' );
    assert.equal( CLICK('yellow', 'simple'), 'click yellow simple' );
    assert.equal( CLICK('yellow', 'simple') + ALT, 'click yellow simple | ALT' );
    assert.equal( CLICK('yellow', 'simple') + ALT + SHIFT, 'click yellow simple | ALT | SHIFT' );
    assert.equal( CLICK() + ALT + SHIFT + SELF, 'click | ALT | SHIFT | self' );
    assert.equal( CLICK() + ALT + SHIFT + DEBOUNCE(30), 'click | ALT | SHIFT | debounce(30)' );

  });

  it('check CUSTOM() event', () => {
    const SUMMERNOTE_CHANGE = CUSTOM('summernote.change');
    assert.equal( SUMMERNOTE_CHANGE('idString'), 'summernote.change idString' );
    assert.equal( CUSTOM('summernote.change')('yellow'), 'summernote.change yellow' );
    assert.equal( CUSTOM('summernote.focus')('e'), 'summernote.focus e' );
  });
});
