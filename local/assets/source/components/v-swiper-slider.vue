<template lang="pug">
.v-swiper-slider.swiper-slider
	.swiper-slider__slider
		template(v-if="sliderReady")
			v-swiper(
					v-bind="computedOptions"
					:navigation="computedNavigation"
					:pagination="computedPagination"
					:id="uniqueId")
				slot
</template>

<script>
// import Swiper core and required components
import SwiperCore, {
	Navigation,
	Pagination,
	A11y
} from 'swiper';

// Import Swiper Vue.js components
import {Swiper} from 'swiper/vue';
import uniqueId from 'scripts/helpers/uniqueId';

// install Swiper components
SwiperCore.use([
	Navigation,
	Pagination,
	A11y
]);

// Import Swiper styles
export default {
	components: {
		'v-swiper': Swiper
	},

	props: {
		options: {
			type: Object,
			default: null
		},

		pagination: {
			type: [Boolean, Object],
			default: false
		},

		navigation: {
			type: [Boolean, Object],
			default: false
		}
	},

	data() {
		return {
			sliderReady: false,
			uniqueId: uniqueId('swiper-slider_'),
		};
	},

	computed: {
		computedPagination() {
			if (!this.pagination) {
				return false;
			}

			return this.applyDefaults({
				nextEl: null,
				prevEl: null
			}, this.pagination);
		},

		computedNavigation() {
			if (!this.navigation) {
				return false;
			}

			return this.applyDefaults({
				clickable: true
			}, this.navigation);
		},

		computedOptions() {
			return this.applyDefaults({
				slidesPerView: 1,
				spaceBetween: 0,
				loop: true
			}, this.options);
		}
	},

	mounted() {
		this.sliderReady = true;
	},

	methods: {
		applyDefaults(defaults, options) {
			if (typeof options === 'object') {
				Object.keys(options).forEach(key => {
					if (typeof options[key] !== 'undefined') {
						defaults[key] = options[key];
					}
				});
			}
			return defaults;
		}
	}
};
</script>