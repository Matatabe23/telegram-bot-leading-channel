export const bodyLock = (boolean: boolean) => {
	const lockPaddingValue = `${window.innerWidth - document.body.offsetWidth}px`;

	if (boolean) {
		document.body.classList.remove('overflow-hidden');
		document.body.classList.add('overflow-y-scroll');
		document.body.style.setProperty('padding-right', '0');
	} else {
		document.body.classList.add('overflow-hidden');
		document.body.classList.remove('overflow-y-scroll');
		document.body.style.setProperty('padding-right', lockPaddingValue);
	}
};
