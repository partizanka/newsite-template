<template lang="pug">
form.v-subscription-form.subscription-form(@submit.prevent="submit" novalidate autocomplete="off")
	v-loader(:loading="loading")
	template(v-if="form")
		.subscription-form__field(v-for="field in form.fields")
			v-field(:field="field" v-model="field.value")
			.subscription-form__success-message.flc(v-if="form && form.success && form.message" v-html="form.message")
		button.subscription-form__btn.btn.btn--primary(type="submit" aria-label="Отправить") 🡢
</template>

<script>
import sourceMixin from 'components/mixins/v-mixin-source.vue';

export default {
	mixins: [
		sourceMixin
	],

	props: {
		mode: {
			type: String,
			default: null
		}
	},

	data() {
		return {
			form: null
		};
	},

	methods: {
		dataSet(data) {
			this.form = data;
		},

		submit() {
			console.log('submit');
		}
	}
};
</script>