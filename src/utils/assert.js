export function assert(expr, error = '') {
  if (!expr) throw new Error(error)
}

export function isArray(arg) {
  return Array.isArray(arg)
}

export function isString(arg) {
  return typeof arg === 'string'
}

export function isFunc(arg) {
  return typeof arg === 'function'
}

export function isObject(arg) {
  return typeof arg === 'object' && !isArray(arg)
}
