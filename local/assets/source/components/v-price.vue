<template lang="pug">
.v-price.price(:class="'price--' + size")
	template(v-if="price")
		.price__group.price__group--old(v-if="price.old")
			span.price__prefix(v-if="price.old.prefix") {{price.old.prefix}}&nbsp;
			span.price__value(v-if="price.old.value") {{formatPrice(price.old.value)}}&nbsp;
			span.price__currency(v-if="price.old.currency") {{price.old.currency}}
			span.price__unit(v-if="price.old.unit") &nbsp;{{price.old.unit}}
		.price__group(v-if="price.current" :class="{'price__group--new': price.old}")
			span.price__prefix(v-if="price.current.prefix") {{price.current.prefix}}&nbsp;
			span.price__value(v-if="price.current.value") {{formatPrice(price.current.value)}}&nbsp;
			span.price__currency(v-if="price.current.currency") {{price.current.currency}}
			span.price__unit(v-if="price.current.unit") &nbsp;{{price.current.unit}}
</template>

<script>
import formattingMixin from 'components/mixins/v-mixin-formatting.vue';

export default {
	mixins: [
		formattingMixin
	],

	props: {
		price: {
			type: Object,
			default: null
		},

		size: {
			type: String,
			default: 'md'
		}
	}
};
</script>
