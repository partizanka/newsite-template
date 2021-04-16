<template lang="pug">
.v-product-grid.product-grid
	.product-grid__grid
		.product-grid__cell(v-for="(item, index) in items" :key="item.id || index")
			v-product(template="grid" :product="item" :quick-view="quickView")
</template>

<script>

export default {
	props: {
		items: {
			type: Array,
			default: null
		},

		quickView: {
			type: Boolean,
			default: false
		}
	}
};
</script>