<template lang="pug">
.v-main-slider.main-slider
	v-loader(:loading="loading")
	template(v-if="slider")
		v-swiper-slider.main-slider__slider(:key="uniqueId" :options="slider.options")
			v-swiper-slide.main-slider__slide(v-for="(slide, index) in slider.slides" :key="slide.id || index")
				.main-slider__title {{slide.title}}
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
			uniqueId: uniqueId('swiper-slider-')
		};
	},

	methods: {
		dataSet(data) {
			this.slider = data;
		}
	}
};
</script>