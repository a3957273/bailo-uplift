import { nanoid } from 'nanoid'

describe('nanoid tests', () => {
  test('can get a random nanoid', () => {
    expect(nanoid()).not.toBeUndefined()
  })
})
