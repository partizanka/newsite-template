<template lang="pug">
.v-catalog.catalog
	v-loader(:loading="loading")
	.container
		template(v-if="!catalog")
			.catalog__placeholder

		template(v-if="catalog")
			.catalog__layout
				.catalog__layout-aside
					button.catalog__aside-close(type="button" @click="closeAside")
						svg.svg-icon.catalog__aside-close-icon
							use(xlink:href="#svg-icon-close")
					.catalog__layout-aside-container
						.catalog__layout-aside-container-inner
							.catalog__filter.flc(v-if="catalog.links || catalog.filters")
								v-filter(ref="filter"
										:filters="catalog.filters"
										:links="catalog.links"
										@filter-changed="filterChanged"
										@filter-updated="filterUpdated" 
										@request-reset="resetFilter" 
										@request-reset-all="resetAllFilters")
									template(#sort="" v-if="catalog.sort")
										v-field(:field="{type: 'select', options: catalog.sort.options}" v-model="state.sort" @update:model-value="requestDataLoad")
									template(#view="" v-if="catalog.view")
										v-field(:field="{type: 'view-picker', options: catalog.view.options}" v-model="state.view")
				.catalog__layout-main
					.catalog__top-nav.flc(v-if="catalog.sort || catalog.view && catalog.view.options && catalog.view.options.length")
						.catalog__top-nav-grid
							.catalog__top-nav-cell.catalog__top-nav-cell--active-filters(v-if="changedFilters && changedFilters.length")
								v-filter-active-items(
										:filters="changedFilters"
										@reset-filter="resetFilter")
							.catalog__top-nav-cell.catalog__top-nav-cell--aside-toggle(v-if="catalog.filters || catalog.links")
								button.catalog__aside-toggle(type="button" @click="openAside")
									svg.svg-icon.catalog__aside-toggle-icon
										use(xlink:href="#svg-icon-placeholder")
							.catalog__top-nav-cell.catalog__top-nav-cell--select(v-if="catalog.sort")
								v-field(
										:field="{type: 'select', options: catalog.sort.options}"
										v-model="state.sort"
										@update:model-value="requestDataLoad")
							.catalog__top-nav-cell.catalog__top-nav-cell--view(v-if="catalog.view")
								v-field(
										:field="{type: 'view-picker', options: catalog.view.options}"
										v-model="state.view")
					.catalog__list.flc
						transition(name="fade" mode="out-in")
							.catalog__list-message.flc(v-if="!catalog.items || !catalog.items.length" key="no-items")
								.catalog__list-message-title.h3.flc Ничего не найдено
								.catalog__list-message-body.flc Попробуйте изменить параметры поиска или перейдите на главную страницу.
								.catalog__list-message-actions.flc
									.catalog__list-message-actions-grid
										.catalog__list-message-action(v-if="changedFilters && changedFilters.length")
											button.btn(type="button" @click="resetAllFilters") Очистить фильтр
										.catalog__list-message-action
											a.btn(href="/") На главную страницу
							v-product-grid(
									v-else-if="state.view == 'grid' && catalog.type == 'products'"
									:items="catalog.items"
									quick-view
									key="catalog-type-products-grid")
							v-product-list(
									v-else-if="state.view == 'list' && catalog.type == 'products'"
									:items="catalog.items"
									quick-view
									key="catalog-type-products-list")
							v-article-grid(
									v-else-if="catalog.type == 'articles'"
									:items="catalog.items"
									key="catalog-type-articles")
					.catalog__nav.flc
						v-page-nav(:page="catalog.page" @navigate="navigate")
</template>

<script>
import controller from 'scripts/controller/controller';
import sourceMixin from 'components/mixins/v-mixin-source.vue';

export default {
	mixins: [
		sourceMixin
	],

	data() {
		return {
			catalog: null,
			state: {
				page: null,
				sort: null,
				view: null,
				filter: null
			},
			changedFilters: null,
			asideOpen: false
		};
	},

	methods: {
		dataSet(data, options = {}) {
			if (options.append && this.catalog && this.catalog.items) {
				let oldItems = this.catalog.items;
				this.catalog = data;
				this.catalog.items = oldItems.concat(this.catalog.items);
			} else {
				this.catalog = data;
			}

			this.state.sort = this.catalog.sort ? this.catalog.sort.value : null;
			this.state.page = this.catalog.page;
			this.state.view = this.state.view || this.catalog.view && this.catalog.view.value || 'grid';
		},

		navigate(page) {
			this.state.page.offset = page.offset;
			this.state.page.limit = page.limit;
			this.requestDataLoad({append: page.append});
		},

		filterUpdated(filterValue, changedFilters) {
			this.state.filter = filterValue;
			this.changedFilters = changedFilters;

			// update url except markup pages
			if (window.location.pathname.indexOf('/local/') < 0) {
				window.history.replaceState(null, null, this.catalog.remote);
			}
		},

		filterChanged(filterValue) {
			this.state.filter = filterValue;
			this.requestDataLoad();
		},

		requestDataLoad(dataSetOptions) {
			this.dataLoad({
				url: this.catalog.remote,
				delay: true,
				data: {
					page: this.state.page,
					sort: this.state.sort,
					filter: this.state.filter
				}
			}, dataSetOptions);
		},

		openAside() {
			controller.openCatalogAside();
		},

		closeAside() {
			controller.closeCatalogAside();
		},
		
		resetFilter(e) {
			this.$refs.filter.resetFilter(e);
		},
		
		resetAllFilters(e) {
			this.$refs.filter.resetAll(e);
		}
	}
};
</script>