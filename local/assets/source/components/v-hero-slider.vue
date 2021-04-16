<template lang="pug">
.v-hero-slider.hero-slider
	v-loader(:loading="loading")
	.hero-slider__arrow.hero-slider__arrow--prev(ref="prev")
		svg.svg-icon.hero-slider__icon
			use(xlink:href="#svg-icon-slide-left")
	.hero-slider__arrow.hero-slider__arrow--next(ref="next")
		svg.svg-icon.hero-slider__icon
			use(xlink:href="#svg-icon-slide-right")
	v-swiper-slider(
			v-if="slider && slider.slides && slider.slides.length" 
			:options="computedOptions" 
			:key="uniqueId" 
			ref="swiperSlider")
		v-swiper-slide(v-for="(slide, index) in slider.slides" :key="slide.id || index")
			v-hero-block(:data-source="slide")
</template>

<script>
import sourceMixin from 'components/mixins/v-mixin-source.vue';
import uniqueId from 'scripts/helpers/uniqueId';
import {SwiperSlide} from 'swiper/vue';

export default {
	components: {
		'v-swiper-slide': SwiperSlide
	},

	mixins: [
		sourceMixin
	],

	props: {
		options: {
			type: Object,
			default: null
		}
	},

	data() {
		return {
			slider: {},
			uniqueId: uniqueId('swiper-')
		};
	},

	computed: {
		computedOptions() {
			let result = {
				slidesPerView: 1,
				spaceBetween: 0
			};
			if (this.options) {
				Object.keys(this.options).forEach((key) => {
					if (typeof this.options[key] !== 'undefined') {
						result[key] = this.options[key];
					}
				});
			}
			return result;
		}
	},

	methods: {
		dataSet(data) {
			this.slider = data;
			let prevArrow = this.$refs.prev;
			let nextArrow = this.$refs.next;
			this.$nextTick(() => {
				const slider = this.$refs.swiperSlider;
				slider.dataNavigation = {
					prevEl: prevArrow,
					nextEl: nextArrow
				};
			});
		}
	}
};
</script>