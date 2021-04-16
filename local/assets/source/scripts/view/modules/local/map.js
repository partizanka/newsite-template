export const initMap = () => {
	let ymaps;

	ymaps.ready(function() {
		const myMap = new ymaps.Map('.js-map', {
				center: [59.939054, 30.319866],
				zoom: 16
			}, {
				searchControlProvider: 'yandex#search'
			}),
			myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
				hintContent: 'ул. Б. Конюшенная, д. 19/8',
				balloonContent: 'Nerds'
			}, {
				iconLayout: 'default#image',
				iconImageHref: '../../images/marker.png',
				iconImageSize: [187, 190],
				iconImageOffset: [100, -150]
			});
		myMap.geoObjects.add(myPlacemark);
	});
};