<template lang="pug">
nav.v-top-nav.top-nav
	.container
		.top-nav__layout
			template(v-for="group in menu")
				.top-nav__spacer(v-if="group.type == 'user'" key="spacer")
				.top-nav__cell(v-for="item in group.items")
					a.top-nav-link(:href="item.link"
							:data-modal-url="item.modalLink"
							:data-modal-data="item.modalData"
							:class="{'js-open-modal': item.modalLink || item.modalData}"
							@mouseenter="mouseenter(item)"
							@mouseleave="mouseleave(item)"
							@mousemove="mousemove(item)"
							@click="itemClick(item, $event)")
						svg.svg-icon.top-nav-link__icon(v-if="item.icon")
							use(:xlink:href="item.icon")
						.top-nav-link__main(v-if="item.text") {{item.text}}
					.top-nav__dd(
							v-if="item.items && item.items.length"
							:class="{'top-nav__dd--open': openMenuId === item.menuId}"
							@mouseenter="mouseenter(item)"
							@mouseleave="mouseleave(item)")
						ul.top-nav__dd-list
							li.top-nav__dd-item.flc(v-for="itemL2 in item.items")
								a.top-nav__dd-link(:href="itemL2.link") {{itemL2.text}}
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
			this.menu.sort((groupA) => groupA.type && groupA.type === 'user' ? 1 : -1);
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
