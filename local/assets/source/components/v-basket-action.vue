<template lang="pug">
.v-basket-action.basket-action(:class="{'basket-action--active': basketCountByItem, 'basket-action--disabled': disabled}")
	.basket-action__widget
		.basket-action__cell-input
			v-field(v-model="localCount" :field="{type: 'count', min: 0}" @update:model-value="handleInput")
		.basket-action__cell-main
			button.basket-action__btn.btn.btn--primary(
				type="button"
				:disabled="disabled"
				@click="setBasketCount"
				aria-label="Добавить в корзину")
				svg.svg-icon.basket-action__btn-icon
					use(xlink:href="#svg-icon-basket")
</template>

<script>
export default {
	props: {
		id: {
			type: [String, Number],
			default: null
		},

		disabled: {
			type: Boolean,
			default: false
		}
	},
	
	data() {
		return {
			localCount: 0
		};
	},

	computed: {
		basketCountByItem() {
			return this.$store.getters['basket/basketCountByItem'](this.id);
		}
	},

	watch: {
		basketCountByItem() {
			this.localCount = this.basketCountByItem;
		}
	},

	created() {
		this.localCount = this.basketCountByItem;
	},

	methods: {
		handleInput(value) {
			this.localCount = value;
		},

		setBasketCount() {
			this.$store.dispatch('basket/add', {
				id: this.id,
				count: this.localCount
			});
		}
	}
};
</script>