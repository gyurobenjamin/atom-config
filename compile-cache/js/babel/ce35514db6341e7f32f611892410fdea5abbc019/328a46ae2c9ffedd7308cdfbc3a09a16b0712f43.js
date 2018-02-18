
/* eslint quote-props:0 */
'use strict';

// Character positions
var INDEX_OF_FUNCTION_NAME = 9; // "function X", X is at index 9
var FIRST_UPPERCASE_INDEX_IN_ASCII = 65; // A is at index 65 in ASCII
var LAST_UPPERCASE_INDEX_IN_ASCII = 90; // Z is at index 90 in ASCII

// -----------------------------------
// Values

/**
 * Get the object type string
 * @param {any} value
 * @returns {string}
 */
function getObjectType(value /* :mixed */) /* :string */{
  return Object.prototype.toString.call(value);
}

/**
 * Checks to see if a value is an object
 * @param {any} value
 * @returns {boolean}
 */
function isObject(value /* :any */) /* :boolean */{
  // null is object, hence the extra check
  return value !== null && typeof value === 'object';
}

/**
 * Checks to see if a value is an object and only an object
 * @param {any} value
 * @returns {boolean}
 */
function isPlainObject(value /* :any */) /* :boolean */{
  /* eslint no-proto:0 */
  return isObject(value) && value.__proto__ === Object.prototype;
}

/**
 * Checks to see if a value is empty
 * @param {any} value
 * @returns {boolean}
 */
function isEmpty(value /* :mixed */) /* :boolean */{
  return value == null;
}

/**
 * Is empty object
 * @param {any} value
 * @returns {boolean}
 */
