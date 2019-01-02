export function debounce (callback: Function, delay: any) {

    var t = undefined;

    return function (...args: any[]) {
        if (t) {
            clearTimeout(t);
        }

        t = setTimeout(function () {
            callback(...args);
        }, delay || 300);
    }
}

export function defaultValue (value: any, defaultValue: any): any {
    return typeof value == 'undefined' ? defaultValue : value;
}

export function isUndefined (value: any): boolean {
    return typeof value == 'undefined' || value == null;
}

export function isNotUndefined (value: any): boolean {
    return isUndefined(value) === false;
}

export function isArray (value: any): boolean {
    return Array.isArray(value);
}

export function isBoolean (value: any): boolean {
    return typeof value == 'boolean'
}

export function isString (value: any): boolean {
    return typeof value == 'string'
}

export function isNotString (value: any): boolean {
    return isString(value) === false;
}

export function isObject (value: any): boolean {
    return typeof value == 'object'
}

export function isFunction (value: any): boolean {
    return typeof value == 'function'
}

export function isNumber (value: any): boolean {
    return typeof value == 'number';
}

export function spread<T>(arg: any): Array<T> {
  return Array.prototype.slice.call(arg);
}


export function uuid(): string {
  var dt = (new Date()).getTime();
  var uuid = 'summernote-xy-2019xyy'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
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

export function pushArray<T> (a: Array<T>, b: Array<T>): Array<T> {
  a.push.apply(a, b);

  return a; 
}
