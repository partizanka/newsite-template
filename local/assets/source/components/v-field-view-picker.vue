<template lang="pug">
.v-field-view-picker.view-picker
	.view-picker__grid
		button.view-picker__item(
				type="button"
				v-for="(option, index) in field.options"
				:class="{'view-picker__item--active': option.value === modelValue}"
				@click="$emit('update:modelValue', option.value)"
				:key="index")
			svg.svg-icon.view-picker__icon
				use(:xlink:href="'#svg-icon-view-' + option.value")
</template>

<script>
export default {
	props: {
		field: {
			type: Object,
			default: null
		},

		modelValue: {
			type: [String, Number],
			default: null
		}
	}
};
</script>
