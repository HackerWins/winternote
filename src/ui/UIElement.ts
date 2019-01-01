import EventMachin from "../util/EventMachin";
import {
  uuid
} from "../util/math";

// const CHECK_STORE_PATTERN = /^@/
const CHECK_STORE_MULTI_PATTERN = /^ME@/

const PREFIX = '@'
const MULTI_PREFIX = 'ME@'
const SPLITTER = '|'

export const PIPE = (...args: any[]): string => {
  return args.join(SPLITTER)
}

export const EVENT = (...args: any[]): string => {
  return MULTI_PREFIX + PIPE(...args);
}

class UIElement extends EventMachin {
  opt: any;
  parent: any;
  props: any;
  source: any;
  sourceName: string;
  $store: any;
  storeEvents: {};
  constructor(opt, props) {
    super()

    this.opt = opt || {};
    this.parent = this.opt;
    this.props = props || {}
    this.source = uuid()
    this.sourceName = this.constructor.name;
    // window[this.source] = this; 

    if (opt && opt.$store) {
      this.$store = opt.$store
    }

    this.created();

    this.initialize();

    this.initializeStoreEvent();
  }

  created() {

  }

  getRealEventName(e, s = PREFIX) {
    var startIndex = e.indexOf(s);
    return e.substr(startIndex == 0 ? 0 : startIndex + s.length);
  }

  /**
   * initialize store event 
   * 
   * you can define '@xxx' method(event) in UIElement 
   * 
   * 
   */
  initializeStoreEvent() {
    this.storeEvents = {}

    this.filterProps(CHECK_STORE_MULTI_PATTERN).forEach((key) => {
      const events = this.getRealEventName(key, MULTI_PREFIX);

      var callback = this[key].bind(this)

      events.split(SPLITTER).forEach(e => {
        e = this.getRealEventName(e);

        this.storeEvents[e] = callback
        this.$store.on(e, this.storeEvents[e], this);
      })

    });
  }

  destoryStoreEvent() {
    Object.keys(this.storeEvents).forEach(event => {
      this.$store.off(event, this.storeEvents[event])
    })
  }

  read(action: string, ...args: any[]) {
    return this.$store.read(action, ...args)
  }

  i18n(key: string, ...args: any[]) {
    return this.read('i18n/get', key, ...args);
  }

  run(action: string, ...args: any[]) {
    return this.$store.run(action, ...args);
  }

  dispatch(action: string, ...args: any[]) {
    this.$store.source = this.source;
    return this.$store.dispatch(action, ...args)
  }

  emit(eventType: string, ...args: any[]) {
    this.$store.source = this.source;
    this.$store.emit(eventType, ...args);
  }

  commit(eventType: string, ...args: any[]) {
    this.run('item/set', ...args);
    this.emit(eventType, ...args);
  }

}

export default UIElement
