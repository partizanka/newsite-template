<template lang="pug">
.v-article-grid.article-grid
	.article-grid__grid
		.article-grid__cell(v-for="(item, index) in items" :key="item.id || index")
			v-article-poster(:article="item")
</template>

<script>

export default {
	props: {
		items: {
			type: Array,
			default: null
		}
	}
};
</script>