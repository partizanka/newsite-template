<template lang="pug">
.v-favorite-small.basket-small(:class="{'basket-small--empty': favoriteEmpty}")
	a.basket-small__widget(:href="favoriteEmpty ? null : favorite.link")
		.basket-small__cell-icon
			svg.svg-icon.basket-small__icon
				use(xlink:href="#svg-icon-favorite")
			.basket-small__badge.badge.badge--primary(v-if="favoriteCount") {{favoriteCount}}
		.basket-small__cell-main
			.basket-small__title.flc Избранное
			.basket-small__price.flc(v-if="favoriteEmpty") Нет товаров
</template>

<script>
export default {
	computed: {
		favorite() {
			return this.$store.state.favorite;
		},

		favoriteEmpty() {
			return this.$store.getters['favorite/favoriteEmpty'];
		},

		favoriteCount() {
			return this.$store.getters['favorite/favoriteCount'];
		}
	}
};
</script>