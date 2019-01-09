import { Editor } from './editor';
import { Component } from './util/Component';

export function create(place: Element): Editor {
  const editor = new Editor({
    container: place
  } as Component);

  return editor;
}

export function main(selector: string): void {
  const editor = create(document.querySelector(selector));
  // tslint:disable-next-line
  console.log(editor.read('editor.name'));  
}
