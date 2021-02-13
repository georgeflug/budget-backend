export function lazy<T>(supplier: () => T) {
  let value: T | null = null;
  return (): T => {
    if (!value) {
      value = supplier();
    }
    return value;
  }
}
