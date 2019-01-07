export default class DomEventObject {
  dom: Element;
  delegate: string;
  callback: Function;
  constructor (
    public eventName: string,
    public isControl: boolean,
    public isShift: boolean,
    public isAlt: boolean,
    public isMeta: boolean,
    public codes : Array<string>,
    public useCapture: boolean,
    public debounce: number,
    public checkMethodList: Array<string>
  ) {
    this.dom = null 
    this.delegate = null 
    this.callback = null
  }
}
