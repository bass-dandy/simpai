declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    'on:outclick'?: () => void;
    'on:globalEsc'?: () => void;
  }
}
