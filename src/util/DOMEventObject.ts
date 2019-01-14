export class DOMEventObject {
  dom: Element;
  delegate: string;
  callback: EventListener;
  constructor (
    public eventName: string,
    public isControl: boolean,
    public isShift: boolean,
    public isAlt: boolean,
    public isMeta: boolean,
    public codes : string[],
    public useCapture: boolean,
    public debounce: number,
    public checkMethodList: string[]
  ) {
    this.dom = null; 
    this.delegate = null;
    this.callback = null;
  }
}
