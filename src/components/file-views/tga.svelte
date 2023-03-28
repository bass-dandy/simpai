<script lang="ts">
	import tgaImage from 'tgaimage';

	export let content: ArrayBuffer;

	let src: string | undefined;

	const knownHeaders = {
		jpg: [0xFF, 0xD8],
		png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
	};

	const matchesHeader = (bytes: Uint8Array, header: number[]) => {
		return header.every((headerByte, i) => headerByte === bytes[i]);
	};

	$: {
		const bytes = new Uint8Array(content);
		let blob;

		if (!content) {
			src = '';
		} else if (matchesHeader(bytes, knownHeaders.jpg)) {
			blob = new Blob([bytes], {type: "image/jpeg"});
			src = window.URL.createObjectURL(blob);
		} else if (matchesHeader(bytes, knownHeaders.png)) {
			blob = new Blob([bytes], {type: "image/png"});
			src = window.URL.createObjectURL(blob);
		} else {
			const tga = tgaImage.imageWithData(content);
			tga.didLoad.then(() => {
				src = tga.image.src;
			});
		}
	}
</script>

<div>
	{#if src}
		<img {src} alt="" />
	{/if}
</div>

<style>
	div {
		height: 100%;
		overflow: auto;
		text-align: center;
	}
	img {
		background: url('images/tile.png');
	}
</style>
