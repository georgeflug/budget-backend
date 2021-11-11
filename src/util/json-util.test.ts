import { deepCompare, orderedStringify } from './json-util'

describe('Json Util', () => {
  it('should stringify keys in order', () => {
    expect(orderedStringify({ c: 1, b: 2, a: 3 }, ['b'])).toEqual(
      `
{
  "b": 2,
  "a": 3,
  "c": 1
}
`.trim(),
    )
  })

  it('compare objects deeply when objects are the same', () => {
    const obj1 = {
      a: {
        b: 1,
        c: 2,
      },
    }
    const obj2 = {
      a: {
        c: 2,
        b: 1,
      },
    }

    expect(deepCompare(obj1, obj2)).toEqual(true)
  })

  it('compare objects deeply when objects are different', () => {
    const obj1 = {
      a: {
        b: 1,
        c: 2,
      },
    }
    const obj2 = {
      a: {
        c: 1,
        b: 2,
      },
    }

    expect(deepCompare(obj1, obj2)).toEqual(false)
  })
})
