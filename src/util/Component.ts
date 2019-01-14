import {BaseStore, DefaultVariableType} from "./BaseStore";
import {EventMachine} from "./EventMachine";
import { uuid } from "./func";


const CHECK_STORE_MULTI_PATTERN = /^ME@/;

const PREFIX = '@';
const MULTI_PREFIX = 'ME@';
const SPLITTER = '|';

export const PIPE = (...args: string[]): string => {
  return args.join(SPLITTER);
};

export const EVENT = (...args: string[]): string => {
  return MULTI_PREFIX + PIPE(...args);
};

export class Component extends EventMachine {
  opt: object;
  parent: Component;
  props: {};
  source: string;
  $store: BaseStore;
  storeEvents: {};
  type: string; 
  container: Element;

  constructor(opt = {}, props = {}, parent?: Component) {
    super(opt, props, parent);

    this.source = uuid();
    // window[this.source] = this; 

    if (this.parent && this.parent.$store) {
      this.$store = this.parent.$store;
    }

    this.created();

    this.initialize();

    this.initializeStoreEvent();
  }

  created():void {

  }

  getRealEventName(e: string, s = PREFIX): string {
    const startIndex = e.indexOf(s);
    return e.substr(startIndex === 0 ? 0 : startIndex + s.length);
  }

  /**
   * initialize store event 
   * 
   * you can define '@xxx' method(event) in Component 
   * 
   * 
   */
  initializeStoreEvent(): void {
    this.storeEvents = {};

    this.filterProps(CHECK_STORE_MULTI_PATTERN).forEach((key) => {
      const events = this.getRealEventName(key, MULTI_PREFIX);

      const callback = this[key].bind(this);

      events.split(SPLITTER).forEach((e: string) => {
        e = this.getRealEventName(e);

        this.storeEvents[e] = callback;
        this.on(e, this.storeEvents[e], this);
      });

    });
  }

  destoryStoreEvent(): void {
    Object.keys(this.storeEvents).forEach(event => {
      this.off(event, this.storeEvents[event]);
    });
  }

  read(action: string, ...args: DefaultVariableType[]): DefaultVariableType {
    return this.$store.read(action, ...args);
  }

  i18n(key: string, ...args: DefaultVariableType[]): DefaultVariableType {
    return this.read('i18n/get', key, ...args);
  }

  run(action: string, ...args: DefaultVariableType[]): DefaultVariableType {
    return this.$store.run(action, ...args);
  }

  dispatch(action: string, ...args: DefaultVariableType[]): void {
    this.$store.source = this.source;
    return this.$store.dispatch(action, ...args);
  }

  on(eventType: string, callback: Function, context = {}): void {
    this.$store.on(eventType, callback, context as Component);
  }

  off (eventType: string, callback: Function): void {
    this.$store.off(eventType, callback);
  }

  emit(eventType: string, ...args: DefaultVariableType[]): void {
    this.$store.source = this.source;
    this.$store.emit(eventType, ...args);
  }

}
