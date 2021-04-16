<template lang="pug">
.v-product-slider.product-slider
	v-loader(:loading="loading")
	button.product-slider__arrow.product-slider__arrow--prev(type="button" ref="prev")
		svg.svg-icon.product-slider__icon
			use(xlink:href="#svg-icon-slide-left")
	button.product-slider__arrow.product-slider__arrow--next(type="button" ref="next")
		svg.svg-icon.product-slider__icon
			use(xlink:href="#svg-icon-slide-right")
	v-swiper-slider(
			v-if="slider && slider.items && slider.items.length"
			:options="computedOptions"
			:key="uniqueId"
			:navigation="computedNavigation"
			ref="swiperSlider")
		v-swiper-slide.product-slider__slide(v-for="(item, index) in slider.items" :key="item.id || index")
			v-product(v-if="slider.type === 'products'" :product="item")
			v-article-poster(:article="item" v-if="slider.type === 'articles'")
</template>

<script>
import sourceMixin from 'components/mixins/v-mixin-source.vue';
import breakpoints from 'scripts/breakpoints';
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
				spaceBetween: -1,
				breakpoints: {
					[breakpoints['lg-min']]: {
						slidesPerView: 4
					},
					[breakpoints['md-min']]: {
						slidesPerView: 3
					},
					[breakpoints['xs-min']]: {
						slidesPerView: 2
					}
				}
			};
			if (this.options) {
				Object.keys(this.options).forEach((key) => {
					if (typeof this.options[key] !== 'undefined') {
						result[key] = this.options[key];
					}
				});
			}
			return result;
		},

		computedNavigation() {
			return {
				prevEl: this.$refs.prev,
				nextEl: this.$refs.next
			};
		}
	},

	methods: {
		dataSet(data) {
			this.slider = data;
		}
	}
};
</script>