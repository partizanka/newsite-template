<template lang="pug">
.v-lazy-component.lazy-component
	component(v-if="lazyComponent" :is="lazyComponent")
	.lazy-component__template(v-if="!lazyComponent" ref="lazy-template")
		slot
</template>

<script>
import {getCurrentInstance} from 'vue';
import uniqueId from 'scripts/helpers/uniqueId';

export default {
	data() {
		return {
			lazyComponent: null
		};
	},

	mounted() {
		try {
			let componentName = uniqueId('lazy-');
			getCurrentInstance().appContext.app.component(componentName, {
				template: this.$refs['lazy-template'].innerHTML
			});
			this.lazyComponent = componentName;
		} catch (error) {
			console.warn('v-lazy-component: child component initialization error', error);
		}
	},

	beforeUnmount() {
		delete getCurrentInstance().appContext.components[this.lazyComponent];
		this.$forceUpdate();
	}
};
</script>