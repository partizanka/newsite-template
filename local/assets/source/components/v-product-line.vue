<template lang="pug">
.v-product-line.product-line
	v-loader(:loading="loading")
	.product-line__block
		.product-line__grid(v-if="catalog && catalog.items && catalog.items.length")
			.product-line__cell(v-for="(item, index) in catalog.items" :key="item.id || index")
				v-product(v-if="catalog.type === 'products'" key="products" :product="item" :quick-view="quickView")
				v-article-poster(v-else-if="catalog.type === 'articles'" key="articles" :article="item")
</template>

<script>
import sourceMixin from 'components/mixins/v-mixin-source.vue';

export default {
	mixins: [
		sourceMixin
	],

	props: {
		quickView: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			catalog: {}
		};
	},

	methods: {
		dataSet(data) {
			this.catalog = data;
		}
	}
};
</script>