export default class BufferWriter {
	buffer: ArrayBuffer;
	private encoder?: TextEncoder;

	constructor() {
		this.buffer = new ArrayBuffer(0);
	}

	private appendBytes(length: number) {
		const newBuffer = new Uint8Array(this.buffer.byteLength + length);
		newBuffer.set(new Uint8Array(this.buffer), 0);
		this.buffer = newBuffer.buffer;
	}

	writeUint8(int8: number) {
		const end = this.buffer.byteLength;
		this.appendBytes(1);
		const view = new DataView(this.buffer);
		view.setUint8(end, int8);
		this.buffer = view.buffer;
	}

	writeUint8Array(array: number[]) {
		const end = this.buffer.byteLength;
		this.appendBytes(array.length);
		const view = new DataView(this.buffer);
		for(let i = 0; i < array.length; i++) {
			view.setUint8(end + i, array[i]);
		}
		this.buffer = view.buffer;
	}

	writeUint16(int16: number) {
		const end = this.buffer.byteLength;
		this.appendBytes(2);
		const view = new DataView(this.buffer);
		view.setUint16(end, int16, true);
		this.buffer = view.buffer;
	}

	writeUint16Array(array: number[]) {
		const end = this.buffer.byteLength;
		this.appendBytes(array.length * 2);
		const view = new DataView(this.buffer);
		for(let i = 0; i < array.length; i++) {
			view.setUint16(end + (i * 2), array[i], true);
		}
		this.buffer = view.buffer;
	}

	writeUint32(int32: number) {
		const end = this.buffer.byteLength;
		this.appendBytes(4);
		const view = new DataView(this.buffer);
		view.setUint32(end, int32, true);
		this.buffer = view.buffer;
	}

	writeUint32Array(array: number[]) {
		const end = this.buffer.byteLength;
		this.appendBytes(array.length * 4);
		const view = new DataView(this.buffer);
		for(let i = 0; i < array.length; i++) {
			view.setUint32(end + (i * 4), array[i], true);
		}
		this.buffer = view.buffer;
	}

	writeBuffer(buf: ArrayBuffer) {
		const newBuffer = new Uint8Array(this.buffer.byteLength + buf.byteLength);
		newBuffer.set(new Uint8Array(this.buffer), 0);
		newBuffer.set(new Uint8Array(buf), this.buffer.byteLength);
		this.buffer = newBuffer.buffer;
	}

	writeString(str: string) {
		if (!this.encoder) {
			this.encoder = new TextEncoder();
		}
		this.writeBuffer(
			this.encoder.encode(str).buffer
		);
	}

	writeNulls(count: number) {
		this.appendBytes(count);
	}
}
