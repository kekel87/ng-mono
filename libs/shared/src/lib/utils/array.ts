export function getElementAt<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}
