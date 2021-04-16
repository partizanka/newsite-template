<template lang="pug">
.modal-window(role="dialog" :aria-labelledby="uniqueId")
	.modal-window__header
		.h2(v-if="title" :id="uniqueId") {{title}}
		button.modal-window__close.js-close-modal(type="button" aria-label="Закрыть")
			svg.svg-icon.modal-window__close-icon
				use(xlink:href='#svg-icon-close')
	.modal-window__body
		slot
</template>

<script>
import uniqueId from 'scripts/helpers/uniqueId';

export default {
	props: {
		title: {
			type: String,
			default: ''
		}
	},
	
	data() {
		return {
			uniqueId: uniqueId('modal-'),
			active: true
		};
	}
};
</script>