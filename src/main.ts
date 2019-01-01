import { Editor } from './editor';

export function main(): void {
  const editor = new Editor({
    container: document.querySelector('#summernote')
  });
  // tslint:disable-next-line
  console.log(editor.read('editor.name'));  
}
