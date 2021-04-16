<template lang="pug">
.v-filter-active-items.active-filters
	transition-group.active-filters__grid(name="flip" tag="div")
		.active-filters__cell(v-for="(filter, index) in activeFilters" :key="filter.id + '-' + filter.value || index")
			button.btn.btn--sm.btn--remove.active-filters__btn(type="button" @click="resetFilter(filter)") {{filter.text}}
				svg.btn__icon.btn__icon--right
					use(xlink:href="#svg-icon-close-sm")
</template>

<script>
export default {
	props: {
		filters: {
			type: Array,
			default: null
		}
	},

	emits: [
		'reset-filter'
	],

	computed: {
		activeFilters() {
			let result = [];

			if (!this.filters) {
				return result;
			}

			this.filters.forEach((filter) => {
				if (filter.options) {
					filter.options.forEach((option) => {
						if (Array.isArray(filter.value) && filter.value.indexOf(option.value) >= 0 || option.value === filter.value) {
							result.push({
								id: filter.id,
								value: option.value,
								text: option.text || option.value
							});
						}
					});
				} else {
					let text;
					if (filter.type == 'range') {
						text = `${filter.title} ${filter.prefixMin} ${filter.value.min} ${filter.postfixMin} ${filter.prefixMax} ${filter.value.max} ${filter.postfixMax}`;
					} else {
						text = `${filter.title} ${filter.value}`;
					}
					result.push({
						id: filter.id,
						value: filter.value,
						text: text
					});
				}
			});

			return result;
		}
	},

	methods: {
		resetFilter(filter) {
			this.$emit('reset-filter', filter);
		}
	}
};
</script>