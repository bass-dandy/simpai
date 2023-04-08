<script lang="ts">
	import tgaImage from 'tgaimage';
	import Box from '../box.svelte';
	import Button from '../button.svelte';

	export let content: ArrayBuffer;
	export let onChange: (newContent: ArrayBuffer | undefined) => void;

	let src: string | undefined;
	let fileInput: HTMLInputElement;

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

		if (!content || !bytes.length) {
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

<div class="tga-view">
	<input
		type="file"
		accept="image/jpeg, image/png, .tga"
		bind:this={fileInput}
		on:change={async () => {
			onChange(await fileInput.files?.[0]?.arrayBuffer());
		}}
	/>
	<Box secondary>
		<Button
			variant="link"
			style="font-size: 1.2rem;"
			onClick={() => fileInput.click()}
		>
			Upload image file
		</Button>
	</Box>
	{#if src}
		<Box
			secondary
			style={{
				'margin-top': '5px',
				overflow: 'hidden',
			}}
		>
			<img {src} alt="" />
		</Box>
	{/if}
</div>

<style>
	.tga-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		text-align: center;
	}
	input[type="file"] {
		display: none;
	}
	img {
		max-width: 100%;
		max-height: 100%;
		background: url('/images/tile.png');
	}
</style>
