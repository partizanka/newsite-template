<template lang="pug">
.v-field.field(:class="{'form-error': field && localErrors && localErrors.length && !field.multiple}")

	//- multiple field: create list of v-field's with add/remove button
	template(v-if="field.multiple && field.type !== 'file'")
		.field__multiple-list(v-if="Array.isArray(localValue) && localValue.length")
			.field__multiple-list-grid
				.field__multiple-list-item(v-for="(item, index) in localValue")
					v-field(
							:field="{...field, multiple: false, label: field.label, errors: localErrors ? localErrors[index] : null}"
							v-model="localValue[index]")
					button.field__multiple-list-remove.link(
							v-if="localValue.length > multipleLimitMin"
							type="button"
							@click="multipleRemove(index)") Удалить
		transition(name="fade")
			button.field__multiple-list-add.link(
					type="button"
					@click="multipleAdd"
					v-if="!localValue || localValue.length < field.multipleLimit") Добавить

	//- regular field
	template(v-else="")
		template(v-if="field.type == 'select'")
			v-field-select(:field="field" :model-value="localValue" @update:model-value="handleInput")

		template(v-else-if="field.type == 'check-list'")
			v-field-check-list(:field="field" :model-value="localValue" @update:model-value="handleInput")

		template(v-else-if="field.type == 'radio-list'")
			v-field-check-list(:field="field" radio :model-value="localValue" @update:model-value="handleInput")

		template(v-else-if="field.type == 'count'")
			v-field-count(:field="field" :model-value="localValue" @update:model-value="handleInput")

		template(v-else-if="field.type == 'range'")
			v-field-range(:field="field" :model-value="localValue" @update:model-value="handleInput")

		template(v-else-if="field.type == 'range-slider'")
			v-field-range-slider(:field="field" :model-value="localValue" @update:model-value="handleInput")

		template(v-else-if="field.type == 'file'")
			v-field-file(:field="field" @fileinput="fileInput" @fileremove="fileRemove")

		template(v-else-if="field.type == 'view-picker'")
			v-field-view-picker(:field="field" :model-value="localValue" @update:model-value="handleInput" :disabled="field.disabled")

		template(v-else="")
			v-field-text(:field="field" :model-value="localValue" :disabled="field.disabled" @update:model-value="handleInput")

		.field__errors(v-if="Array.isArray(localErrors) && localErrors && localErrors.length")
			.field__error.flc(v-for="(error, index) in localErrors" :key="index") {{error}}
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
			type: [Object, String, Number, Boolean, Date],
			default: null
		}
	},

	emits: [
		'fileinput',
		'fileremove',
		'update:modelValue'
	],

	data() {
		return {
			localValue: null,
			localErrors: null
		};
	},

	computed: {
		multipleLimitMin() {
			let limit = this.field && this.field.multipleLimitMin;
			return isNaN(limit) ? 1 : limit;
		}
	},

	watch: {
		modelValue: {
			immediate: true,
			handler() {
				this.updateLocalValue();
			}
		},

		field: {
			immediate: true,
			handler() {
				this.localErrors = this.field.errors;
			}
		}
	},

	methods: {
		fileInput(e) {
			this.$emit('fileinput', e);
		},

		fileRemove(e) {
			this.$emit('fileremove', e);
		},

		updateLocalValue() {
			this.localValue = this.modelValue;
		},

		multipleAdd() {
			if (!Array.isArray(this.localValue)) {
				this.localValue = [];
			}

			if (this.localValue.length < this.field.multipleLimit) {
				this.localValue.push(null);
			}
		},

		multipleRemove(index) {
			this.localValue.splice(index, 1);

			if (Array.isArray(this.localErrors)) {
				this.localErrors.splice(index, 1);
			}
		},

		handleInput(value) {
			this.localValue = value;
			this.$emit('update:modelValue', this.localValue);
		}
	}
};
</script>
