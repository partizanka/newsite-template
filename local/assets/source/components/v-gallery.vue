<template lang="pug">
.v-gallery.gallery
	v-loader(:loading="loading")

	button.gallery__close.js-close-modal(type="button")
		svg.svg-icon
			use(xlink:href="#svg-icon-close")

	template(v-if="gallery")
		.gallery__view(@touchstart="startTouchAction")
			button.gallery__arrow.gallery__arrow--prev.js-pause-button(
					type="button"
					@click="goTo(currentIndex-1)"
					:class="{'disabled': currentIndex == 0}")
				svg.svg-icon.gallery__arrow-icon
					use(xlink:href="#svg-icon-slide-left")

			button.gallery__arrow.gallery__arrow--next.js-pause-button(
					type="button"
					@click="goTo(currentIndex+1)"
					:class="{'disabled': currentIndex == gallery.items.length-1}")
				svg.svg-icon.gallery__arrow-icon
					use(xlink:href="#svg-icon-slide-right")

			.gallery__view-list(ref="view-list")
				.gallery__view-item(v-for="(item, index) in gallery.items" :key="index")
					a.gallery__view-item-wrapper(
							v-if="item.type === 'image'"
							ref="view-item-wrapper"
							:href="touchMode ? null : item.srcFull || item.src || item.poster"
							target="_blank"
							tabindex="-1"
							key="image")
						v-image(:src="item.src || item.srcFull || item.poster" alt="")
					.gallery__iframe-wrapper(
						v-else-if="item.type === 'iframe'"
						key="iframe")
						iframe(
								:src="item.src" 
								:key="index == currentIndex ? 1 : 2" 
								allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
								allowfullscreen)
					.gallery__video-wrapper(
						v-else-if="item.type === 'video'"
						key="video")
						v-video(
								:src="item.src"
								:poster="item.videoPoster || item.poster"
								:key="index == currentIndex ? 1 : 2")
					.gallery__view-item-note(v-if="item.note")
						.gallery__view-item-note-box(v-html="item.note")

		.gallery__previews
			.gallery__previews-container
				.gallery__previews-list
					a.gallery__previews-item(
							v-for="(item, index) in gallery.items"
							tabindex="0"
							@click="goTo(index)"
							@keyup.enter="goTo(index)"
							:class="{'active': index == currentIndex}"
							:style="{'background-image': 'url('+(item.poster || item.src || item.srcFull)+')'}")
</template>

<script>
import {nextTick} from 'vue';
import sourceMixin from 'components/mixins/v-mixin-source.vue';
import controller from 'scripts/controller/controller';

