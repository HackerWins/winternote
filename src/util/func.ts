import { DefaultVariableType } from "./BaseStore";

export function debounce (callback: Function, delay: number): Function {

    let t = undefined;

    return  (...args: DefaultVariableType[]) => {
        if (t) clearTimeout(t);

        t = setTimeout(() => {
            callback(...args);
        }, delay || 300);
    };
}

export function defaultValue (
  value: DefaultVariableType, 
  defaultValue: DefaultVariableType
): DefaultVariableType {
    return typeof value === 'undefined' ? defaultValue : value;
}

export function isUndefined (value: DefaultVariableType): boolean {
    return typeof value === 'undefined' || value === null;
}

export function isNotUndefined (value: DefaultVariableType): boolean {
    return isUndefined(value) === false;
}

export function isArray (value: object): boolean {
    return Array.isArray(value);
}

export function isBoolean (value: boolean): boolean {
    return typeof value === 'boolean';
}

export function isString (value: DefaultVariableType): boolean {
    return typeof value === 'string';
}

export function isNotString (value: DefaultVariableType): boolean {
    return isString(value) === false;
}

export function isObject (value: object): boolean {
    return typeof value === 'object';
}

export function isFunction (value: Function): boolean {
    return typeof value === 'function';
}

export function isNumber (value: number): boolean {
    return typeof value === 'number';
}

export function uuid(): string {
  let dt = (new Date()).getTime();
  const uuid = 'summernote-xy-2019xyy'.replace(/[xy]/g, (c) => {
      const r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c === 'x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

export function includes<T>(array: T[], value: T): boolean {
  for (let i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) return true; 
  }

  return false; 
}

export function some<T>(array: T[], fn: (t: T) => boolean): boolean {
  for (let i = 0, len = array.length; i < len; i++) {
    if (fn(array[i])) return true; 
  }

  return false; 
}

export function pushArray<T> (a: T[], b: T[]): T[] {
  a.push.apply(a, b);

  return a; 
}
