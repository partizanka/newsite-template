<template lang="pug">
.v-filter.filter
	.filter__group.filter__group--links.flc(v-if="links")
		.filter__list
			.filter__list-item(v-for="link in links")
				a.filter__link(:href="link.current ? null : link.link" :class="{'filter__link--current': link.current}") {{link.text}}
	.filter__group.filter__group--view.flc(v-if="$slots['view']")
		.filter__group-title.h4.flc Вид
		.filter__group-body.flc
			slot(name="view")
	.filter__group.filter__group--sort.flc.fcc(v-if="$slots['sort']")
		.filter__group-title.h4.flc Сортировка
		.filter__group-body.flc
			slot(name="sort")
	template(v-if="localFilters")
		.filter__group.filter__group--filter.flc.fcc(v-for="filter in localFilters")
			.filter__group-title.h4.flc(v-if="filter.title") {{filter.title}}
			.filter__group-body.flc
				v-field(:field="{...filter, disabled: isFilterBlocked(filter.id)}" v-model="filter.value" @update:model-value="filterChange(filter.id)")
	transition(name="fade")
		.filter__actions.flc.fcc(v-if="changedFilters && changedFilters.length")
			.filter__actions-item
				button.btn(type="button" @click="resetAll()") Очистить фильтр
</template>

<script>
export default {
	props: {
		links: {
			type: Array,
			default: null
		},

		filters: {
			type: Array,
			default: null
		}
	},

	emits: [
		'filter-changed',
		'filter-updated'
	],

	data() {
		return {
			localFilters: [],
			filterDebounceTimeout: null,
			lastChangedFilterId: null
		};
	},

	computed: {
		changedFilters() {
			let result = [];
			this.localFilters.forEach((filter) => {
				if (this.isFilterChanged(filter)) {
					result.push(filter);
				}
			});
			return result;
		}
	},

	watch: {
		filters() {
			this.applyNewFilters();
		}
	},

	created() {
		this.applyNewFilters();
	},

	methods: {
		isFilterChanged(filter) {
			if (typeof filter.value == 'number' ||
				(filter.value && filter.value.length && filter.value.length > 0) ||
				(filter.type === 'range' && filter.value && ((filter.value.min > filter.min) || (filter.value.max < filter.max)) ) ) {
				return true;
			}
			return false;
		},

		isFilterBlocked(filterId) {
			return this.lastChangedFilterId && this.lastChangedFilterId !== filterId;
		},

		applyNewFilters() {
			let tmpFilters = [];
			this.filters.forEach((filter) => {
				let oldFilter = this.localFilters.find((item) => item.id === filter.id);
				filter.open = oldFilter ? oldFilter.open : !!filter.open;
				tmpFilters.push(filter);
			});
			this.localFilters = JSON.parse(JSON.stringify(tmpFilters));
			this.$emit('filter-updated', this.createValue(), this.changedFilters);
		},

		resetFilter(options) {
			console.log('resetFilter options', options);
			let filter = this.localFilters.find((filter) => filter.id === options.id);

			if (!filter) {
				return;
			}

			if (filter.type == 'range' || filter.type == 'range-slider') {
				filter.value.min = filter.min;
				filter.value.max = filter.max;
			} else {
				if (options.value && Array.isArray(filter.value)) {
					filter.value.splice(filter.value.indexOf(options.value), 1);
				} else {
					filter.value = [];
				}
			}

			if (!options.silent) {
				this.filterChange();
			}
		},

		resetAll() {
			this.localFilters.forEach((filter) => {
				this.resetFilter({id: filter.id, silent: true});
			});
			this.filterChange();
		},

		createValue() {
			let result = {};
			this.changedFilters.forEach((filter) => {
				result[filter.id] = {value: filter.value, type: filter.type};
			});
			return result;
		},

		filterChange(filterId) {
			this.lastChangedFilterId = filterId;
			clearTimeout(this.filterDebounceTimeout);
			this.filterDebounceTimeout = setTimeout(() => {
				this.lastChangedFilterId = null;
				this.$emit('filter-changed', this.createValue(), this.changedFilters);
			}, 2000);
		}
	}
};
</script>