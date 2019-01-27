import { EditorView } from './editor-view';

export class Editor {
  private view: EditorView;
  private place: Element;

  constructor(place: Element) {
    this.place = place;
    const contentEditable = document.createElement('div');
    contentEditable.setAttribute('contentEditable', 'true');
    this.place.parentNode.appendChild(contentEditable);

    this.view = new EditorView(contentEditable);
  }
}
