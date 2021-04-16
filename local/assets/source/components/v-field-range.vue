<template lang="pug">
.v-field-range.field-range(:class="{'field-range--sm': field.size === 'sm'}")
	.field-range__cell
		v-field.field-range__input(:field="{type: 'text', inputmode: 'decimal', disabled: field.disabled, precision: field.precision}" v-model="localValue.min" @update:model-value="handleInput" @keyup.native.enter="emitInput")
		.field-range__postfix(v-if="field.postfixMin") {{field.postfixMin}}
	.field-range__spacer —
	.field-range__cell
		v-field.field-range__input(:field="{type: 'text', inputmode: 'decimal', disabled: field.disabled, precision: field.precision}" v-model="localValue.max" @update:model-value="handleInput" @keyup.native.enter="emitInput")
	.field-range__postfix(v-if="field.postfixMax") {{field.postfixMax}}
</template>

<script>
export default {
	props: {
		field: {
			type: Object,
			default: null,
			required: true
		},

		modelValue: {
			type: Object,
			default: null
		}
	},

	emits: [
		'update:modelValue'
	],
	
	data() {
		return {
			localValue: null,
			debounceTimeout: null
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
			this.localValue = this.modelValue || {min: this.field.min || 0, max: this.field.max || 0};
		},

		handleInput() {
			clearTimeout(this.debounceTimeout);
			this.debounceTimeout = setTimeout(this.emitInput, 1000);
		},

		emitInput() {
			clearTimeout(this.debounceTimeout);

			if (this.field) {
				if (typeof this.field.max == 'number' && this.field.max !== Infinity) {
					this.localValue.max = Math.min(this.localValue.max, this.field.max);
				}
				if (typeof this.field.min == 'number' && this.field.max !== -Infinity) {
					this.localValue.min = Math.min(this.localValue.min, this.field.min);
				}

				if (this.localValue.min > this.localValue.max) {
					this.localValue.max = this.localValue.min;
				}
			}

			this.$emit('update:modelValue', this.localValue);
		}
	}
};
</script>
