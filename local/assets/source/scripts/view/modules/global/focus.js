export const focus = () => {
	document.addEventListener('keydown', (e) => {
		// key "Tab"
		if (e.keyCode == 9) {
			document.body.classList.add('state--focus-enabled');
		}
	});

	document.addEventListener('mousedown', () => {
		document.body.classList.remove('state--focus-enabled');
	});
};