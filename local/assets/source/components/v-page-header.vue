<template lang="pug">
header.v-page-header.page-header
	.container
		.page-header__layout
			.page-header__cell.page-header__cell--menu
				button.page-header__menu-btn(type="button" @click="openMobileNav", aria-label="меню")
					svg.svg-icon.page-header__menu-icon
						use(xlink:href="#svg-icon-menu")

			.page-header__cell.page-header__cell--logo
				a.page-header-logo(href="/local/assets/dist/markup/index.html", aria-label="главная")
					svg.svg-icon.page-header-logo__icon
						use(xlink:href="#svg-icon-logo")
			.page-header__cell.page-header__cell--search
				v-search-small(
						data-source="/local/assets/dist/fixtures/search-small.json"
						bxajaxid="1С-Битрикс")

			.page-header__cell.page-header__cell--favorite
				v-favorite-small

			.page-header__cell.page-header__cell--basket
				v-basket-small
</template>

<script>
import sourceMixin from 'components/mixins/v-mixin-source.vue';
import controller from 'scripts/controller/controller';

export default {
	mixins: [
		sourceMixin
	],

	data() {
		return {
			menu: []
		};
	},

	methods: {
		dataSet(data) {
			this.menu.push(data);
		},

		openMobileNav() {
			controller.openMobileNav();
		}
	}
};
</script>
