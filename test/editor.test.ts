import { assert } from 'chai';
import { Editor } from '../src/editor';

describe('Editor', () => {
  it('Can return its name.', () => {
    const place = document.createElement('div');
    const editor = new Editor(place);
    assert.equal(editor.getName(), 'summernote');
  });
});
