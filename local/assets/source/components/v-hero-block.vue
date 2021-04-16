<template lang="pug">
.v-hero-block.hero-block(:class="{'hero-block--dark': slide && slide.dark, 'hero-block--right': slide && slide.position == 'right'}")
	v-loader(:loading="loading")
	template(v-if="slide")
		a.hero-block__link(
			v-if="slide.link"
			:href="slide.link"
			:aria-label="slide.title")
		.hero-block__bg-layer(v-if="slide.imageSources")
			.hero-block__bg.hero-block__bg--large(v-if="slide.imageSources.large")
				.hero-block__bg-image(:style="{'background-image': 'url('+slide.imageSources.large+')'}")
			.hero-block__bg.hero-block__bg--medium(v-if="slide.imageSources.medium")
				.hero-block__bg-image(:style="{'background-image': 'url('+slide.imageSources.medium+')'}")
			.hero-block__bg.hero-block__bg--small(v-if="slide.imageSources.small")
				.hero-block__bg-image(:style="{'background-image': 'url('+slide.imageSources.small+')'}")
		.hero-block__fg-layer
			.hero-block__container.container
				.hero-block__content
					h2.hero-block__title.h1.flc(v-if="slide.title") {{slide.title}}
					.hero-block__text.flc(v-if="slide.text" v-html="slide.text")
					.hero-block__actions.flc(v-if="slide.buttons && slide.buttons.length")
						.hero-block__actions-grid
							.hero-block__actions-cell(v-for="button in slide.buttons")
								a.hero-block__action.btn(
									:href="button.link" 
									:class="{'btn--primary': !slide.dark && button.type === 'primary', 'btn--white': slide.dark && button.type === 'default', 'btn--primary-white': slide.dark && button.type === 'primary'}") {{button.text}}
</template>

<script>
import sourceMixin from 'components/mixins/v-mixin-source.vue';

export default {
	mixins: [
		sourceMixin
	],

	data() {
		return {
			slide: null
		};
	},

	methods: {
		dataSet(data) {
			this.slide = data;
		}
	}
};
</script>