<template lang="pug">
.v-page-section-header.page-section-header
	.page-section-header__main
		h2.page-section-header__title(v-if="section.title")
			template(v-if="section.title.link")
				a.page-section-header__title-link.link(:href="section.title.link") {{section.title.text}}
			template(v-else='') 
				span {{section.title.text}}
	.page-section-header__aside(v-if="section.links && section.links.length")
		.page-section-header__aside-links
			.page-section-header__aside-links-item(v-for="link in section.links")
				a.page-section-header__aside-link.link(:href="link.link") {{link.text}}
</template>

<script>
import sourceMixin from 'components/mixins/v-mixin-source.vue';

export default {
	mixins: [sourceMixin],

	data() {
		return {
			section: null
		};
	},

	methods: {
		dataSet(data) {
			this.section = data;
		}
	}
};
</script>