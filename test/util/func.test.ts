import { assert } from 'chai';
import { 
  defaultValue, 
  includes,  
  isArray, 
  isBoolean, 
  isFunction,   
  isNotString, 
  isNotUndefined,   
  isNumber,  
  isObject, 
  isString,   
  isUndefined,
  pushArray,
  some
} from '../../src/util/func';


describe('util: func', () => {
  it('check defaultValue()', () => {
    assert.equal( defaultValue(undefined, 0), 0 );
    assert.deepEqual( defaultValue(undefined, {}), {} ); 
    assert.equal( defaultValue(undefined, 'string'), 'string' );
    assert.equal( defaultValue(undefined, false), false );
    assert.equal( defaultValue(undefined, null), null );

    assert.equal( defaultValue(0, 1), 0 );
    assert.equal( defaultValue('', 1), '' );
    assert.equal( defaultValue(false, 1), false );
    assert.equal( defaultValue('summernote', 1), 'summernote' );

  });

  it('check isUndefined()', () => {
    assert.equal( isUndefined(null), true);
    assert.equal( isUndefined(undefined), true);
    assert.equal( isUndefined('string'), false);
    assert.equal( isUndefined(0), false);
    assert.equal( isUndefined([]), false);
    assert.equal( isUndefined({}), false);
  });

  it('check isNotUndefined()', () => {
    assert.equal( isNotUndefined(null), false);
    assert.equal( isNotUndefined(undefined), false);
    assert.equal( isNotUndefined('string'), true);
    assert.equal( isNotUndefined(0), true);
    assert.equal( isNotUndefined([]), true);
    assert.equal( isNotUndefined({}), true);
  });

  it('check isArray()', () => {
    assert.equal( isArray([]), true );
    assert.equal( isArray({}), false );
    assert.equal( isArray(''), false );
    assert.equal( isArray(0), false );
    assert.equal( isArray(true), false );
    assert.equal( isArray(undefined), false );
    assert.equal( isArray(null), false ); 
  });

  it('check isBoolean()', () => {
    assert.equal( isBoolean(false), true );
    assert.equal( isBoolean(true), true );
    assert.equal( isBoolean([]), false );
    assert.equal( isBoolean({}), false );
    assert.equal( isBoolean(''), false );
    assert.equal( isBoolean(0), false );
    assert.equal( isBoolean(undefined), false );
    assert.equal( isBoolean(null), false );
  });

  it('check isString()', () => {
    assert.equal( isString(''), true );
    assert.equal( isString([]), false );
    assert.equal( isString({}), false );
    assert.equal( isString(true), false );
    assert.equal( isString(0), false );
    assert.equal( isString(undefined), false );
    assert.equal( isString(null), false );
  });  

  it('check isNotString()', () => {
    assert.equal( isNotString(''), false );
    assert.equal( isNotString([]), true );
    assert.equal( isNotString({}), true );
    assert.equal( isNotString(true), true );
    assert.equal( isNotString(0), true );
    assert.equal( isNotString(undefined), true );
    assert.equal( isNotString(null), true );
  });  
  
  it('check isObject()', () => {
    assert.equal( isObject({}), true );
    assert.equal( isObject([]), false );    
    assert.equal( isObject(''), false );
    assert.equal( isObject(true), false );
    assert.equal( isObject(0), false );
    assert.equal( isObject(undefined), false );
    assert.equal( isObject(null), false );
  });    

  it('check isFunction()', () => {
    assert.equal( isFunction((e) => e), true );
    assert.equal( isFunction({}), false );
    assert.equal( isFunction([]), false );    
    assert.equal( isFunction(''), false );
    assert.equal( isFunction(true), false );
    assert.equal( isFunction(0), false );
    assert.equal( isFunction(undefined), false );
    assert.equal( isFunction(null), false );
  }); 
  
  it('check isNumber()', () => {
    assert.equal( isNumber(0), true );    
    assert.equal( isNumber({}), false );
    assert.equal( isNumber([]), false );    
    assert.equal( isNumber(''), false );
    assert.equal( isNumber(true), false );
    assert.equal( isNumber(undefined), false );
    assert.equal( isNumber(null), false );
  });  

  it('check includes()', () => {
    assert.equal(includes([0, 1, 2], 2), true);
    assert.equal(includes([0, 1, 2], -1), false);
    assert.equal(includes<string>(['0', '1', '2'], '2'), true);
  });

  it('check some()', () => {
    assert.equal( some<string>(['0', '1', '2'], (e) => {
      return e === '0';
    }), true );

    assert.equal( some<string>(['0', '1', '2'], (e) => {
      return e === '3';
    }), false );
  });

  it('check pushArray()', () => {
    assert.deepEqual( pushArray([], [3]), [3] );
    assert.deepEqual( pushArray([3, 2, 5], [3]), [3, 2, 5, 3] );
  });

});