function isEmptyObject(value /* :Object */) /* :boolean */{
  // We could use Object.keys, but this is more effecient
  for (var key in value) {
    if (value.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

/**
 * Is ES6+ class
 * @param {any} value
 * @returns {boolean}
 */
function isNativeClass(value /* :mixed */) /* :boolean */{
  // NOTE TO DEVELOPER: If any of this changes, isClass must also be updated
  return typeof value === 'function' && value.toString().indexOf('class') === 0;
}

/**
 * Is Conventional Class
 * Looks for function with capital first letter MyClass
 * First letter is the 9th character
 * If changed, isClass must also be updated
 * @param {any} value
 * @returns {boolean}
 */
function isConventionalClass(value /* :any */) /* :boolean */{
  if (typeof value !== 'function') return false;
  var c = value.toString().charCodeAt(INDEX_OF_FUNCTION_NAME);
  return c >= FIRST_UPPERCASE_INDEX_IN_ASCII && c <= LAST_UPPERCASE_INDEX_IN_ASCII;
}

// There use to be code here that checked for CoffeeScript's "function _Class" at index 0 (which was sound)
// But it would also check for Babel's __classCallCheck anywhere in the function, which wasn't sound
// as somewhere in the function, another class could be defined, which would provide a false positive
// So instead, proxied classes are ignored, as we can't guarantee their accuracy, would also be an ever growing set

// -----------------------------------
// Types

/**
 * Is Class
 * @param {any} value
 * @returns {boolean}
 */
function isClass(value /* :any */) /* :boolean */{
  // NOTE TO DEVELOPER: If any of this changes, you may also need to update isNativeClass
  if (typeof value !== 'function') return false;
  var s = value.toString();
  if (s.indexOf('class') === 0) return true;
  var c = s.charCodeAt(INDEX_OF_FUNCTION_NAME);
  return c >= FIRST_UPPERCASE_INDEX_IN_ASCII && c <= LAST_UPPERCASE_INDEX_IN_ASCII;
}

/**
 * Checks to see if a value is an error
 * @param {any} value
 * @returns {boolean}
 */
function isError(value /* :mixed */) /* :boolean */{
  return value instanceof Error;
}

/**
 * Checks to see if a value is a date
 * @param {any} value
 * @returns {boolean}
 */
function isDate(value /* :mixed */) /* :boolean */{
  return getObjectType(value) === '[object Date]';
}

/**
 * Checks to see if a value is an arguments object
 * @param {any} value
 * @returns {boolean}
 */
function isArguments(value /* :mixed */) /* :boolean */{
  return getObjectType(value) === '[object Arguments]';
}

/**
 * Checks to see if a value is a function
 * @param {any} value
 * @returns {boolean}
 */
function isFunction(value /* :mixed */) /* :boolean */{
  return getObjectType(value) === '[object Function]';
}

/**
 * Checks to see if a value is an regex
 * @param {any} value
 * @returns {boolean}
 */
function isRegExp(value /* :mixed */) /* :boolean */{
  return getObjectType(value) === '[object RegExp]';
}

/**
 * Checks to see if a value is an array
 * @param {any} value
 * @returns {boolean}
 */
function isArray(value /* :mixed */) /* :boolean */{
  return typeof Array.isArray === 'function' && Array.isArray(value) || getObjectType(value) === '[object Array]';
}

/**
 * Checks to see if a valule is a number
 * @param {any} value
 * @returns {boolean}
 */
function isNumber(value /* :mixed */) /* :boolean */{
  return typeof value === 'number' || getObjectType(value) === '[object Number]';
}

/**
 * Checks to see if a value is a string
 * @param {any} value
 * @returns {boolean}
 */
function isString(value /* :mixed */) /* :boolean */{
  return typeof value === 'string' || getObjectType(value) === '[object String]';
}

/**
 * Checks to see if a valule is a boolean
 * @param {any} value
 * @returns {boolean}
 */
function isBoolean(value /* :mixed */) /* :boolean */{
  return value === true || value === false || getObjectType(value) === '[object Boolean]';
}

/**
 * Checks to see if a value is null
 * @param {any} value
 * @returns {boolean}
 */
function isNull(value /* :mixed */) /* :boolean */{
  return value === null;
}

/**
 * Checks to see if a value is undefined
 * @param {any} value
 * @returns {boolean}
 */
function isUndefined(value /* :mixed */) /* :boolean */{
  return typeof value === 'undefined';
}

/**
 * Checks to see if a value is a Map
 * @param {any} value
 * @returns {boolean}
 */
function isMap(value /* :mixed */) /* :boolean */{
  return getObjectType(value) === '[object Map]';
}

/**
 * Checks to see if a value is a WeakMap
 * @param {any} value
 * @returns {boolean}
 */
function isWeakMap(value /* :mixed */) /* :boolean */{
  return getObjectType(value) === '[object WeakMap]';
}

// -----------------------------------
// General

/**
 * The type mapping (type => method) to use for getType. Frozen.
 */
var typeMap = Object.freeze({
  array: isArray,
  boolean: isBoolean,
  date: isDate,
  error: isError,
  'class': isClass,
  'function': isFunction,
  'null': isNull,
  number: isNumber,
  regexp: isRegExp,
  string: isString,
  'undefined': isUndefined,
  map: isMap,
  weakmap: isWeakMap,
  object: isObject
});

/**
 * Get the type of the value in lowercase
 * @param {any} value
 * @param {Object} [customTypeMap] a custom type map (type => method) in case you have new types you wish to use
 * @returns {?string}
 */
function getType(value /* :mixed */) /* :?string */{
  var customTypeMap /* :Object */ = arguments.length <= 1 || arguments[1] === undefined ? typeMap : arguments[1];

  // Cycle through our type map
  for (var key in customTypeMap) {
    if (customTypeMap.hasOwnProperty(key)) {
      if (customTypeMap[key](value)) {
        return key;
      }
    }
  }

  // No type was successful
  return null;
}

// Export
module.exports = {
  getObjectType: getObjectType,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isEmpty: isEmpty,
  isEmptyObject: isEmptyObject,
  isNativeClass: isNativeClass,
  isConventionalClass: isConventionalClass,
  isClass: isClass,
  isError: isError,
  isDate: isDate,
  isArguments: isArguments,
  isFunction: isFunction,
  isRegExp: isRegExp,
  isArray: isArray,
  isNumber: isNumber,
  isString: isString,
  isBoolean: isBoolean,
  isNull: isNull,
  isUndefined: isUndefined,
  isMap: isMap,
  isWeakMap: isWeakMap,
  typeMap: typeMap,
  getType: getType
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL25vZGVfbW9kdWxlcy90eXBlY2hlY2tlci9zb3VyY2UvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxZQUFZLENBQUE7OztBQUdaLElBQU0sc0JBQXNCLEdBQUcsQ0FBQyxDQUFBO0FBQ2hDLElBQU0sOEJBQThCLEdBQUcsRUFBRSxDQUFBO0FBQ3pDLElBQU0sNkJBQTZCLEdBQUcsRUFBRSxDQUFBOzs7Ozs7Ozs7O0FBV3hDLFNBQVMsYUFBYSxDQUFFLEtBQUssNEJBQTZCO0FBQ3pELFNBQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0NBQzVDOzs7Ozs7O0FBT0QsU0FBUyxRQUFRLENBQUUsS0FBSywyQkFBNkI7O0FBRXBELFNBQU8sS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUE7Q0FDbEQ7Ozs7Ozs7QUFPRCxTQUFTLGFBQWEsQ0FBRSxLQUFLLDJCQUE2Qjs7QUFFekQsU0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFBO0NBQzlEOzs7Ozs7O0FBT0QsU0FBUyxPQUFPLENBQUUsS0FBSyw2QkFBK0I7QUFDckQsU0FBTyxLQUFLLElBQUksSUFBSSxDQUFBO0NBQ3BCOzs7Ozs7O0FBT0QsU0FBUyxhQUFhLENBQUUsS0FBSyw4QkFBZ0M7O0FBRTVELE9BQU0sSUFBTSxHQUFHLElBQUksS0FBSyxFQUFHO0FBQzFCLFFBQUssS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRztBQUNoQyxhQUFPLEtBQUssQ0FBQTtLQUNaO0dBQ0Q7QUFDRCxTQUFPLElBQUksQ0FBQTtDQUNYOzs7Ozs7O0FBT0QsU0FBUyxhQUFhLENBQUUsS0FBSyw2QkFBK0I7O0FBRTNELFNBQU8sT0FBTyxLQUFLLEtB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YixxQkFBbUIsRUFBbkIsbUJBQW1CO0FBQ25CLFNBQU8sRUFBUCxPQUFPO0FBQ1AsU0FBTyxFQUFQLE9BQU87QUFDUCxRQUFNLEVBQU4sTUFBTTtBQUNOLGFBQVcsRUFBWCxXQUFXO0FBQ1gsWUFBVSxFQUFWLFVBQVU7QUFDVixVQUFRLEVBQVIsUUFBUTtBQUNSLFNBQU8sRUFBUCxPQUFPO0FBQ1AsVUFBUSxFQUFSLFFBQVE7QUFDUixVQUFRLEVBQVIsUUFBUTtBQUNSLFdBQVMsRUFBVCxTQUFTO0FBQ1QsUUFBTSxFQUFOLE1BQU07QUFDTixhQUFXLEVBQVgsV0FBVztBQUNYLE9BQUssRUFBTCxLQUFLO0FBQ0wsV0FBUyxFQUFULFNBQVM7QUFDVCxTQUFPLEVBQVAsT0FBTztBQUNQLFNBQU8sRUFBUCxPQUFPO0NBQ1AsQ0FBQSIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9idWlsZC9ub2RlX21vZHVsZXMvdHlwZWNoZWNrZXIvc291cmNlL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludCBxdW90ZS1wcm9wczowICovXG4ndXNlIHN0cmljdCdcblxuLy8gQ2hhcmFjdGVyIHBvc2l0aW9uc1xuY29uc3QgSU5ERVhfT0ZfRlVOQ1RJT05fTkFNRSA9IDkgIC8vIFwiZnVuY3Rpb24gWFwiLCBYIGlzIGF0IGluZGV4IDlcbmNvbnN0IEZJUlNUX1VQUEVSQ0FTRV9JTkRFWF9JTl9BU0NJSSA9IDY1ICAvLyBBIGlzIGF0IGluZGV4IDY1IGluIEFTQ0lJXG5jb25zdCBMQVNUX1VQUEVSQ0FTRV9JTkRFWF9JTl9BU0NJSSA9IDkwICAgLy8gWiBpcyBhdCBpbmRleCA5MCBpbiBBU0NJSVxuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBWYWx1ZXNcblxuLyoqXG4gKiBHZXQgdGhlIG9iamVjdCB0eXBlIHN0cmluZ1xuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRPYmplY3RUeXBlICh2YWx1ZSAvKiA6bWl4ZWQgKi8pIC8qIDpzdHJpbmcgKi8ge1xuXHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKVxufVxuXG4vKipcbiAqIENoZWNrcyB0byBzZWUgaWYgYSB2YWx1ZSBpcyBhbiBvYmplY3RcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0ICh2YWx1ZSAvKiA6YW55ICovICkgLyogOmJvb2xlYW4gKi8ge1xuXHQvLyBudWxsIGlzIG9iamVjdCwgaGVuY2UgdGhlIGV4dHJhIGNoZWNrXG5cdHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG59XG5cbi8qKlxuICogQ2hlY2tzIHRvIHNlZSBpZiBhIHZhbHVlIGlzIGFuIG9iamVjdCBhbmQgb25seSBhbiBvYmplY3RcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QgKHZhbHVlIC8qIDphbnkgKi8gKSAvKiA6Ym9vbGVhbiAqLyB7XG5cdC8qIGVzbGludCBuby1wcm90bzowICovXG5cdHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgdmFsdWUuX19wcm90b19fID09PSBPYmplY3QucHJvdG90eXBlXG59XG5cbi8qKlxuICogQ2hlY2tzIHRvIHNlZSBpZiBhIHZhbHVlIGlzIGVtcHR5XG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0VtcHR5ICh2YWx1ZSAvKiA6bWl4ZWQgKi8gKSAvKiA6Ym9vbGVhbiAqLyB7XG5cdHJldHVybiB2YWx1ZSA9PSBudWxsXG59XG5cbi8qKlxuICogSXMgZW1wdHkgb2JqZWN0XG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0VtcHR5T2JqZWN0ICh2YWx1ZSAvKiA6T2JqZWN0ICovICkgLyogOmJvb2xlYW4gKi8ge1xuXHQvLyBXZSBjb3VsZCB1c2UgT2JqZWN0LmtleXMsIGJ1dCB0aGlzIGlzIG1vcmUgZWZmZWNpZW50XG5cdGZvciAoIGNvbnN0IGtleSBpbiB2YWx1ZSApIHtcblx0XHRpZiAoIHZhbHVlLmhhc093blByb3BlcnR5KGtleSkgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRydWVcbn1cblxuLyoqXG4gKiBJcyBFUzYrIGNsYXNzXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZUNsYXNzICh2YWx1ZSAvKiA6bWl4ZWQgKi8gKSAvKiA6Ym9vbGVhbiAqLyB7XG5cdC8vIE5PVEUgVE8gREVWRUxPUEVSOiBJZiBhbnkgb2YgdGhpcyBjaGFuZ2VzLCBpc0NsYXNzIG11c3QgYWxzbyBiZSB1cGRhdGVkXG5cdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgdmFsdWUudG9TdHJpbmcoKS5pbmRleE9mKCdjbGFzcycpID09PSAwXG59XG5cbi8qKlxuICogSXMgQ29udmVudGlvbmFsIENsYXNzXG4gKiBMb29rcyBmb3IgZnVuY3Rpb24gd2l0aCBjYXBpdGFsIGZpcnN0IGxldHRlciBNeUNsYXNzXG4gKiBGaXJzdCBsZXR0ZXIgaXMgdGhlIDl0aCBjaGFyYWN0ZXJcbiAqIElmIGNoYW5nZWQsIGlzQ2xhc3MgbXVzdCBhbHNvIGJlIHVwZGF0ZWRcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQ29udmVudGlvbmFsQ2xhc3MgKHZhbHVlIC8qIDphbnkgKi8gKSAvKiA6Ym9vbGVhbiAqLyB7XG5cdGlmICggdHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nICkgIHJldHVybiBmYWxzZVxuXHRjb25zdCBjID0gdmFsdWUudG9TdHJpbmcoKS5jaGFyQ29kZUF0KElOREVYX09GX0ZVTkNUSU9OX05BTUUpXG5cdHJldHVybiBjID49IEZJUlNUX1VQUEVSQ0FTRV9JTkRFWF9JTl9BU0NJSSAmJiBjIDw9IExBU1RfVVBQRVJDQVNFX0lOREVYX0lOX0FTQ0lJXG59XG5cbi8vIFRoZXJlIHVzZSB0byBiZSBjb2RlIGhlcmUgdGhhdCBjaGVja2VkIGZvciBDb2ZmZWVTY3JpcHQncyBcImZ1bmN0aW9uIF9DbGFzc1wiIGF0IGluZGV4IDAgKHdoaWNoIHdhcyBzb3VuZClcbi8vIEJ1dCBpdCB3b3VsZCBhbHNvIGNoZWNrIGZvciBCYWJlbCdzIF9fY2xhc3NDYWxsQ2hlY2sgYW55d2hlcmUgaW4gdGhlIGZ1bmN0aW9uLCB3aGljaCB3YXNuJ3Qgc291bmRcbi8vIGFzIHNvbWV3aGVyZSBpbiB0aGUgZnVuY3Rpb24sIGFub3RoZXIgY2xhc3MgY291bGQgYmUgZGVmaW5lZCwgd2hpY2ggd291bGQgcHJvdmlkZSBhIGZhbHNlIHBvc2l0aXZlXG4vLyBTbyBpbnN0ZWFkLCBwcm94aWVkIGNsYXNzZXMgYXJlIGlnbm9yZWQsIGFzIHdlIGNhbid0IGd1YXJhbnRlZSB0aGVpciBhY2N1cmFjeSwgd291bGQgYWxzbyBiZSBhbiBldmVyIGdyb3dpbmcgc2V0XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFR5cGVzXG5cbi8qKlxuICogSXMgQ2xhc3NcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQ2xhc3MgKHZhbHVlIC8qIDphbnkgKi8gKSAvKiA6Ym9vbGVhbiAqLyB7XG5cdC8vIE5PVEUgVE8gREVWRUxPUEVSOiBJZiBhbnkgb2YgdGhpcyBjaGFuZ2VzLCB5b3UgbWF5IGFsc28gbmVlZCB0byB1cGRhdGUgaXNOYXRpdmVDbGFzc1xuXHRpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJyApICByZXR1cm4gZmFsc2Vcblx0Y29uc3QgcyA9IHZhbHVlLnRvU3RyaW5nKClcblx0aWYgKCBzLmluZGV4T2YoJ2NsYXNzJykgPT09IDAgKSAgcmV0dXJuIHRydWVcblx0Y29uc3QgYyA9IHMuY2hhckNvZGVBdChJTkRFWF9PRl9GVU5DVElPTl9OQU1FKVxuXHRyZXR1cm4gYyA+PSBGSVJTVF9VUFBFUkNBU0VfSU5ERVhfSU5fQVNDSUkgJiYgYyA8PSBMQVNUX1VQUEVSQ0FTRV9JTkRFWF9JTl9BU0NJSVxufVxuXG4vKipcbiAqIENoZWNrcyB0byBzZWUgaWYgYSB2YWx1ZSBpcyBhbiBlcnJvclxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNFcnJvciAodmFsdWUgLyogOm1peGVkICovICkgLyogOmJvb2xlYW4gKi8ge1xuXHRyZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBFcnJvclxufVxuXG4vKipcbiAqIENoZWNrcyB0byBzZWUgaWYgYSB2YWx1ZSBpcyBhIGRhdGVcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZSAodmFsdWUgLyogOm1peGVkICovICkgLyogOmJvb2xlYW4gKi8ge1xuXHRyZXR1cm4gZ2V0T2JqZWN0VHlwZSh2YWx1ZSkgPT09ICdbb2JqZWN0IERhdGVdJ1xufVxuXG4vKipcbiAqIENoZWNrcyB0byBzZWUgaWYgYSB2YWx1ZSBpcyBhbiBhcmd1bWVudHMgb2JqZWN0XG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyAodmFsdWUgLyogOm1peGVkICovICkgLyogOmJvb2xlYW4gKi8ge1xuXHRyZXR1cm4gZ2V0T2JqZWN0VHlwZSh2YWx1ZSkgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nXG59XG5cbi8qKlxuICogQ2hlY2tzIHRvIHNlZSBpZiBhIHZhbHVlIGlzIGEgZnVuY3Rpb25cbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24gKHZhbHVlIC8qIDptaXhlZCAqLyApIC8qIDpib29sZWFuICovIHtcblx0cmV0dXJuIGdldE9iamVjdFR5cGUodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nXG59XG5cbi8qKlxuICogQ2hlY2tzIHRvIHNlZSBpZiBhIHZhbHVlIGlzIGFuIHJlZ2V4XG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc1JlZ0V4cCAodmFsdWUgLyogOm1peGVkICovICkgLyogOmJvb2xlYW4gKi8ge1xuXHRyZXR1cm4gZ2V0T2JqZWN0VHlwZSh2YWx1ZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nXG59XG5cbi8qKlxuICogQ2hlY2tzIHRvIHNlZSBpZiBhIHZhbHVlIGlzIGFuIGFycmF5XG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0FycmF5ICh2YWx1ZSAvKiA6bWl4ZWQgKi8gKSAvKiA6Ym9vbGVhbiAqLyB7XG5cdHJldHVybiAodHlwZW9mIEFycmF5LmlzQXJyYXkgPT09ICdmdW5jdGlvbicgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHx8IGdldE9iamVjdFR5cGUodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nXG59XG5cbi8qKlxuICogQ2hlY2tzIHRvIHNlZSBpZiBhIHZhbHVsZSBpcyBhIG51bWJlclxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIgKHZhbHVlIC8qIDptaXhlZCAqLyApIC8qIDpib29sZWFuICovIHtcblx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgZ2V0T2JqZWN0VHlwZSh2YWx1ZSkgPT09ICdbb2JqZWN0IE51bWJlcl0nXG59XG5cbi8qKlxuICogQ2hlY2tzIHRvIHNlZSBpZiBhIHZhbHVlIGlzIGEgc3RyaW5nXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyAodmFsdWUgLyogOm1peGVkICovICkgLyogOmJvb2xlYW4gKi8ge1xuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCBnZXRPYmplY3RUeXBlKHZhbHVlKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSdcbn1cblxuLyoqXG4gKiBDaGVja3MgdG8gc2VlIGlmIGEgdmFsdWxlIGlzIGEgYm9vbGVhblxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNCb29sZWFuICh2YWx1ZSAvKiA6bWl4ZWQgKi8gKSAvKiA6Ym9vbGVhbiAqLyB7XG5cdHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2UgfHwgZ2V0T2JqZWN0VHlwZSh2YWx1ZSkgPT09ICdbb2JqZWN0IEJvb2xlYW5dJ1xufVxuXG4vKipcbiAqIENoZWNrcyB0byBzZWUgaWYgYSB2YWx1ZSBpcyBudWxsXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc051bGwgKHZhbHVlIC8qIDptaXhlZCAqLyApIC8qIDpib29sZWFuICovIHtcblx0cmV0dXJuIHZhbHVlID09PSBudWxsXG59XG5cbi8qKlxuICogQ2hlY2tzIHRvIHNlZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQgKHZhbHVlIC8qIDptaXhlZCAqLyApIC8qIDpib29sZWFuICovIHtcblx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCdcbn1cblxuLyoqXG4gKiBDaGVja3MgdG8gc2VlIGlmIGEgdmFsdWUgaXMgYSBNYXBcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzTWFwICh2YWx1ZSAvKiA6bWl4ZWQgKi8gKSAvKiA6Ym9vbGVhbiAqLyB7XG5cdHJldHVybiBnZXRPYmplY3RUeXBlKHZhbHVlKSA9PT0gJ1tvYmplY3QgTWFwXSdcbn1cblxuLyoqXG4gKiBDaGVja3MgdG8gc2VlIGlmIGEgdmFsdWUgaXMgYSBXZWFrTWFwXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc1dlYWtNYXAgKHZhbHVlIC8qIDptaXhlZCAqLyApIC8qIDpib29sZWFuICovIHtcblx0cmV0dXJuIGdldE9iamVjdFR5cGUodmFsdWUpID09PSAnW29iamVjdCBXZWFrTWFwXSdcbn1cblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gR2VuZXJhbFxuXG4vKipcbiAqIFRoZSB0eXBlIG1hcHBpbmcgKHR5cGUgPT4gbWV0aG9kKSB0byB1c2UgZm9yIGdldFR5cGUuIEZyb3plbi5cbiAqL1xuY29uc3QgdHlwZU1hcCA9IE9iamVjdC5mcmVlemUoe1xuXHRhcnJheTogaXNBcnJheSxcblx0Ym9vbGVhbjogaXNCb29sZWFuLFxuXHRkYXRlOiBpc0RhdGUsXG5cdGVycm9yOiBpc0Vycm9yLFxuXHRjbGFzczogaXNDbGFzcyxcblx0ZnVuY3Rpb246IGlzRnVuY3Rpb24sXG5cdG51bGw6IGlzTnVsbCxcblx0bnVtYmVyOiBpc051bWJlcixcblx0cmVnZXhwOiBpc1JlZ0V4cCxcblx0c3RyaW5nOiBpc1N0cmluZyxcblx0J3VuZGVmaW5lZCc6IGlzVW5kZWZpbmVkLFxuXHRtYXA6IGlzTWFwLFxuXHR3ZWFrbWFwOiBpc1dlYWtNYXAsXG5cdG9iamVjdDogaXNPYmplY3Rcbn0pXG5cbi8qKlxuICogR2V0IHRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBpbiBsb3dlcmNhc2VcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IFtjdXN0b21UeXBlTWFwXSBhIGN1c3RvbSB0eXBlIG1hcCAodHlwZSA9PiBtZXRob2QpIGluIGNhc2UgeW91IGhhdmUgbmV3IHR5cGVzIHlvdSB3aXNoIHRvIHVzZVxuICogQHJldHVybnMgez9zdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldFR5cGUgKHZhbHVlIC8qIDptaXhlZCAqLywgY3VzdG9tVHlwZU1hcCAvKiA6T2JqZWN0ICovID0gdHlwZU1hcCkgLyogOj9zdHJpbmcgKi8ge1xuXHQvLyBDeWNsZSB0aHJvdWdoIG91ciB0eXBlIG1hcFxuXHRmb3IgKCBjb25zdCBrZXkgaW4gY3VzdG9tVHlwZU1hcCApIHtcblx0XHRpZiAoIGN1c3RvbVR5cGVNYXAuaGFzT3duUHJvcGVydHkoa2V5KSApIHtcblx0XHRcdGlmICggY3VzdG9tVHlwZU1hcFtrZXldKHZhbHVlKSApIHtcblx0XHRcdFx0cmV0dXJuIGtleVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIE5vIHR5cGUgd2FzIHN1Y2Nlc3NmdWxcblx0cmV0dXJuIG51bGxcbn1cblxuLy8gRXhwb3J0XG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Z2V0T2JqZWN0VHlwZSxcblx0aXNPYmplY3QsXG5cdGlzUGxhaW5PYmplY3QsXG5cdGlzRW1wdHksXG5cdGlzRW1wdHlPYmplY3QsXG5cdGlzTmF0aXZlQ2xhc3MsXG5cdGlzQ29udmVudGlvbmFsQ2xhc3MsXG5cdGlzQ2xhc3MsXG5cdGlzRXJyb3IsXG5cdGlzRGF0ZSxcblx0aXNBcmd1bWVudHMsXG5cdGlzRnVuY3Rpb24sXG5cdGlzUmVnRXhwLFxuXHRpc0FycmF5LFxuXHRpc051bWJlcixcblx0aXNTdHJpbmcsXG5cdGlzQm9vbGVhbixcblx0aXNOdWxsLFxuXHRpc1VuZGVmaW5lZCxcblx0aXNNYXAsXG5cdGlzV2Vha01hcCxcblx0dHlwZU1hcCxcblx0Z2V0VHlwZVxufVxuIl19