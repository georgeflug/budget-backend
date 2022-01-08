import { isEqual } from 'lodash'

export function orderedStringify(data: unknown, fieldOrder: string[]): string {
  const allFieldsDeep = [...fieldOrder, ...objectKeysDeep(data)]
  return JSON.stringify(data, allFieldsDeep, 2)
}

export function deepCompare(data1: unknown, data2: unknown): boolean {
  return isEqual(data1, data2)
}

function objectKeysDeep(data: unknown): string[] {
  const fields: string[] = []
  JSON.stringify(data, (key, value) => {
    fields.push(key)
    return value
  })
  fields.sort()
  return fields
}
