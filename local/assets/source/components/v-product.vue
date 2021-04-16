<template lang="pug">
.v-product.product

	template(v-if="template === 'grid'")
		.product-t-grid
			a.product-t-grid__link(v-if="product.link" :href="product.link" @click="openDetails" :aria-label="product.name")
			.product-t-grid__card
				.product-t-grid__top
					.product-t-grid__visual.flc
						v-product-image.product-t-grid__image(:src="product.image" :sources="product.imageSources")
						.product-t-grid__status(v-if="product.status && product.status.length")
							v-status(:status="product.status")

					.product-t-grid__name.flc(v-if="product.name") {{product.name}}
					.product-t-grid__avail.flc(v-if="product.availability")
						v-availability(:availability="product.availability")
				.product-t-grid__bottom
					.product-t-grid__price.flc(v-if="product.price")
						v-price(:price="product.price")
					.product-t-grid__action.flc
						v-basket-action(:id="product.id")


	template(v-if="template === 'list'")
		.product-t-list
			a.product-t-list__link(v-if="product.link" :href="product.link" @click="openDetails")
			.product-t-list__card
				.product-t-list__cell-visual
					.product-t-list__visual.flc
						v-product-image.product-t-list__image(:src="product.image" :sources="product.imageSources")
						.product-t-list__status(v-if="product.status && product.status.length")
							v-status(:status="product.status")

				.product-t-list__cell-info
					.product-t-list__name.flc(v-if="product.name") {{product.name}}
					.product-t-list__avail.flc(v-if="product.availability")
						v-availability(:availability="product.availability")
				.product-t-list__cell-price-action
					.product-t-list__cell-price
						.product-t-list__price.flc(v-if="product.price")
							v-price(:price="product.price")
					.product-t-list__cell-action
						.product-t-list__action.flc
							v-basket-action(:id="product.id")
</template>

<script>
import controller from '../scripts/controller/controller';
export default {
	props: {
		product: {
			type: Object,
			default: null
		},

		template: {
			type: String,
			default: 'grid'
		},

		quickView: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		openDetails(e) {
			if (this.quickView) {
				e.preventDefault();

				controller.openModal({
					className: 'modal--page',
					historyUrl: this.product.link,
					component: {
						name: 'v-catalog-item',
						props: {
							dataSource: this.product.quickViewLink
						}
					}
				});
			}
		}
	}
};
</script>