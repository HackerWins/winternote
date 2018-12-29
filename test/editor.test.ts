import { assert } from 'chai';
import { Editor } from '../src/editor';

describe('Editor', () => {
  it('Can return its name.', () => {
    const editor = new Editor();
    assert.equal(editor.getName(), 'summernote');
  });
});
