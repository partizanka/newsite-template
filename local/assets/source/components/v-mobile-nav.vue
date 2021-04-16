<template lang="pug">
nav.v-mobile-nav.mobile-nav
	ul.mobile-nav__panels(v-if="flatMenu && flatMenu.length")
		li.panel(v-for="panel in flatMenu" :class="{'panel--open': isPanelOpen(panel)}")
			.panel__head.panel-head
				button.panel-head__btn.panel-head__btn--back(type="button" @click="back" v-if="panel.parentId !== '0'")
					svg.svg-icon.panel-head__btn-icon
						use(xlink:href="#svg-icon-back")
				.panel-head__title {{panel.parentText}}
				button.panel-head__btn.panel-head__btn--close(type="button" @click="close")
					svg.svg-icon.panel-head__btn-icon
						use(xlink:href="#svg-icon-close")
			ul.panel__body
				li.panel__item(v-for="item in panel.items")
					a.panel__btn(
							:href="item.link"
							:data-modal-url="item.modalLink"
							:data-modal-data="item.modalData"
							:class="{'js-open-modal': item.modalLink || item.modalData}"
							tabindex="0"
							@click="itemClick(item, $event)")
						svg.svg-icon.panel__btn-icon(v-if="item.icon")
							use(:xlink:href="item.icon")
						.panel__btn-main(v-if="item.text") {{item.text}}
						svg.svg-icon.panel__btn-arrow(v-if="item.hasItems")
							use(xlink:href="#svg-icon-chevron-right-sm")
</template>

<script>
import breakpoints from 'scripts/breakpoints';
import controller from 'scripts/controller/controller';

export default {
	data() {
		return {
			menu: [],
			openPanels: [],
			openTimeout: null,
			closeTimeout: null,
			touch: controller.touch,
			flatMenu: null
		};
	},

	created() {
		this.dataSet(controller.mobileNavData);
		controller.events.on('mobile-nav-updated', this.dataSet);
		controller.events.on('mobile-nav-open', this.open);
		controller.events.on('mobile-nav-close', this.close);
		window.addEventListener('resize', this.handleResize);
		document.addEventListener('keydown', this.handleEsc);
	},

	unmounted() {
		window.removeEventListener('resize', this.handleResize);
		document.removeEventListener('keydown', this.handleEsc);
	},

	methods: {
		updateFlatMenu() {
			let result = [];
			if (this.menu) {
				let firstPanel = {
					text: 'Меню',
					itemId: '0',
					items: this.menu.reduce((acc, group) => group.items ? acc.concat(group.items) : acc, [])
				};
				let flattenMenuRecursive = (parentItem) => {
					if (parentItem.items && parentItem.items.length) {
						let panel = {
							parentId: parentItem.itemId,
							parentText: parentItem.text,
							items: []
						};
						parentItem.items.forEach((item, itemIndex) => {
							item.itemId = parentItem.itemId + '-' + itemIndex;
							panel.items.push({...item, menuId: null, items: null, hasItems: !!item.items && !!item.items.length});
							flattenMenuRecursive(item);
						});
						result.push(panel);
					}
				};
				flattenMenuRecursive(firstPanel);
				result.reverse();
			}
			this.flatMenu = result;
		},

		dataSet(data) {
			this.menu = data;
			if (this.menu) {
				this.menu.sort((groupA, groupB) => {
					const order = {
						'catalog': -1,
						'menu': 2,
						'top-menu': 3,
						'user': 4
					};
					return (order[groupA.type] || 0) - (order[groupB.type] || 0);
				});
			}
			this.updateFlatMenu();
		},

		open() {
			document.body.classList.add('state--mobile-nav-open');
			this.openPanels = ['0'];
		},

		close() {
			document.body.classList.remove('state--mobile-nav-open');
			this.openPanels = [];
		},

		back() {
			this.openPanels.pop();
			if (!this.openPanels.length) {
				this.close();
			}
		},

		isPanelOpen(panel) {
			return this.openPanels.indexOf(panel.parentId) >= 0;
		},

		itemClick(item, e) {
			if (item.hasItems) {
				e.preventDefault();
				this.openPanels.push(item.itemId);
			}
		},

		handleResize() {
			if (window.innerWidth >= breakpoints['sm-max'] && this.openPanels && this.openPanels.length) {
				this.close();
			}
		},

		handleEsc(e) {
			if (e.keyCode == 27 && this.openPanels.length) {
				e.stopPropagation();
				this.close();
			}
		}
	}
};
</script>