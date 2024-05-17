export interface JestNativeMatchers<R> {
  toHaveText(expected?: string): R;
  toHaveAllText(expected?: string[]): R;
}

declare global {
  namespace jest {
    interface Matchers<R, T = {}> extends JestNativeMatchers<R> {}
  }
}

declare module '@jest/expect' {
  interface Matchers<R extends void | Promise<void>> extends JestNativeMatchers<R> {}
}
