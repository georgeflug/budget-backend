export function orderedStringify(data: any, fieldOrder: string[]) {
  const allFieldsDeep = [...fieldOrder, ...objectKeysDeep(data)];
  return JSON.stringify(data, allFieldsDeep, 2);
}

export function deepCompare(data1: any, data2: any): boolean {
  const allFieldsDeep = objectKeysDeep(data1);
  return JSON.stringify(data1, allFieldsDeep) === JSON.stringify(data2, allFieldsDeep);
}

function objectKeysDeep(data: any): string[] {
  const fields: string[] = [];
  JSON.stringify(data, (key, value) => {
    fields.push(key);
    return value;
  });
  fields.sort();
  return fields;
}
