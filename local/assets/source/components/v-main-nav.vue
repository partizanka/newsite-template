<template lang="pug">
nav.v-main-nav.main-nav
	.container
		ul.main-nav__layout
			template(v-for="group in menu")
				li.main-nav__cell(v-for="item in group.items")
					a.main-nav__link(
							:href="item.link"
							tabindex="0"
							:class="{'main-nav__link--open': openMenuId === item.menuId}"
							@mouseenter="mouseenter(item)"
							@mouseleave="mouseleave(item)"
							@mousemove="mousemove(item)"
							@click="itemClick(item, $event)")
						svg.svg-icon.main-nav__link-icon(v-if="item.icon")
							use(:xlink:href="item.icon")
						.main-nav__link-main(v-if="item.text") {{item.text}}

					.main-nav__dd(
							v-if="item.items && item.items.length"
							:class="{'main-nav__dd--open': openMenuId === item.menuId}"
							@mouseenter="mouseenter(item)"
							@mouseleave="mouseleave(item)")
						.container.main-nav__dd-container
							.main-nav__dd-grid
								.main-nav__dd-cell(v-for="itemL2 in item.items")
									.main-nav__dd-list
										.main-nav__dd-list-head.flc
											a.main-nav__dd-list-head-link.h5(:href="itemL2.link" :class="{'main-nav__dd-list-head-link--link': itemL2.link}") {{itemL2.text}}
										.main-nav__dd-list-body.flc
											.main-nav__dd-list-item(v-for="itemL3 in itemL2.items")
												a.main-nav__dd-list-link(:href="itemL3.link") {{itemL3.text}}
</template>

<script>
import sourceMixin from 'components/mixins/v-mixin-source.vue';
import controller from 'scripts/controller/controller';

export default {
	mixins: [
		sourceMixin
	],

	data() {
		return {
			menu: [],
			openMenuId: null,
			openTimeout: null,
			closeTimeout: null,
			touch: controller.touch
		};
	},

	created() {
		document.addEventListener('click', this.handleClickOutside);
		document.addEventListener('keydown', this.handleEsc);
	},

	unmounted() {
		document.removeEventListener('click', this.handleClickOutside);
		document.removeEventListener('keydown', this.handleEsc);
	},

	methods: {
		dataSet(data) {
			this.menu.push(data);
			this.menu.sort((groupA) => groupA.type && groupA.type === 'catalog' ? -1 : 1);

			this.menu.forEach((group, groupIndex) => {
				group.items.forEach((item, itemIndex) => {
					item.menuId = groupIndex + '-' + itemIndex;
				});
			});

			controller.updateMobileNav(data);
		},

		mouseenter(item) {
			if (this.touch) {
				return;
			}

			if (this.openMenuId === item.menuId) {
				clearTimeout(this.closeTimeout);
			}
		},

		mouseleave() {
			if (this.touch) {
				return;
			}

			clearTimeout(this.openTimeout);
			this.closeTimeout = setTimeout(() => {
				this.openMenuId = null;
			}, 300);
		},

		mousemove(item) {
			if (this.touch) {
				return;
			}

			clearTimeout(this.openTimeout);
			if (item.items && item.items.length) {
				this.openTimeout = setTimeout(() => {
					clearTimeout(this.closeTimeout);
					this.openMenuId = item.menuId;
				}, 40);
			}
		},

		itemClick(item, e) {
			if (!this.touch) {
				return;
			}

			if (this.openMenuId !== item.menuId && item.items && item.items.length) {
				e.preventDefault();
				this.openMenuId = item.menuId;
			} else {
				this.openMenuId = null;
			}
		},

		handleClickOutside(e) {
			if (!this.$el.contains(e.target)) {
				this.openMenuId = null;
			}
		},

		handleEsc(e) {
			if (e.keyCode == 27 && this.openMenuId) {
				e.stopPropagation();
				this.openMenuId = null;
			}
		}
	}
};
</script>