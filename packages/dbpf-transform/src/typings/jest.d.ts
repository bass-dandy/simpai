declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchFile(path: string): Promise<R>;
    }
  }
}

export {};
