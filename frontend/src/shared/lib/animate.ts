export function animateHome() {
	const animItems = document.querySelectorAll('._anim-items');

	if (animItems.length > 0) {
		const offset = (el: Element) => {
			const rect = el.getBoundingClientRect(),
				scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
				scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
		};

		const animOnScroll = () => {
			for (let index = 0; index < animItems.length; index++) {
				const animItem = animItems[index] as HTMLElement;

				const animItemHeight = animItem.offsetHeight;
				const animItemOffset = offset(animItem).top;

				const animStart = 5;

				let animItemPoint = window.innerHeight - animItemHeight / animStart;

				if (animItemHeight > window.innerHeight) {
					animItemPoint = window.innerHeight - window.innerHeight / animStart;
				}

				if (
					pageYOffset > Math.abs(animItemOffset) - animItemPoint &&
					pageYOffset < Math.abs(animItemOffset) + animItemHeight
				) {
					animItem.classList.add('_active');
				} else {
					if (!animItem.classList.contains('_anim-no-hide')) {
						animItem.classList.remove('_active');
					}
				}
			}
		};

		window.addEventListener('scroll', animOnScroll);

		setTimeout(() => {
			animOnScroll();
		}, 300);
	}
}
