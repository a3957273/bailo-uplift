import { describe, expect, test, jest } from '@jest/globals'
import config from '../src/utils/config.js'
import { add } from '../src/utils/example.js'

const example = { add }

describe('basic tests', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3)
  })

  test('config port set', () => {
    expect(config.api.port).toBe(3006)
  })

  test('can add 1 + 2 with spy', () => {
    const spy = jest.spyOn(example, 'add')
    expect(example.add(1, 2)).toBe(3)
    expect(spy).toBeCalled()
  })
})
