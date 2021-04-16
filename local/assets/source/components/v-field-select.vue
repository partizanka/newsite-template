<template lang="pug">
.v-field-select.field-select(:class="{'field-select--open': open, 'field-select--sm': field.size === 'sm'}")
	label.field-select__label(v-if="field.label" :for="uniqueId") {{field.label}}
	button.field-select__btn(type="button" @click="open = !open" :id="uniqueId")
		transition(name="fade" mode="out-in")
		span.field-select__btn-placeholder(v-if="!activeOption && field.placeholder" key="placeholder") {{field.placeholder}}
		span.field-select__btn-text(v-else-if="activeOption" key="text") {{activeOption.text}}
		svg.svg-icon.field-select__btn-arrow
			use(xlink:href="#svg-icon-chevron-down-sm")
	transition(name="dropdown")
		.field-select__list(v-if="field && open" @click="open = false;")
			transition(name="dropdown-inner")
				.field-select__list-container(v-if="open")
					button.field-select__list-item(type="button" v-for="option in field.options" @click="localValue = option.value; handleInput();") {{option.text}}
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
			type: [Object, String, Number, Boolean, Symbol, Date],
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
			uniqueId: uniqueId('field-select_')
		};
	},

	computed: {
		activeOption() {
			if (this.field && this.field.options && this.field.options.length) {
				return this.field.options.find(option => option.value === this.localValue);
			}
			return null;
		}
	},

	watch: {
		modelValue() {
			this.updateLocalValue();
		}
	},

	created() {
		this.updateLocalValue();
		document.addEventListener('click', this.handleClickOutside);
		document.addEventListener('keydown', this.handleEsc);
	},

	unmounted() {
		document.removeEventListener('click', this.handleClickOutside);
		document.removeEventListener('keydown', this.handleEsc);
	},

	methods: {
		updateLocalValue() {
			this.localValue = this.modelValue;
		},

		handleInput() {
			this.$emit('update:modelValue', this.localValue);
		},

		handleClickOutside(e) {
			if (!this.$el.contains(e.target)) {
				this.open = false;
			}
		},

		handleEsc(e) {
			if (e.keyCode == 27 && this.open) {
				e.stopPropagation();
				this.open = false;
			}
		}
	}
};
</script>
