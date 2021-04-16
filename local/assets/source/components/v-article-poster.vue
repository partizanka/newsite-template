<template lang="pug">
.v-article-poster.article-poster
	a.article-poster__link(:href="article.link" v-if="article.link" :aria-label="article.name")
	.article-poster__visual.flc
		v-product-image.article-poster__image(:src="article.image" :sources="article.imageSources")
		.article-poster__status(v-if="article.status && article.status.length")
			v-status(:status="article.status")
	.article-poster__title.flc(v-if="article.name") {{article.name}}
</template>

<script>

export default {
	props: {
		article: {
			type: Object,
			default: null
		}
	}
};
</script>