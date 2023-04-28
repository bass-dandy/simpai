export function clickOutside(node: HTMLElement) {
	const handleClick = (event: Event) => {
		if (!node.contains(event.target as HTMLElement)) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		},
	};
}

export function globalEsc(node: HTMLElement) {
	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Escape') node.dispatchEvent(new CustomEvent('globalEsc'));
	};

	document.addEventListener('keydown', handleKeyPress, true);

	return {
		destroy() {
			document.removeEventListener('keydown', handleKeyPress, true);
		},
	};
}
