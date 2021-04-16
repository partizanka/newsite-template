<template lang="pug">
.v-loader.loader(:class="{'loader--active': loading}")
	.loader__container
		transition(name="fade")
			svg.svg-icon.loader__icon(v-if="loading" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 38 38")
				g(vector-effect="non-scaling-stroke" fill="none")
					circle(cx="19" cy="19" r="18" stroke="currentColor" stroke-opacity=".3")
					path(d="M37,19c0-9.9-8.1-18-18-18" stroke="currentColor")
</template>

<script>
export default {
	props: {
		loading: {
			type: Boolean,
			default: false
		}
	}
};
</script>