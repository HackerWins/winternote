import { assert } from 'chai';
import {EditorManager} from '../../src/module/EditorManager';
import {BaseStore} from '../../src/util/BaseStore';

describe('module: EditorManager', () => {
  let $store = null; 

  beforeEach(() => {
    $store = new BaseStore({
      modules: {
        EditorManager
      }
    });
  });

  it('Can return its name.', () => {
    assert.equal($store.read('editor.name'), 'summernote');
  });

  it('Can set its name', () => {
    $store.dispatch('editor.name', 'aaa');
    assert.equal($store.read('editor.name'), 'aaa');
  });
});
