<script>
export default {
	methods: {
		formatPrice(price) {
			if (!price && price !== 0 && price !== '0') {
				console.log('Ошибка цены', price);
				return ' - ';
			}
			return parseFloat(price).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
		},

		formatInteger(price) {
			if (!price && price !== 0 && price !== '0') {
				console.log('Ошибка', price);
				return ' - ';
			}
			return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
		},
		
		formatDateShort(text) {
			if (!(/^\d+$/.test(text))) {
				return  text;
			}
			try {
				let date = new Date(text);
				let day = date.getDate();
				let month = date.getMonth();
				let year = date.getFullYear();
				return '' + day + ' ' + ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][month] + ' ' + year;
			} catch (e) {
				return '';
			}
		},

		// wordEndings[0] - 1, wordEndings[1] - 2-4, wordEndings[2] - 0, 5-9
		pluralize(value, wordBase, wordEndings, approx) {
			// тыс. просмотрОВ, млн. просмотрОВ
			if (approx && value >= 1000) {
				return wordBase + wordEndings[2];
			}
			// *надцать (11-19) - всегда вариант 3
			if (value % 100 > 10 && value % 100 < 20) {
				return wordBase + wordEndings[2];
			}
			let ending = value % 10;
			if (ending == 0 || ending >= 5) {
				return wordBase + wordEndings[2];
			} else if (ending == 1){
				return wordBase + wordEndings[0];
			} else {
				return wordBase + wordEndings[1];
			}
		}
	},
};
</script>