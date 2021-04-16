<template lang="pug">
.v-product-image.product-image(:class="{'product-image--loading': !loaded}")
	v-image.product-image__image(v-if="src" :src="src" :sources="sources" :alt="alt" key="src" @load="loaded = true")
	.product-image__placeholder(v-else="" key="no-src")
		svg.svg-icon.product-image__placeholder-icon
			use(xlink:href="#svg-icon-no-photo")
</template>

<script>

export default {
	props: {
		src: {
			type: String,
			default: null
		},

		sources: {
			type: Array,
			default: null
		},

		alt: {
			type: String,
			default: ''
		}
	},

	data() {
		return {
			loaded: false
		};
	},
};
</script>