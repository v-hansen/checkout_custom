export const hasValidFields = function <T>(obj: T, fields: object): boolean {
  for (const key in fields) {
    if (
      obj &&
      Object.prototype.hasOwnProperty.call(obj, key) &&
      !obj[key as keyof T]
    ) {
      return false
    }
  }

  return true
}
