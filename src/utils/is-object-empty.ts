export function isObjectEmpty(object: unknown): boolean {
  return !object || Object.keys(object).length === 0;
}
