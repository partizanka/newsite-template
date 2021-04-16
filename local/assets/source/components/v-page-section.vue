<template lang="pug">
section.v-page-section.page-section
	.container
		v-page-section-header(:data-source="section")
		slot
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