const ORDERID_REGEX = /^#?(\d{1,10}(?:-\d{1,4})?)$/

export function validOrderId(value) {
  if (typeof value === 'undefined' || value === null || value === '') {
    return true
  }
  return ORDERID_REGEX.test(value)
}

export function validName(value) {
  if (typeof value === 'undefined' || value === null || value === '') {
    return true
  }
  return /^[^!@#$%^&*=+\\/[{\]};:'"?><`]+$/.test(value)
}

export function validEmailOrEmpty(value) {
  if (typeof value === 'undefined' || value === null || value === '') {
    return true
  }
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
}

export function empty(value) {
  return typeof value === 'undefined' || value === null || value === ''
}

export function validEmail(value) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
}
