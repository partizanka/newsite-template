<template lang="pug">
label.v-field-checkbox.field-checkbox(:class="{'field-checkbox--radio': radio}")
	input.field-checkbox__input(
			:type="radio ? 'radio' : 'checkbox'"
			:value="trueValue"
			v-model="localValue"
			@change="handleInput"
			:disabled="disabled"
			:aria-labelledby="(labelId ? labelId + ' ' + uniqueId : null)"
			:id="uniqueId")
	span.field-checkbox__visual
	span.field-checkbox__text {{text}}
</template>

<script>
import uniqueId from 'scripts/helpers/uniqueId';

export default {
	props: {
		radio: {
			type: Boolean,
			default: false
		},

		text: {
			type: [String, Number],
			default: null
		},

		modelValue: {
			type: [Object, String, Number],
			default: null
		},

		trueValue: {
			type: [Object, String, Number],
			default: null
		},

		disabled: {
			type: Boolean,
			default: false
		},

		labelId: {
			type: String,
			default: null
		},
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
	}
};
</script>
