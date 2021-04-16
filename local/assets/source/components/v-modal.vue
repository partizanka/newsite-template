<template lang="pug">
.modal(:class="topModal ? topModal.className : ''")
	.modal__surface(@click="overlayClick")
		component.modal__container(
			:is="modal.content ? 'v-lazy-component' : 'div'"
			v-for="(modal, index) in modals"
			v-show="index === modals.length - 1"
			:key="modal.key")
			.modal__content-slot(
					v-if="modal.content"
					v-html="modal.content"
					key="modal-content")
			.modal__content-slot(
					v-else=""
					key="no-modal-content")
				v-modal-window
					component(:is="modal.component.name" v-bind="modal.component.props")
</template>

<script>
import controller from 'scripts/controller/controller';

export default {
	data() {
		return {
			modals: [],
			loading: null,
			closeTimeout: null,
			historyEventIsHashChange: false,
			historyEventIsManual: false
		};
	},

	computed: {
		topModal() {
			return this.modals.length ? this.modals[this.modals.length - 1] : null;
		}
	},

	created() {
		window.modalController = this;

		let matches = (el, selector) => {
			try {
				return (el.matches || el.matchesSelector || el.msMatchesSelector).call(el, selector);
			} catch (e) {
				return false;
			}
		};

		let closestMatch = (el, selectors) => {
			while (el) {
				for (let i = 0; i < selectors.length; i++) {
					if (matches(el, selectors[i])) {
						return {el: el, selector: selectors[i]};
					}
				}
				el = el.parentNode;
			}
			return null;
		};

		let openModal = (element) => {
			let modalURL = element.el.getAttribute('data-modal-url');
			let modalData;

			try {
				modalData = JSON.parse(element.el.getAttribute('data-modal-data'));
			} catch (e) {
				modalData = null;
				if (!modalURL) {
					console.warn('v-modal: wrong modalData on .js-open-modal', e);
				}
			}

			if (modalData || modalURL) {
				let options = modalData || {};
				if (modalURL) {
					options.url = modalURL;
				}
				this.open(options);
			}
		};

		// event delegation
		document.addEventListener('click', (e) => {
			let button = closestMatch(e.target, [
				'.js-replace-modal',
				'.js-open-modal',
				'.js-close-modal',
				'.js-open-modal-gallery'
			]);

			if (!button) {
				return;
			}

			if (button.selector === '.js-replace-modal') {
				this.close().then(() => {
					openModal(button);
				});
			} else if (button.selector === '.js-open-modal') {
				openModal(button);
			} else if (button.selector === '.js-close-modal') {
				this.close();
			} else if (button.selector === '.js-open-modal-gallery') {
				let dataSource = button.el.dataset.gallery;
				let initialIndex = parseInt(button.el.dataset.initialIndex) || 0;

				this.open({
					className: 'modal--gallery',
					content: `<v-gallery :data-source='${(dataSource ? JSON.stringify(dataSource) : null)}' :initial-index="${initialIndex}"></v-gallery>`
				});
			}
		});

		document.addEventListener('keyup', this.handleEsc);
		window.addEventListener('popstate', this.handlePopState);
		window.addEventListener('hashchange', this.handleHashChange);
	},

	unmounted() {
		document.body.classList.remove('state--modal-open');
		document.removeEventListener('keyup', this.handleEsc);
		window.removeEventListener('popstate', this.handlePopState);
		window.removeEventListener('hashchange', this.handleHashChange);
	},

	methods: {
		async open(options = {}) {
			// load modal by URL
			if (options.url) {
				const response = await fetch(options.url, {
					method: 'POST',
					headers: {
						'Content-Type': 'text/plain;charset=UTF-8'
					}
				});
				options.content = await response.text();
			}

			if (this.closeTimeout) {
				clearTimeout(this.closeTimeout);
				this.closeTimeout = null;
				this.modals.pop();
			}
			options.key = Math.random() + '-' + (new Date()).getMilliseconds();
			this.modals.push(options);
			window.history.pushState({component: 'v-modal'}, '', options.historyUrl || window.location.href);
			document.body.classList.add('state--modal-open');
			controller.lockScrolling();
		},

		async close(options = {}) {
			return new Promise((resolve) => {
				if (this.modals.length > 1) {
					this.modals.pop();
					if (!options.fromHistory) {
						this.historyEventIsManual = true;
						window.history.back();
					}
					resolve();
				} else {
					if (this.modals.length <= 1 && (!options || !options.replace)) {
						document.body.classList.remove('state--modal-open');
					}
					// if modal is the last add 250ms delay to prevent jump to small-white-brick-empty-modal and let transition play
					this.closeTimeout = setTimeout(() => {
						if (this.modals.length <= 1 && (!options || !options.replace)) {
							controller.unlockScrolling();
						}
						this.modals.pop();
						if (!options.fromHistory) {
							this.historyEventIsManual = true;
							window.history.back();
						}
						resolve();
					}, 250);
				}
			});
		},

		async closeAll() {
			while (this.modals.length > 0) {
				await this.close();
			}
		},

		overlayClick(e) {
			let $target = e.target;
			if (!$target.closest('.modal__content-slot') && $target.closest('body')) {
				this.close();
			}
		},

		handlePopState(e) {
			if (this.historyEventIsHashChange) {
				this.historyEventIsHashChange = false;
				return;
			}
			if (this.historyEventIsManual) {
				this.historyEventIsManual = false;
				return;
			}
			console.log('v-modal: pop state', e.state);
			if (this.topModal) {
				this.close({fromHistory: true});
			}
		},

		handleHashChange() {
			this.historyEventIsHashChange = true;
		}
	}
};
</script>
