import {languages} from './consts';

export function getLanguage(id: number | string): string {
	const normalizedIndex = typeof id === 'number'
		? id
		: parseInt(id, 16);

	// language ids are 1-indexed, our languages const is not
	return languages[normalizedIndex - 1] || 'Unknown';
}

export function formatHex(val: number, length?: number): string {
	let hex = val.toString(16).toUpperCase();
	while (length && hex.length < length) {
		hex = '0' + hex;
	}
	return `0x${hex}`;
}
