<template lang="pug">
img.v-image.image(:src="src" :srcset="computedSrcset" :alt="alt" :loading="loading" :class="{'image--loading': !loaded}")
</template>

<script>
export default {
	props: {
		loading: {
			type: String,
			default: 'lazy'
		},

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

	emits: [
		'load'
	],

	data() {
		return {
			loaded: false
		};
	},

	computed: {
		computedSrcset() {
			if (!this.sources || !this.sources.length) {
				return this.src;
			} else {
				return this.sources.map((item) => `${item.src} ${item.size}`).join(', ');
			}
		}
	},

	mounted() {
		if (this.$el.complete) {
			this.handleLoad();
		} else {
			this.$el.addEventListener('load', this.handleLoad);
		}
	},

	methods: {
		handleLoad() {
			this.loaded = true;
			this.$emit('load');
		}
	}
};
</script>