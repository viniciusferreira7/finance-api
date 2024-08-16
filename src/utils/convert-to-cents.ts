export function convertToCents(value: string | number | undefined) {
  const valueConvertedToNumber = Number(value)

  if (valueConvertedToNumber) {
    const convertsValueToCents = valueConvertedToNumber * 100

    return convertsValueToCents.toString()
  }

  return '0'
}
