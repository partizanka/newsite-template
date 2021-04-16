<template lang='pug'>
.v-search-small.search-small
	.search-small__wrap
		form.search-small__form(@submit.prevent="relocate" @reset.prevent="close")
			v-field(:field="field" v-model="localQuery" class="search-small__field")
			button.search-small__close-btn(aria-label="Очистить" type="reset")
				svg.svg-icon.search-small__close-btn-icon
					use(xlink:href="#svg-icon-close-sm")
			button.search-small__submit-btn(aria-label="Найти" type="submit")
				svg.svg-icon.search-small__submit-btn-icon
					use(xlink:href="#svg-icon-lens")
		.search-small__result.scrollbar
			.search-small__loader-wrap(v-if="localQuery !== search.query" key="loading")
				v-loader(:loading="loading")
			.search-small__top(v-else-if="search && search.suggestions && search.suggestions.length > 0" key="suggestions")
				.search-small__suggestion-wrap.flc(v-for="(suggestion, index) in search.suggestions" :key="index")
					a.search-small__suggestion.link(:href="suggestion.link") {{suggestion.text}}
			.search-small__result-message(v-else="" key="no-suggestions")
				| По вашему запросу ничего не найдено
</template>

<script>
import sourceMixin from 'components/mixins/v-mixin-source.vue';
import controller from '../scripts/controller/controller';

export default {
	mixins: [
		sourceMixin
	],

	data() {
		return {
			loading: false,
			localQuery: null,
			searchTimeout: null,
			field: {
				'type': 'search',
				'label': null,
				'inputmode': 'search',
				'placeholder': 'Поиск'
			},
			search: {
				remote: null,
				query: null,
				link: null,
				suggestions: []
			}
		};
	},
	
	watch: {
		localQuery() {
			this.searchInput();
		}
	},

	created() {
		document.addEventListener('click', this.clickOutside);
		controller.events.on('search-small-open', this.open);
		controller.events.on('search-small-close', this.close);
	},

	unmounted() {
		document.removeEventListener('click', this.clickOutside);
	},

	methods: {
		relocate() {
			if (this.search.link) {
				let searchUrl = new URL(window.location.protocol + window.location.host + this.search.link);
				searchUrl.searchParams.append('query', this.localQuery);
				window.location = searchUrl;
			}
		},

		open() {
			document.body.classList.add('state--search-small-open');
		},

		close() {
			this.localQuery = null;
			this.search.suggestions = null;
			document.body.classList.remove('state--search-small-open');
		},

		clickOutside(e) {
			if (!this.$el.contains(e.target)) {
				controller.closeSearchSmall();
			}
		},

		searchInput() {
			clearTimeout(this.searchTimeout);
			if (this.localQuery) {
				controller.openSearchSmall();
				this.searchTimeout = setTimeout(this.requestDataLoad, 200);
			} else {
				controller.closeSearchSmall();
			}
		},

		requestDataLoad() {
			this.dataLoad({
				url: this.search.remote,
				delay: true,
				data: {
					query: this.localQuery,
					bxajaxid: this.bxajaxid
				}
			});
		},

		dataSet(data) {
			if (!this.search.remote) {
				this.search = data;
			}
			if (this.localQuery && this.localQuery === this.search.query) {
				this.search = data;
			}
		}
	}
};
</script>