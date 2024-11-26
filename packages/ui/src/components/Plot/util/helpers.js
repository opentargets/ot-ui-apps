
// like Object.assign, but only copies to properties that original object
// already has
export function safeAssign(obj, newObj) {
  for (let [key, value] of Object.entries(newObj)) {
    if (Object.hasOwn(obj, key)) {
      obj[key] = value;
    }
  }
  return obj;
}

export function isIterable(value) {
  return value != null && typeof value[Symbol.iterator] === 'function';
}

export function isInfiniteOrNaN(value) {
  return value === Infinity || value === -Infinity || Number.isNaN(value);
}