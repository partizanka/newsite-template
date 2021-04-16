export const initPopup = () => {
	const link = document.querySelector('.js-open');
	const popup = document.querySelector('.js-popup');
	const close = document.querySelector('.js-close');

	link.addEventListener('click', function(event) {
		event.preventDefault();
		popup.classList.add('js-popup__show');
	});
	close.addEventListener('click', function(event) {
		event.preventDefault();
		popup.classList.remove('js-popup__show');
	});
};