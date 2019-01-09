import { assert } from 'chai';
import { Editor } from '../src/editor';

describe('Editor', () => {
  it('Can return its name.', () => {
    const place = document.createElement('div');
    const editor = new Editor({
      container: place
    });
    assert.equal(editor.read('editor.name'), 'summernote');
    assert.equal(editor.$el.css('position'), 'relative');

    editor.on('summernote.change', () => {
      assert.equal(editor.read('editor.savedata'), true);
    });

    editor.dispatch('editor.save', true);
    // assert.equal(editor.read('editor.savedata'), true);

  });
});
