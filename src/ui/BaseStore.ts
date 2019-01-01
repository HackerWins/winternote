import {
  ACTION_PREFIX,
  GETTER_PREFIX
} from "../util/Store";
import BaseModule from "./BaseModule";
import {
  debounce,
  isFunction,
  isUndefined
} from "../util/func";

export const PREVENT = 'PREVENT'

export interface EventObject {
  event: string;
  context: any;
  callback: Function;
  originalCallback: Function;
}

export default class BaseStore {
  callbacks: EventObject[];
  actions: any[];
  getters: any[];
  modules: any[];
  source: string;
  items: {};

  constructor(opt: any) {
    this.callbacks = []
    this.actions = []
    this.getters = []
    this.modules = opt.modules || []
    this.items = {}

    this.initialize()
  }

  initialize() {
    this.initializeModule();
  }

  initializeModule() {
    this.modules.forEach(ModuleClass => {
      this.addModule(ModuleClass);
    })
  }

  set(key: string, value: any) {
    this.items[key] = value; 
  }

  get(key: string, defaultValue?: any) {
    if (isUndefined(defaultValue)) {
      return this.items[key];
    }
    
    return this.items[key] || defaultValue;
  }

  has(key: string) {
    return !!this.items[key];
  }

  action(action: string, context: BaseModule) {
    var actionName = action.substr(action.indexOf(ACTION_PREFIX) + ACTION_PREFIX.length)
    this.actions[actionName] = {
      context,
      callback: context[action]
    };
  }

  getter(action: string, context: BaseModule) {
    var actionName = action.substr(action.indexOf(GETTER_PREFIX) + GETTER_PREFIX.length)
    this.getters[actionName] = {
      context,
      callback: context[action]
    };
  }

  dispatch(action: string, ...opts: any[]) {
    var m = this.actions[action];

    if (m) {
      var ret = this.run(action, ...opts);

      if (ret != PREVENT) {
        m.context.afterDispatch()
      }

    } else {
      throw new Error('action : ' + action + ' is not a valid.')
    }

  }

  run(action: string, ...opts: any[]): any {
    var m = this.actions[action];

    if (m) {
      m.callback.apply(m.context, [this, ...opts]);
    } else {
      throw new Error('action : ' + action + ' is not a valid.')
    }
  }

  read(action: string, ...opts: any[]) {
    var m = this.getters[action];

    if (m) {
      return m.callback.apply(m.context, [this, ...opts]);
    } else {
      throw new Error('getter : ' + action + ' is not a valid.')
    }
  }

  clone(action: string, ...opts: any[]) {
    return JSON.parse(JSON.stringify(this.read(action, ...opts)))
  }

  addModule(ModuleClass: new(arg0: this) => BaseModule): BaseModule {
    return new ModuleClass(this)
  }

  on(event: any, originalCallback: any, context: any, delay = 0) {
    var callback = delay > 0 ? debounce(originalCallback, delay) : originalCallback;
    this.callbacks.push({
      event,
      callback,
      context,
      originalCallback
    })
  }

  off(event: string, originalCallback: Function) {

    if (arguments.length == 0) {
      this.callbacks = []
    } else if (arguments.length == 1) {
      this.callbacks = this.callbacks.filter(f => {
        return f.event != event
      })
    } else if (arguments.length == 2) {
      this.callbacks = this.callbacks.filter(f => {
        return !(f.event == event && f.originalCallback == originalCallback)
      })
    }

  }

  emit() {
    var args = [...arguments];
    var event = args.shift();

    this.callbacks.filter(f => {
      return (f.event == event)
    }).forEach(f => {
      if (f && isFunction(f.callback) && f.context.source != this.source) {
        f.callback(...args);
      }
    })
  }
}
