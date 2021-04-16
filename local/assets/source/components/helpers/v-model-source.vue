<script>
import sourceMixin from '../../components/mixins/v-mixin-source.vue';

export default {
	mixins: [
		sourceMixin
	],

	data() {
		return {
			catalog: null
		};
	},

	methods: {
		dataSet(data) {
			if (data.type === 'basket') {
				this.$store.commit('basket/set', data);
			}

			if (data.type === 'favorite') {
				this.$store.commit('favorite/set', data);
			}

			if (data.type === 'user') {
				this.$store.commit('user/set', data);
			}
		}
	},

	render() {
		return '';
	}
};
</script>