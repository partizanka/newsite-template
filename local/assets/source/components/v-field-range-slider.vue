<template lang="pug">
.v-field-range-slider.field-range-slider(:class="{'field-range-slider--disabled': field.disabled}")
	.field-range-slider__labels
		.field-range-slider__label.field-range-slider__label--min {{localValue.min}} {{field.postfixMin}}
		.field-range-slider__label.field-range-slider__label--max {{localValue.max}} {{field.postfixMax}}
	.field-range-slider__controls
		.field-range-slider__ruler(ref="ruler")
		.field-range-slider__active(:style="{'left': position.min, 'right': position.maxReverse}")
		.field-range-slider__handle(:style="{'left': position.min}" @mousedown="mousedown('min')" :class="{'field-range-slider__handle--z-bump': parseInt(position.min) > 98}")
		.field-range-slider__handle(:style="{'left': position.max}" @mousedown="mousedown('max')")
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
			rulerWidth: 0,
			drag: false
		};
	},

	computed: {
		position() {
			return {
				min: (this.localValue.min - this.field.min) / (this.field.max - this.field.min) * 100 + '%',
				max: (this.localValue.max - this.field.min) / (this.field.max - this.field.min) * 100 + '%',
				maxReverse: 100 - (this.localValue.max - this.field.min) / (this.field.max - this.field.min) * 100 + '%',
			};
		}
	},

	watch: {
		modelValue() {
			this.updateLocalValue();
		}
	},

	created() {
		this.updateLocalValue();
		this.updateRulerSize();
		window.addEventListener('resize', this.updateRulerSize);
		document.addEventListener('mouseup', this.mouseup);
		document.addEventListener('mousemove', this.mousemove);
	},

	unmounted() {
		window.removeEventListener('resize', this.updateRulerSize);
		document.removeEventListener('mouseup', this.mouseup);
		document.removeEventListener('mousemove', this.mousemove);
	},

	methods: {
		updateLocalValue() {
			this.localValue = this.modelValue || {min: this.field.min || 0, max: this.field.max || 0};
		},

		updateRulerSize() {
			this.rulerWidth = this.$refs['ruler'] && this.$refs['ruler'].offsetWidth;
		},

		mousedown(handle) {
			this.drag = handle;
		},

		mouseup() {
			this.drag = false;
		},

		mousemove(e) {
			if (this.drag && !this.field.disabled) {
				let ruler = this.$refs['ruler'];
				let rect = ruler.getBoundingClientRect();
				let diff = (e.pageX - rect.left) / rect.width;
				diff = Math.max(0, Math.min(1, diff));
				let val;
				let precision = this.field.precision || 1;
				let precisionString = precision.toString();
				let precisionPointIndex = precisionString.indexOf('.');

				if (this.drag === 'min') {
					val = Math.min(this.localValue.max, (this.field.max - this.field.min) * diff + this.field.min);
					val = Math.round(val / precision) * precision;
					// fix JS round bugs
					if (precisionPointIndex >= 0) {
						val = parseFloat(val.toFixed(precisionString.slice(precisionPointIndex).length));
					}
					this.localValue.min = val;
				} else if (this.drag === 'max') {
					val = Math.max(this.localValue.min, (this.field.max - this.field.min) * diff + this.field.min);
					val = Math.round(val / precision) * precision;
					// fix JS round bugs
					if (precisionPointIndex >= 0) {
						val = parseFloat(val.toFixed(precisionString.slice(precisionPointIndex).length));
					}
					this.localValue.max = val;
				}

				this.$emit('update:modelValue', this.localValue);
			}
		}
	}
};
</script>
