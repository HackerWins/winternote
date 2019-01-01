export function debounce (callback: (...args: any[]) => void, delay: any) {

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

export function get(obj: object, key: string | number, callback: (...args: any[]) => void) {
    
    var returnValue = defaultValue(obj[key], key);

    if (isFunction( callback ) ) {
        return callback(returnValue);
    }

    return returnValue; 
}

export function defaultValue (value: any, defaultValue: any) {
    return typeof value == 'undefined' ? defaultValue : value;
}

export function isUndefined (value: any) {
    return typeof value == 'undefined' || value == null;
}

export function isNotUndefined (value: any) {
    return isUndefined(value) === false;
}

export function isArray (value: any) {
    return Array.isArray(value);
}

export function isBoolean (value: any) {
    return typeof value == 'boolean'
}

export function isString (value: any) {
    return typeof value == 'string'
}

export function isNotString (value: any) {
    return isString(value) === false;
}

export function isObject (value: any) {
    return typeof value == 'object'
}

export function isFunction (value: any) {
    return typeof value == 'function'
}

export function isNumber (value: any) {
    return typeof value == 'number';
}

export function spread(arg: any): any[] {
  return Array.prototype.slice.call(arg);
}
