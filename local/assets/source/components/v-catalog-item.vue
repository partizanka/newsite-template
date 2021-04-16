<template lang="pug">
.v-catalog-item.catalog-item
	v-loader(:loading="loading")
	.container
		template(v-if="!catalog")
			.catalog__placeholder
		template(v-if="catalog")
			.catalog-item__wrap
				.catalog-item__aside
					.catalog-item__visual-wrap
						.catalog-item__visual
							.catalog-item__status
								v-status(:status="catalog.item.status")
							v-product-image.catalog-item__image(:src="catalog.item.image" :sources="catalog.item.imageSources")
				.catalog-item__main
					.catalog-item__price.flc
						v-price(:price="catalog.item.price" size="lg")
					.catalog-item__availability.flc
						v-availability(:availability="catalog.item.availability")
					.catalog-item__basket-action.flc
						v-basket-action(:id="catalog.item.id")
					.catalog-item__filter.flc
						.catalog-item__filter-item(v-for="filter in catalog.filters")
							v-field(v-model="filter.value" :field="{...filter, label: filter.title}" @update:model-value="filterChanged")
					.catalog-item__info.flc(v-if="catalog.item.info && catalog.item.info.length")
						.info-box
							.info-box__group.flc(v-for="param in catalog.item.info")
								h4.info-box__heading.flc(v-if="param.name" v-html="param.name")
								.info-box__body.flc.text-guide(v-if="param.value" v-html="param.value")
					.catalog-item__params.flc(v-if="catalog.item.params && catalog.item.params.length")
						.key-value-list.flc
							.key-value-list__item(v-for="param in catalog.item.params")
								.key-value-list__item-start(v-html="param.name")
								.key-value-list__item-spacer
								.key-value-list__item-end(v-html="param.value")
					.catalog-item__description.text-guide.flc(v-if="catalog.item.description" v-html="catalog.item.description")
</template>

<script>
import sourceMixin from 'components/mixins/v-mixin-source.vue';

export default {
	mixins: [
		sourceMixin
	],

	data() {
		return {
			catalog: null,
			state: {
				filter: null
			},
			changedFilters: null
		};
	},

	methods: {
		dataSet(data) {
			this.catalog = data;
		},

		createFilterValue() {
			if (this.catalog && this.catalog.filters) {
				let result = {};
				this.catalog.filters.forEach(filter => {
					result[filter.name] = filter.value;
				});
				return result;
			} else {
				return null;
			}
		},

		filterChanged() {
			this.requestDataLoad();
		},

		requestDataLoad(dataSetOptions) {
			this.dataLoad({
				url: this.catalog.remote,
				delay: true,
				data: {
					filter: this.createFilterValue()
				}
			}, dataSetOptions);
		}
	}
};
</script>