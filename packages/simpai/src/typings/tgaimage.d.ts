declare module 'tgaimage' {
  // this is incomplete, but this is likely all that will be relevant
  const content: {
    imageWithData: (buf: ArrayBuffer) => {
      didLoad: Promise<boolean>;
      image: HTMLImageElement;
    };
  };
  export default content;
}
