<template lang="pug">
.v-availability.availability(:class="{'availability--available': availability && availability.value === 1, 'availability--unavailable': availability && availability.value === 0}")
	svg.svg-icon.availability__icon
		use(xlink:href="#svg-icon-placeholder")
	.availability__main(v-if="availability && availability.text") {{availability.text}}
</template>

<script>

export default {
	props: {
		availability: {
			type: Object,
			default: null
		}
	}
};
</script>