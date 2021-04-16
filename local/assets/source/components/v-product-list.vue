<template lang="pug">
.v-product-list.product-list
	.product-list__grid
		.product-list__cell(v-for="(item, index) in items" :key="item.id || index")
			v-product(template="list" :product="item" :quick-view="quickView")
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