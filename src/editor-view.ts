import { DOMObserver } from './dom-observer';

/**
 * EditorView displays editor state in the DOM and handles user events.
 */
export class EditorView {
  private editable: HTMLElement;
  private domObserver: DOMObserver;

  constructor(editable: HTMLElement) {
    this.editable = editable;
    this.domObserver = new DOMObserver(editable);
    this.domObserver.start();
  }
}
