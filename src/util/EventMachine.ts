import { DOMElement } from './DOMElement';
import { DOMEventObject } from './DOMEventObject';
import { EventParser } from './EventParser';
import { isFunction, isString, pushArray} from './func';
import { DOM_EVENT_CHECK_PATTERN } from "./pattern/DOM_EVENT_CHECK_PATTERN";
import { LOAD_CHECK_PATTERN, LOAD_SAPARATOR } from "./pattern/LOAD_CHECK_PATTERN";


export interface EventObjectInterface {
  $delegateTarget: DOMElement;
  target: Element;
}

export class EventMachine {
  parent: EventMachine;
  props: {};
  refs: {};
  children: {};
  opt: {};
  $el: DOMElement;
  collapsedProps: string[];
  $root: DOMElement;
  _bindings: DOMEventObject[];


  constructor(opt = {}, props = {}, parent: EventMachine) { 
    this.opt = opt || {};
    this.parent = parent;
    this.props = props || {};    
    this.refs = {}; 
    this.children = {};
  }

  render ($container: DOMElement): void {
    const ret = this.template();

    this.$el = this.parseTemplate(ret);
    this.refs['$el'] = this.$el;   

    if ($container) $container.html(this.$el);

    this.load();

    this.afterRender();
  }

  afterRender (): void {

  }
 
  /**
   * Define Child Component 
   */
  components (): object {
    return {}; 
  }

  parseTemplate (html: string): DOMElement {

    const $tempDiv = new DOMElement("div");
    $tempDiv.html(html);

    const list = $tempDiv.children();
    
    const fragment = document.createDocumentFragment();

    list.forEach($el => {
      if ($el.attr('ref')) {
        this.refs[$el.attr('ref') as string] = $el; 
      }
      const refs = $el.$$('[ref]');

      [...refs].forEach($dom => {
        const name = $dom.attr('ref') as string;
        this.refs[name] = $dom;
      });

      fragment.appendChild($el.element);

    });

    return list[0];
  }

  parseTemplateLoad (html: string|string[]): DocumentFragment {

    let parseString = '';
    if (isString(html)) {
      parseString = html + '';
    } else {
      html = html as string[];
      parseString = [...html].join('');
    }

    const $tempDiv = new DOMElement("div");
    $tempDiv.html(parseString);

    const list = $tempDiv.children();
    
    const fragment = document.createDocumentFragment();

    list.forEach($el => {
      // ref element 정리 
      if ($el.attr('ref')) {
        this.refs[$el.attr('ref') as string] = $el; 
      }
      const refs = $el.$$('[ref]');

      [...refs].forEach($dom => {
        const name = $dom.attr('ref');
        this.refs[name as string] = $dom;
      });

      fragment.appendChild($el.element);

    });

    return fragment;
  }

  parseComponent (): void {
    const $el = this.$el; 
    const childComponents = this.components();
    Object.keys(childComponents).forEach(componentName => {

      const componentClass = childComponents[componentName];
      const targets = $el.$$(`${componentName.toLowerCase()}`);

      targets.forEach($dom => {
        const props = {};
        
        $dom.attrs().filter(t => {
          return ['ref'].indexOf(t.key) < 0; 
        }).forEach(t => {
          props[t.key] = t.value;
        });
  
        const refName = ($dom.attr('ref') as string) || componentName;
  
        if (refName) {
        
          if (componentClass) { 

            const instance = new componentClass(this.opt, props, this);
            this.children[refName] = instance;
            this.refs[refName] = instance.$el;

            if (instance) {
              instance.render();
  
              $dom.replace(instance.$el);
            }
          }
  
        }
      });
    });
  }

  load (): void {
    this.filterProps(LOAD_CHECK_PATTERN).forEach(callbackName => {
      const elName = callbackName.split(LOAD_SAPARATOR)[1];
      if (this.refs[elName]) { 

        let ret = this[callbackName].call(this);

        if (isString(ret)) {
          ret = [ret];
        }

        this.refs[elName].html(this.parseTemplateLoad(ret));
      }
    });

    this.parseComponent();
  }

  template (): string {
    return '<div></div>';
  }

  initialize(): void {

  }

  eachChildren (callback: Function): void {
    if (!isFunction(callback)) return; 

    Object.keys(this.children).forEach(childComponentName => {
      callback(this.children[childComponentName]);
    });
  }

  initializeEvent (): void { 
    this.initializeEventMachin();

    this.eachChildren((comp: EventMachine) => {
      comp.initializeEvent();
    });
  }

  destroy(): void {
    this.destroyEventMachin();

    this.eachChildren((comp: EventMachine) => {
      comp.destroy();
    });
  }

  destroyEventMachin (): void {
    this.removeEventAll();
  }

  initializeEventMachin (): void {
    this.filterProps(DOM_EVENT_CHECK_PATTERN).forEach(this.parseEvent.bind(this));
  }

  collectProps (): string[] {

    if (!this.collapsedProps) {
      let p = Object.getPrototypeOf(this);
      let results = []; 
      do {
        results = pushArray<string>(results, Object.getOwnPropertyNames(p));
        p  = Object.getPrototypeOf(p);
      } while( p );

      this.collapsedProps = results;
    }

    return this.collapsedProps; 
  }

  filterProps (pattern): string[] {
    return this.collectProps().filter(key => {
      return key.match(pattern);
    });
  }

  parseEvent (key: string): void {
    EventParser.parse(key, this);
  }


  /* magic check method  */ 
  self (e: EventObjectInterface): boolean {
    return e.$delegateTarget.element === e.target; 
  }

  getBindings (): DOMEventObject[] {

    if (!this._bindings) {
      this.initBindings();
    }

    return this._bindings;
  }

  addBinding (obj: DOMEventObject): void {
    this.getBindings().push(obj);
  }

  initBindings(): void {
    this._bindings = [];
  }


  removeEventAll (): void {
    EventParser.removeEventAll(this);
  }

}
