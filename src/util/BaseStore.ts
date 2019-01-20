
import { debounce, isFunction, isUndefined } from "../util/func";
import { BaseModule } from "./BaseModule";
import {Component} from "./Component";

export const GETTER_PREFIX = '*/';
export const ACTION_PREFIX = '/';

export function GETTER (str: string): string {
    return GETTER_PREFIX + str ;
}

export function ACTION (str: string): string {
    return ACTION_PREFIX + str ;
}

export const PREVENT = 'PREVENT';

export interface EventObject {
  event: string;
  context: Component;
  callback: Function;
  originalCallback: Function;
}

export interface BaseStoreOption {
  modules: object;
}

export type DefaultVariableType = string|boolean|number|object;

export class BaseStore {
  callbacks: EventObject[];
  actions: {};
  getters: {};
  modules: object;
  source: string;
  items: {};

  constructor(opt?: BaseStoreOption) {
    this.callbacks = [];
    this.actions = [];
    this.getters = [];
    this.modules = opt.modules || {};
    this.items = {};

    this.initialize();
  }

  initialize(): void {
    this.initializeModule();
  }

  initializeModule(): void {
    Object.keys(this.modules).forEach(moduleClassName => {
      const moduleClass = this.modules[moduleClassName];
      if (moduleClass) {
        new moduleClass(this);
      }
    });
  }

  set(key: string, value: DefaultVariableType): void {
    this.items[key] = value; 
  }

  get(key: string, defaultValue?: DefaultVariableType): DefaultVariableType {
    if (isUndefined(defaultValue)) {
      return this.items[key];
    }
    
    return this.items[key] || defaultValue;
  }

  has(key: string): boolean {
    return !!this.items[key];
  }

  action(action: string, context: BaseModule): void {
    const actionName = action.substr(action.indexOf(ACTION_PREFIX) + ACTION_PREFIX.length);
    this.actions[actionName] = {
      context,
      callback: context[action]
    };
  }

  getter(action: string, context: BaseModule): void {
    const actionName = action.substr(action.indexOf(GETTER_PREFIX) + GETTER_PREFIX.length);
    this.getters[actionName] = {
      context,
      callback: context[action]
    };
  }

  dispatch(action: string, ...opts: DefaultVariableType[]): void {
    const m = this.actions[action];

    if (m) {
      const ret = this.run(action, ...opts);

      if ((ret as string) !== PREVENT) {
        m.context.afterDispatch();
      }

    } else {
      throw new Error('action : ' + action + ' is not a valid.');
    }

  }

  run(action: string, ...opts: DefaultVariableType[]): DefaultVariableType {
    const m = this.actions[action];

    if (m) {
      return m.callback.apply(m.context, [this, ...opts]);
    } else {
      throw new Error('action : ' + action + ' is not a valid.');
    }
  }

  read(action: string, ...opts: DefaultVariableType[]): DefaultVariableType {
    const m = this.getters[action];

    if (m) {
      return m.callback.apply(m.context, [this, ...opts]);
    } else {
      throw new Error('getter : ' + action + ' is not a valid.');
    }
  }

  clone(action: string, ...opts: DefaultVariableType[]): object {
    return JSON.parse(JSON.stringify(this.read(action, ...opts)));
  }

  on(
    event: string, 
    originalCallback: Function, 
    context: Component, 
    delay = 0
  ): void {
    const callback = delay > 0 ? debounce(originalCallback, delay) : originalCallback;
    this.callbacks.push({
      event,
      callback,
      context,
      originalCallback
    });
  }

  off(event: string, originalCallback: Function): void {

    if (arguments.length === 0) {
      this.callbacks = [];
    } else if (arguments.length === 1) {
      this.callbacks = this.callbacks.filter(f => {
        return f.event !== event;
      });
    } else if (arguments.length === 2) {
      this.callbacks = this.callbacks.filter(f => {
        return !(f.event === event && f.originalCallback === originalCallback);
      });
    }

  }

  emit(...args: DefaultVariableType[]): void {
    const event = args.shift();

    this.callbacks.filter(f => {
      return (f.event === event);
    }).forEach(f => {
      if (f && isFunction(f.callback) && f.context.source !== this.source) {
        f.callback(...args);
      }
    });
  }
}
