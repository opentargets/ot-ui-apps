export function finalData(oldValue, newValue) {
  if (newValue == null) return oldValue;
  if (typeof newValue === 'function') {
    if (oldValue == null) {
      throw Error('data to transform is null or undefined');
    }
    return newValue(oldValue);
  }
  return newValue;
}