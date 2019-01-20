import { assert } from 'chai';
import { DOMElement } from '../../src/util/DOMElement';


describe('util: DOMElement', () => {
  it('check to create DOMElement', () => {
    let $dom = new DOMElement('div');
    assert.equal($dom.element.nodeName, "DIV");

    $dom = new DOMElement('div', 'summernote summernote-lite');
    assert.equal($dom.hasClass('summernote'), true);
    assert.equal($dom.hasClass('summernote-lite'), true);

    $dom = new DOMElement('div', '', {
      title: 'new summernote',
    });

    assert.equal($dom.attr('title'), 'new summernote');

    const div = document.createElement('div');
    div.setAttribute('title', 'summernote editor');

    $dom = new DOMElement(div);
    assert.equal($dom.attr('title'), 'summernote editor');
  });

  it('check to handle attribute for dom element', () => {
    const $dom = new DOMElement('div');
    $dom.attr('title', 'summernote');

    assert.equal($dom.attr('title'), 'summernote');
  });

  it('check attributes in DOM', () => {
    const $dom = new DOMElement('div');
    $dom.attr('title', 'summernote');
    $dom.attr('data-value', 'yellow');

    assert.deepEqual($dom.attrs('title', 'data-value'), [
      {key: 'title', value: 'summernote'}, 
      {key: 'data-value', value: 'yellow'}
    ]);
  });

  it('check to removeAttr in dom element', () => {
    const $dom = new DOMElement('div');
    $dom.attr('title', 'summernote');

    $dom.removeAttr('title');

    assert.equal($dom.attr('title'), undefined);
  });

  it('check to closest in dom element', () => {
    const $dom = new DOMElement('div');
    $dom.html(`
      <div class='summernote'>
        <div class='child1'>
          <div class='child2'>
            <div class='child3'>
            
            </div>
          </div>
        </div>
      </div>
    `);

    const lastChild = $dom.$(".child3");

    assert.equal(lastChild instanceof DOMElement, true);

    const summernoteElement = lastChild.closest('summernote');  // check only class
    assert.equal(summernoteElement instanceof DOMElement, true);

    assert.equal(summernoteElement.hasClass('summernote'), true);

  });

  it('check to get parent element ', () => {
    const $dom = new DOMElement('div');
    $dom.html(`
      <div class='summernote'>
        <div class='child1'>
          <div class='child2'>
            <div class='child3'>
            
            </div>
          </div>
        </div>
      </div>
    `);

    const lastChild = $dom.$(".child3");
    const secondChild = $dom.$(".child2");

    assert.equal(secondChild.is(lastChild.parent()), true);
  });

  it('check to removeClass in dom element', () => {
    const $dom = new DOMElement('div', 'summernote summernote-lite summernote-body');
    $dom.removeClass('summernote-body', 'summernote');

    assert.equal($dom.hasClass('summernote-lite'), true);
    assert.equal($dom.hasClass('summernote-body'), false);

  });

  it('check to hasClass in dom element', () => {
    const $dom = new DOMElement('div', 'summernote summernote-lite summernote-body');

    assert.equal($dom.hasClass('summernote-lite'), true);
    assert.equal($dom.hasClass('summernote-body'), true);
    assert.equal($dom.hasClass('summernote'), true);
    assert.equal($dom.hasClass('summernote-2'), false);

  });

  it('check to addClass in dom element', () => {
    const $dom = new DOMElement('div');
    $dom.addClass('summernote');
    assert.equal($dom.hasClass('summernote'), true);

    $dom.addClass('summernote-lite');
    assert.equal($dom.hasClass('summernote-lite'), true);

    assert.equal($dom.element.className.trim(), 'summernote summernote-lite');
  });

  it('check to toggleClass in dom element', () => {
    const $dom = new DOMElement('div', 'summernote selected');
    $dom.toggleClass('selected');
    assert.equal($dom.hasClass('selected'), false);
    
    $dom.toggleClass('selected', true);
    assert.equal($dom.hasClass('selected'), true);

    $dom.toggleClass('selected', false);
    assert.equal($dom.hasClass('selected'), false);

  });

  it('check to set html in dom element', () => {
    const $dom = new DOMElement('div');
    $dom.html('<p>1111</p>');

    assert.equal($dom.html(), '<p>1111</p>');

    const secondDom = new DOMElement('div');
    secondDom.html('bbb');
    $dom.html(secondDom);

    assert.equal($dom.html(), '<div>bbb</div>');


    const thirdDom = document.createElement('div');
    thirdDom.innerHTML = '<a>yellow</a>';
    $dom.html(thirdDom);
    assert.equal($dom.html(), "<div><a>yellow</a></div>");

    const fourthDom = document.createDocumentFragment();
    fourthDom.appendChild(document.createElement('div'));
    fourthDom.appendChild(document.createElement('div'));
    fourthDom.appendChild(document.createElement('div'));
    fourthDom.appendChild(document.createElement('div'));

    $dom.html(fourthDom);
    assert.equal($dom.html(), '<div></div><div></div><div></div><div></div>');
  });

  it('check to find element in dom', () => {
    const $dom = new DOMElement('div');
    $dom.html(`
      <div class='summernote'>
        <div class='child1'>
          <div class='child2'>
            <div class='child3'>
            
            </div>
          </div>
        </div>
      </div>
    `);

    const child3 = $dom.find('.child3');

    assert.notEqual(child3, undefined);
    assert.notEqual(child3, null);

    assert.equal(new DOMElement(child3).hasClass('child3'), true);
  });

  it('check to find element in dom 2', () => {
    const $dom = new DOMElement('div');
    $dom.html(`
      <div class='summernote'>
        <div class='child1'>
          <div class='child2'>
            <div class='child3'>
            
            </div>
          </div>
        </div>
      </div>
    `);

    const $child3 = $dom.$('.child3');

    assert.notEqual($child3, undefined);
    assert.notEqual($child3, null);

    assert.equal($child3.hasClass('child3'), true);
  });

  it('check to find all elements in dom', () => {
    const $dom = new DOMElement('div');
    $dom.html(`
      <div class='summernote'>
        <div class='child1 child'>
          <div class='child2 child'>
            <div class='child3 child'>
            
            </div>
          </div>
        </div>
      </div>
    `);

    const list = $dom.findAll('.child');

    assert.equal(list.length, 3);

    const temp = new DOMElement('div');
    for(let i = 0, len = list.length; i < len; i++) {
      temp.addClass(new DOMElement(list[i]).removeClass('child').element.className);
    }

    assert.equal(temp.hasClass('child1'), true);
    assert.equal(temp.hasClass('child2'), true);
    assert.equal(temp.hasClass('child3'), true);
  });

  it('check to find all elements in dom', () => {
    const $dom = new DOMElement('div');
    $dom.html(`
      <div class='summernote'>
        <div class='child1 child'>
          <div class='child2 child'>
            <div class='child3 child'>
            
            </div>
          </div>
        </div>
      </div>
    `);

    const list = $dom.$$('.child');

    assert.equal(list.length, 3);

    const temp = new DOMElement('div');
    for(let i = 0, len = list.length; i < len; i++) {
      temp.addClass(list[i].removeClass('child').element.className);
    }

    assert.equal(temp.hasClass('child1'), true);
    assert.equal(temp.hasClass('child2'), true);
    assert.equal(temp.hasClass('child3'), true);
  });

  it('check to empty html in dom', () => {
    const $dom = new DOMElement('div');
    $dom.html('xxx');
    assert.equal($dom.html(), 'xxx');

    $dom.empty();
    assert.equal($dom.html(), '');
  });

  it('check to add html in dom', () => {
    const $dom = new DOMElement('div');
    $dom.append('<p>1111</p>');

    assert.equal($dom.html(), '&lt;p&gt;1111&lt;/p&gt;');

    const secondDom = new DOMElement('div');
    secondDom.html('bbb');
    $dom.append(secondDom);

    assert.equal($dom.html(), '&lt;p&gt;1111&lt;/p&gt;<div>bbb</div>');


    const thirdDom = document.createElement('div');
    thirdDom.innerHTML = '<a>yellow</a>';
    $dom.append(thirdDom);
    assert.equal($dom.html(), "&lt;p&gt;1111&lt;/p&gt;<div>bbb</div><div><a>yellow</a></div>");

    const fourthDom = document.createDocumentFragment();
    fourthDom.appendChild(document.createElement('div'));
    fourthDom.appendChild(document.createElement('div'));
    fourthDom.appendChild(document.createElement('div'));
    fourthDom.appendChild(document.createElement('div'));

    $dom.append(fourthDom);
    assert.equal(
      $dom.html(), 
      ['&lt;p&gt;1111&lt;/p&gt;',
      '<div>bbb</div><div><a>yellow</a></div>',
      '<div></div><div></div>',
      '<div></div><div></div>'].join('')
    );
  });

  it('check to appendTo in another element', () => {
    const $dom = new DOMElement('div');
    $dom.addClass('summernote-group');
    $dom.html(new DOMElement("div", "summernote-body"));

    const $body = new DOMElement(document.body);
    $body.append(new DOMElement('div', '', {id: 'summernote'}));

    const $summernote = $body.$("#summernote");
    $dom.appendTo($summernote);

    assert.equal($summernote.html(), [
      `<div class="summernote-group">`,
        `<div class="summernote-body"></div>`,
      `</div>`
    ].join(''));
  });

  it('check to remove element in dom', () => {
    const $dom = new DOMElement('div', 'summernote');
    $dom.appendTo(document.body);

    $dom.remove();

    const $temp = new DOMElement(document.body).$(".summernote");
    assert.equal($temp, undefined);
  });

  it('check to get text in dom ', () => {
    const $dom = new DOMElement('div');
    $dom.html([
      "<div class='summernote'>",
      "<div class='summernote-body'>summernote is strong.</div>",
      "</div>"].join(''));

    assert.equal($dom.text(), 'summernote is strong.');
  });

  it('check to set css style in dom', () => {
    const $dom = new DOMElement('div', '', { style: 'color:yellow;'});
    $dom.appendTo(document.body);

    assert.equal($dom.css('color'), 'rgb(255, 255, 0)');

    $dom.css({
      'background-color': 'red'
    });

    assert.equal($dom.css('background-color'), 'rgb(255, 0, 0)');
    
    $dom.remove();
  });

  it('check to set style by cssText in dom', () => {
    const $dom = new DOMElement('div');
    $dom.cssText('color: yellow;');
    $dom.css('background-color', 'red');

    $dom.appendTo(document.body);
    assert.equal($dom.cssText(), 'color: yellow; background-color: red;');

    $dom.remove();
  });

  it('check to set px value to css property', () => {
    const $dom = new DOMElement('div');
    $dom.px('left', 10.5); 

    assert.equal($dom.css('left'), '10.5px');
  });

  it('check to get rectangle for dom element', () => {
    const $dom = new DOMElement('div');
    $dom.css({
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '100px',
      height: '100px'
    });

    $dom.appendTo(document.body);

    const rect = $dom.rect();
    $dom.remove();

    assert.equal(rect.top, 0);
    assert.equal(rect.left, 0);
    assert.equal(rect.width, 100);
    assert.equal(rect.height, 100);
    
  });
});
