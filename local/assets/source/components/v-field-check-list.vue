<template lang="pug">
.v-field-check-list.field-check-list
	label.field-check-list__label(v-if="field.label" :id="uniqueId") {{field.label}}
	.field-check-list__item.flc(v-for="(option, index) in field.options" :key="option.value + '-' + index")
		v-field-checkbox(
				:true-value="option.value"
				:text="option.text"
				:disabled="option.disabled || field.disabled"
				v-model="localValue"
				@update:model-value="handleInput"
				:radio="radio")
</template>

<script>
import uniqueId from 'scripts/helpers/uniqueId';

export default {
	props: {
		radio: {
			type: Boolean,
			default: false
		},

		field: {
			type: Object,
			required: true,
			default: null
		},

		modelValue: {
			type: [Object, String, Number],
			default: null
		}
	},

	emits: [
		'update:modelValue'
	],

	data() {
		return {
			localValue: null,
			open: false,
			uniqueId: uniqueId('field-')
		};
	},

	watch: {
		modelValue() {
			this.updateLocalValue();
		}
	},

	created() {
		this.updateLocalValue();
	},

	methods: {
		updateLocalValue() {
			this.localValue = this.modelValue;
		},

		handleInput() {
			this.$emit('update:modelValue', this.localValue);
		}
	},
};
</script>
