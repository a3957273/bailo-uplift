import { jest, describe, test, expect } from '@jest/globals'

jest.unstable_mockModule('node:child_process', () => ({
  execSync: jest.fn(() => 'mocked'),
  // etc.
}))

const { execSync } = await import('node:child_process')

describe('mock tests', () => {
  test('can mock exec sync', () => {
    expect(execSync()).toBe('mocked')
  })
})
