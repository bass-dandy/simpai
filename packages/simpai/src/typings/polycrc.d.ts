declare module 'polycrc' {
  const content: {
    // this is incomplete, but this is all that will probably be relevant
    crc24: (str: string) => number,
  };
  export default content;
}
