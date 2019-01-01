import { Editor } from './editor';

export function create(place: Element): Editor {
  const editor = new Editor(place);
  return editor;
}
