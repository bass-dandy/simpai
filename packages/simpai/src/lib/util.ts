import { languages } from './consts';

export function getLanguage(id: number | string): string {
  const normalizedIndex = typeof id === 'number' ? id : parseInt(id, 16);

  // language ids are 1-indexed, our languages const is not
  return languages[normalizedIndex - 1] || 'Unknown';
}

export function formatHex(val?: number, length?: number): string {
  if (val === undefined) return '';

  let hex = val.toString(16).toUpperCase();
  while (length && hex.length < length) {
    hex = '0' + hex;
  }
  return `0x${hex}`;
}

// currently only works with 16bit values
export function formatSignedInt(val: number): number {
  const mask = 0b1 << 15;
  const uVal = new Uint16Array([val])[0];

  if (uVal === undefined) return NaN;

  return mask & uVal ? (uVal ^ mask) - mask : val;
}

export function formatStyle(styleObj: Record<string, string>): string {
  return Object.entries(styleObj)
    .map(([key, val]) => `${key}: ${val}`)
    .join(';');
}

export function without<T>(arr: T[], i: number): T[] {
  return [...arr.slice(0, i), ...arr.slice(i + 1)];
}

export function debounce<T extends any[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timeout: NodeJS.Timeout | undefined;

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
      timeout = undefined;
    }, delay);
  };
}

export function times<T>(
  count: number,
  fn: (i: number) => T
): T[] {
  const ret = [];

  for (let i = 0; i < count; i++) {
    ret.push(fn(i));
  }

  return ret;
}

export function downloadBuffer(data: ArrayBuffer, filename: string) {
  const blob = new Blob([new Uint8Array(data)], { type: 'octet/stream' }),
    url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(url);
}
