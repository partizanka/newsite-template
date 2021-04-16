<template lang="pug">
.v-field-text.field-text
	template(v-if="field.type === 'textarea'")
		label.field-label(v-if="field.label" :for="uniqueId") {{field.label}}
		textarea.field-input(
				:class="{'field-input--sm': field.size === 'sm'}"
				:inputmode="field.inputmode"
				:disabled="field.disabled"
				:placeholder="field.placeholder"
				v-model="localValue"
				@input="handleInput"
				:id="uniqueId")
	template(v-else-if="this.field.mask")
		label.field-label(v-if="field.label" :for="uniqueId") {{field.label}}
		input.field-input(
				ref="input"
				:class="{'field-input--sm': field.size === 'sm'}"
				:type="computedType"
				:inputmode="field.inputmode"
				:disabled="field.disabled"
				:placeholder="field.placeholder"
				v-model="localValue"
				@input="handleInput"
				@keyup="handleKeyup"
				:id="uniqueId" 
				v-maska="field.mask")
	template(v-else="")
		label.field-label(v-if="field.label" :for="uniqueId") {{field.label}}
		input.field-input(
				ref="input"
				:class="{'field-input--sm': field.size === 'sm'}"
				:type="computedType"
				:inputmode="field.inputmode"
				:disabled="field.disabled"
				:placeholder="field.placeholder"
				v-model="localValue"
				@input="handleInput"
				@keyup="handleKeyup"
				:id="uniqueId")
</template>

<script>
import uniqueId from 'scripts/helpers/uniqueId';

export default {
	props: {
		field: {
			type: Object,
			default: null,
			required: true
		},

		modelValue: {
			type: [String, Number],
			default: null
		}
	},

	emits: [
		'update:modelValue'
	],
	
	data() {
		return {
			localValue: null,
			savedValue: null,
			uniqueId: uniqueId('field-text_')
		};
	},

	computed: {
		computedType() {
			if (!this.field.type || this.field.type == 'number') {
				return 'text';
			}
			return this.field.type;
		},

		isFieldNumeric() {
			return !!(this.field.type === 'number' || this.field.inputmode === 'numeric' || this.field.inputmode === 'decimal');
		}
	},

	watch: {
		modelValue: {
			immediate: true,
			handler() {
				if (this.isFieldNumeric && this.modelValue) {
					this.localValue = this.savedValue = this.modelValue.toString().replace('.', ',');
				} else {
					this.localValue = this.savedValue = this.modelValue;
				}
			}
		}
	},

	methods: {
		handleKeyup() {
			if (this.isFieldNumeric && this.savedValue) {
				this.localValue = this.savedValue.replace('.', ',');
			}
		},

		handleInput() {
			if (this.isFieldNumeric) {
				if (!this.localValue || /^-?(?:\d+)(?:(\.|,)(\d+)?)?$/.test(this.localValue)) {
					this.savedValue = this.localValue;
				} else {
					this.localValue = this.savedValue;
				}
				this.$emit('update:modelValue', this.localValue ? parseFloat(this.localValue.toString().replace(',', '.')) : this.localValue);
			} else {
				this.$emit('update:modelValue', this.localValue);
			}
		}
	}
};
</script>
