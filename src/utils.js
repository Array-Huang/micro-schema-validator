export function isNull(val) {
  return !val && typeof val !== 'undefined' && val !== 0;
}
