<template lang="pug">
.v-basket-small.basket-small(:class="{'basket-small--empty': basketEmpty}")
	a.basket-small__widget(:href="basketEmpty ? null : basket.link")
		.basket-small__cell-icon
			svg.svg-icon.basket-small__icon
				use(xlink:href="#svg-icon-basket")
			.basket-small__badge.badge.badge--primary(v-if="basketCount") {{basketCount}}
		.basket-small__cell-main
			.basket-small__title.flc Корзина
			.basket-small__price.flc(v-if="basketEmpty" key="no-products") Нет товаров
			.basket-small__price.flc(v-else='' key="products")
				v-price(:price="basketPrice")
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: {
		...mapGetters({
			basketPrice: 'basket/basketPrice',
			basketEmpty: 'basket/basketEmpty',
			basketCount: 'basket/basketCount'
		}),
		
		basket() {
			return this.$store.state.basket;
		}
	}
};
</script>