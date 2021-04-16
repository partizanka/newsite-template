<template lang="pug">
video.v-video.video(controls :poster="poster")
	source.video__source(:src="src" :type="type")
</template>

<script>
export default {
	props: {
		src: {
			type: String,
			default: null
		},

		poster: {
			type: String,
			default: null
		},

		type: {
			type: String,
			default: 'video/mp4'
		}
	},

	methods: {
		pauseVideo() {
			this.$el.pause();
		}
	}
};
</script>