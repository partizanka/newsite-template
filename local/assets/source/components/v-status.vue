<template lang="pug">
.v-status.status
	template(v-if="status")
		.status__list
			.status__item(v-for="item in status")
				.status-label(:style="{'background': item.background, 'color': item.color}") {{item.text}}
</template>

<script>
export default {
	props: {
		status: {
			type: Array,
			default: null
		}
	}
};
</script>
