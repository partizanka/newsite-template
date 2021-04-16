<template lang="pug">
.v-field-count.field-count
	button.field-count__btn.field-count__btn--sub(type="button" tabindex="-1" @click="localValue--; handleInput()" aria-label="уменьшить")
	label.field-label(:aria-label="field.label" :for="uniqueId")
		input.field-count__input.field-input(v-model="localValue" :disabled="field.disabled" :id="uniqueId")
	button.field-count__btn.field-count__btn--add(type="button" tabindex="-1" @click="localValue++; handleInput()" aria-label="увеличить")
</template>

<script>
import uniqueId from 'scripts/helpers/uniqueId';

export default {
	props: {
		field: {
			type: Object,
			default: null
		},

		modelValue: {
			type: Number,
			default: null
		}
	},
	
	emits: [
		'update:modelValue'
	],
	
	data() {
		return {
			localValue: null,
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
			this.localValue = parseFloat(this.localValue);

			if (!this.localValue) {
				this.localValue = 0;
			}

			if (this.field) {
				if (typeof this.field.max == 'number' && this.field.max !== Infinity) {
					this.localValue = Math.min(this.localValue, this.field.max);
				}
				if (typeof this.field.min == 'number' && this.field.max !== -Infinity) {
					this.localValue = Math.max(this.localValue, this.field.min);
				}
			}
			this.$emit('update:modelValue', this.localValue);
		}
	},

};
</script>
