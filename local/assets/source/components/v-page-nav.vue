<template lang="pug">
.v-page-nav.page-nav
	.page-nav__row
		.page-nav__cell.page-nav__cell--left
			transition(name="content-fade" mode="out-in")
				button.btn.btn--primary(
						v-if="localPage.offset + localPage.limit < localPage.count"
						key="show-more"
						type="button"
						@click="navigateToAppend")
					| Показать еще {{Math.min(localPage.count - localPage.offset + localPage.limit, localPage.limit)}}
				button.btn.btn--primary(
						v-else=''
						key="last-page"
						type="button"
						disabled='')
					| Это последняя страница
		.page-nav__cell.page-nav__cell--right
			.page-nav__links(v-if="pageOptions && pageOptions.length")
				a.page-nav__link(
					v-if="pageOptions[0].value > 1"
					:href="getPageLink(1)"
					@click.prevent="navigateToPage(1)")
					| 1
				span.page-nav__link-spacer(v-if="pageOptions[0].value > 2") ...

				a.page-nav__link(
						v-for="option in pageOptions"
						:href="option.value == pageNumber ? null : getPageLink(option.value)"
						:class="{'page-nav__link--active': option.value == pageNumber}"
						:key="option.value"
						@click.prevent="navigateToPage(option.value)")
					| {{option.text}}

				span.page-nav__link-spacer(v-if="pageOptions[pageOptions.length-1].value < lastPageNumber - 1") ...
				a.page-nav__link(
						v-if="pageOptions[pageOptions.length-1].value < lastPageNumber"
						:href="getPageLink(lastPageNumber)" 
						@click.prevent="navigateToPage(lastPageNumber)")
					| {{lastPageNumber}}
</template>

<script>
import breakpoints from 'scripts/breakpoints';

export default {
	props: {
		page: {
			type: Object,
			default: () => {
				return {
					offset: 0,
					limit: 0,
					count: 0
				};
			}
		}
	},
	
	emits: [
		'navigate'
	],

	data() {
		return {
			localPage: {
				offset: 0,
				limit: 0,
				default: 0
			},
			short: false
		};
	},

	computed: {
		pageNumber() {
			return Math.ceil(this.localPage.offset / this.localPage.limit) + 1;
		},

		lastPageNumber() {
			return Math.ceil(this.localPage.count / this.localPage.limit);
		},

		pageOptions() {
			let result = [];
			if (this.localPage.limit) {
				let pageDispersion = this.pageNumber > 5 ? 4 : 5;
				// show last 10
				if (this.lastPageNumber - this.pageNumber < 5) {
					pageDispersion = 9 - this.lastPageNumber + this.pageNumber;
				}
				// short mode for 3xs screen
				if (this.short) {
					pageDispersion -= 1;
				}
				// build array of page
				for (let i = 1; i <= this.lastPageNumber; i++) {
					if (i - Math.max(pageDispersion, this.pageNumber) <= pageDispersion && i - Math.max(pageDispersion, this.pageNumber) >= -pageDispersion) {
						result.push({value: i, text: i});
					}
				}
			}
			return result;
		}
	},

	watch: {
		page: {
			handler() {
				this.initLocalPage();
			},
			deep: true
		}
	},

	created() {
		this.initLocalPage();
		window.addEventListener('resize', this.handleResize);
	},

	unmounted() {
		window.removeEventListener('resize', this.handleResize);
	},

	methods: {
		initLocalPage() {
			this.localPage = {
				offset: parseInt(this.page.offset) || 0,
				limit: parseInt(this.page.limit) || 0,
				count: parseInt(this.page.count) || 0
			};
		},

		navigateToAppend() {
			let vm = this;
			this.$emit('navigate', {
				offset: vm.localPage.offset + this.localPage.limit,
				limit: vm.localPage.limit,
				append: true
			});
		},

		navigateToPage(page) {
			let vm = this;
			this.$emit('navigate', {
				offset: vm.localPage.limit * (page - 1),
				limit: vm.localPage.limit,
				append: false
			});
		},

		getPageLink(page) {
			return window.location.href + (window.location.href.indexOf('?') > -1 ? '&' : '?') +
				'state[page][limit]=' + this.localPage.limit +
				'&state[page][offset]=' + this.localPage.limit * (page - 1);
		},

		handleResize() {
			this.short = window.innerWidth <= breakpoints['3xs-max'];
		}
	}
};
</script>