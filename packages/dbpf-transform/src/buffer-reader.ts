export default class BufferReader {
  private view: DataView;
  private cursor: number;

  constructor(buf: ArrayBuffer) {
    this.view = new DataView(buf);
    this.cursor = 0;
  }

  seekForward(distance: number) {
    this.cursor += distance;
    return this;
  }

  seekTo(index: number) {
    this.cursor = index;
    return this;
  }

  readUint8() {
    const int8 = this.view.getUint8(this.cursor);
    this.cursor += 1;
    return int8;
  }

  readUint8Array(len: number) {
    const byteArray = [];
    for (let i = 0; i < len; i++) {
      byteArray.push(this.readUint8());
    }
    return byteArray;
  }

  readUint16() {
    const int16 = this.view.getUint16(this.cursor, true);
    this.cursor += 2;
    return int16;
  }

  readUint16Array(len: number) {
    const int16Array = [];
    for (let i = 0; i < len; i++) {
      int16Array.push(this.readUint16());
    }
    return int16Array;
  }

  readUint32() {
    const int32 = this.view.getUint32(this.cursor, true);
    this.cursor += 4;
    return int32;
  }

  readUint32Array(len: number) {
    const int32Array = [];
    for (let i = 0; i < len; i++) {
      int32Array.push(this.readUint32());
    }
    return int32Array;
  }

  readBuffer(len: number) {
    const buf = this.view.buffer.slice(this.cursor, this.cursor + len);
    this.cursor += len;
    return buf;
  }

  readCountedString() {
    const len = this.readUint32();
    return new TextDecoder().decode(this.readBuffer(len));
  }

  readFileName() {
    return new TextDecoder().decode(this.readBuffer(64)).replace(/\u0000/g, ''); // eslint-disable-line no-control-regex -- remove trailing null bytes
  }

  readUntilNull() {
    for (let i = this.cursor; i < this.view.byteLength; i++) {
      if (this.view.getUint8(i) === 0) {
        /// null found
        const result = this.view.buffer.slice(this.cursor, i);
        this.cursor = i + 1;
        return result;
      }
    }
    // null not found, return remaining buffer
    return this.view.buffer.slice(this.cursor);
  }
}
