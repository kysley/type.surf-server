export function chunk<T>(array: T[], size: number): T[][] {
  const chunked_arr = []
  for (let i = 0; i < array.length; i++) {
    const last = chunked_arr[chunked_arr.length - 1]
    if (!last || last.length === size) {
      chunked_arr.push([array[i]])
    } else {
      last.push(array[i])
    }
  }
  return chunked_arr
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
