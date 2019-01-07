import { Editor } from './editor';

export function create(place: Element): Editor {
  const editor = new Editor({
    container: place
  });

  return editor;
}

export function main(selector) {
  const editor = create(document.querySelector(selector));
  // tslint:disable-next-line
  console.log(editor.read('editor.name'));  
}