export default {
	mixins: [
		sourceMixin
	],

	props: {
		initialIndex: {
			type: Number,
			default: 0
		}
	},

	data() {
		return {
			remote: null,
			gallery: null,
			loading: false,
			loadingMinTimeout: null,
			touchMode: controller.touch,
			currentIndex: 0,
			resizeTimeout: null,
			setPositionQueue: false,
			setScaleQueue: false,
			touchActive: false,
			touchStartPoint: null,
			touchStartPoint2: null,
			touchIntentMinOffset: 0,
			touchIntent: 0,
			debug: null,
			dragOffset: 0,
			scaleActive: false,
			scaleRatio: 1,
			scaleRatioPrevious: 1,
			scaleOffset: {x: 0, y: 0},
			scaleOffsetPrevious: {x: 0, y: 0}
		};
	},

	watch: {
		gallery() {
			this.setPosition(true);
		}
	},

	created() {
		this.currentIndex = this.initialIndex;
		this.updateIntentOffset();
		window.addEventListener('resize', this.handleResize, controller.passiveEventsSupported ? {passive: true} : undefined);
		if (controller.touch) {
			document.addEventListener('touchend', this.stopTouchAction, controller.passiveEventsSupported ? {passive: true} : undefined);
			document.addEventListener('touchmove', this.handleTouchAction, controller.passiveEventsSupported ? {passive: true} : undefined);
		}
	},

	unmounted() {
		window.removeEventListener('resize', this.handleResize);
		if (controller.touch) {
			document.removeEventListener('touchend', this.stopTouchAction);
			document.addEventListener('touchmove', this.handleTouchAction);
		}
	},

	methods: {
		pauseVideo() {
			this.$refs.video.forEach((item) => {
				item.pauseVideo();
			});
		},

		goTo(index) {
			if (index != this.currentIndex) {
				this.currentIndex = Math.max(0, Math.min(this.gallery.items.length-1, index));
				this.scaleActive = false;
				this.scaleRatio = 1;
				this.scaleOffsetPrevious.x = 0;
				this.scaleOffsetPrevious.y = 0;
			}
			this.setPosition();
		},

		setPosition(silent) {
			// if list is not rendered yet
			if (!this.$refs['view-list']) {
				return;
			}

			cancelAnimationFrame(this.setPositionQueue);
			this.setPositionQueue = requestAnimationFrame(() => {
				if (silent) {
					this.$refs['view-list'].style.transition = '0s';
				}

				this.$refs['view-list'].style.transform =
					'translate3d(' + (-this.$refs['view-list'].offsetWidth * this.currentIndex + this.dragOffset) + 'px,0,0)';

				if (silent) {
					requestAnimationFrame(() => {
						this.$refs['view-list'].style.transition = '';
					});
				}
			});
		},

		setScale(silent) {
			// if list is not rendered yet
			if (!this.$refs['view-item-wrapper']) {
				return;
			}

			cancelAnimationFrame(this.setScaleQueue);
			this.setScaleQueue = requestAnimationFrame(() => {
				for (let i = 0; i < this.$refs['view-item-wrapper'].length; i++) {
					if (i != this.currentIndex) {
						this.$refs['view-item-wrapper'][i].style.transform = '';
					}
				}

				if (silent) {
					this.$refs['view-item-wrapper'][this.currentIndex].style.transition = '0s';
				}

				this.$refs['view-item-wrapper'][this.currentIndex].style.transform =
					this.scaleActive ? 'translate3d('+this.scaleOffset.x+'px,'+this.scaleOffset.y+'px,0) scale('+this.scaleRatio+')' : '';

				if (silent) {
					requestAnimationFrame(() => {
						this.$refs['view-item-wrapper'][this.currentIndex].style.transition = '';
					});
				}
			});
		},

		startTouchAction(e) {
			this.touchActive = true;
			this.touchStartPoint = {x: e.touches[0].pageX, y: e.touches[0].pageY};
			if (e.touches.length == 2) {
				this.scaleActive = true;
				this.touchStartPoint2 = {x: e.touches[1].pageX, y: e.touches[1].pageY};
			}
		},

		stopTouchAction(e) {
			// when last touch ended
			if (this.touchActive && !e.touches.length) {
				this.touchActive = false;
				this.dragOffset = 0;
				this.goTo(this.currentIndex + this.touchIntent);
			}

			if (this.scaleActive) {
				if (e.touches.length < 2) {
					this.touchActive = false;
					this.scaleRatio = Math.max(1, Math.min(2, this.scaleRatio));
					this.scaleActive = this.scaleRatio != 1;
					this.scaleRatioPrevious = this.scaleRatio;
				}

				if (this.scaleActive) {
					this.scaleOffsetPrevious.x = this.scaleOffset.x;
					this.scaleOffsetPrevious.y = this.scaleOffset.y;
				} else {
					this.scaleOffsetPrevious.x = 0;
					this.scaleOffsetPrevious.y = 0;
				}
			}

			this.setScale();
		},

		handleTouchAction(e) {
			if (this.touchActive) {
				// scale mode is active, scale != 1
				// scale or move active image
				if (this.scaleActive) {
					// multitouch - change scale
					if (e.touches.length > 1) {
						// scale (Pythagoras)
						let initialDistance = Math.sqrt(Math.pow(this.touchStartPoint.x - this.touchStartPoint2.x, 2) + Math.pow(this.touchStartPoint.y - this.touchStartPoint2.y, 2));
						let currentDistance = Math.sqrt(Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2) + Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2));
						this.scaleRatio = Math.max(0.9, Math.min(2.2, this.scaleRatioPrevious * currentDistance / initialDistance));

						// drag inside scaled slide
						this.scaleOffset.x = this.scaleOffsetPrevious.x + e.touches[0].pageX - this.touchStartPoint.x + (e.touches[1].pageX - this.touchStartPoint2.x) / 2;
						this.scaleOffset.y = this.scaleOffsetPrevious.y + e.touches[0].pageY - this.touchStartPoint.y + (e.touches[1].pageY - this.touchStartPoint2.y) / 2;
					} else {
						// non-multitouch - drag inside scaled slide
						this.debug = this.scaleOffsetPrevious;
						// drag inside scaled slide
						this.scaleOffset.x = this.scaleOffsetPrevious.x + e.touches[0].pageX - this.touchStartPoint.x;
						this.scaleOffset.y = this.scaleOffsetPrevious.y + e.touches[0].pageY - this.touchStartPoint.y;
					}

					this.dragOffset = 0;
					this.touchIntent = 0;
					this.setScale(true);
				} else {// else - drag slide list
					// multitouch drag - never works because of scaleActive but...
					if (e.touches.length > 1) {
						this.dragOffset = e.touches[0].pageX - this.touchStartPoint.x + (e.touches[1].pageX - this.touchStartPoint2.x) / 2;
					} else {
						// non-multitouch drag
						this.dragOffset = e.touches[0].pageX - this.touchStartPoint.x;
					}

					// rubber effect at the ends
					if (this.currentIndex == 0 && this.dragOffset > 0 || this.currentIndex == this.gallery.items.length-1 && this.dragOffset < 0) {
						this.dragOffset = Math.sign(this.dragOffset) * Math.pow(Math.abs(this.dragOffset), .75);
					}

					this.setPosition(true);

					// determine intended swipe direction
					if (this.dragOffset >= this.touchIntentMinOffset) {
						this.touchIntent = -1;
					} else if (this.dragOffset <= -this.touchIntentMinOffset) {
						this.touchIntent = 1;
					} else {
						this.touchIntent = 0;
					}
				}
			}
		},

		updateIntentOffset() {
			// min drag offset to consider it as slide
			// is 25% of gallery width but inbetween 50 and 200
			this.touchIntentMinOffset = Math.min(200, Math.max(50, (this.$refs['view-list'] || document.body).offsetWidth * 0.25));
		},

		dataSet(data) {
			this.gallery = data;
			nextTick(() => {
				this.setPosition(true);
			});
		},

		handleResize() {
			if (!this.resizeTimeout) {
				this.resizeTimeout = setTimeout(() => {
					this.updateIntentOffset();
					this.setPosition(true);
					this.resizeTimeout = null;
				}, 100);
			}
		}
	}
};
</script>