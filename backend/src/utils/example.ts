import subtract from './mock_subtract.js'

export function add(a: number, b: number) {
  return a + b
}

export function take2(a: number) {
  return subtract(a, 2)
}
