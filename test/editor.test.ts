import { assert } from 'chai';
import { Editor } from '../src/editor';

describe('Editor', () => {
  it('Can return its name.', () => {
    const parentOfPlace = document.createElement('div');
    const place = document.createElement('div');
    parentOfPlace.appendChild(place);
    const editor = new Editor(place);
  });
});
