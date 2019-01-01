import { Editor } from './editor';

export function create(place: Element): void {
  const editor = new Editor({
    container: place
  });
  // tslint:disable-next-line
  console.log(editor.read('editor.name'));  
}
