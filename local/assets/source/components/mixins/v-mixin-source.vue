<script>
export default {
	props: {
		// link to load data from (String)
		// or data object itself (Object)
		dataSource: {
			type: [Object, String],
			default: undefined
		},

		// Bitrix component id
		// required by Bitrix to determine component instance for AJAX requests
		// (dataSource link often simpty refers to page containing multiple components)
		bxajaxid: {
			type: String,
			default: undefined
		},

		// immediately load data on "created" hook
		// if dataSource is a link
		loadOnInit: {
			type: Boolean,
			default: true
		}
	},

	data() {
		return {
			// bxajaxid which is finally computed after processing props and slots
			localBxajaxid: null,

			// loading state
			loading: false
		};
	},

	computed: {
		componentName() {
			let path = this.$options.__file;
			if (path) {
				return path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
			}
			return null;
		}
	},

	watch: {
		dataSource() {
			// try to load using props
			this.init(this.bxajaxid, this.dataSource);
		}
	},

	created() {
		// try to load using props
		this.init(this.bxajaxid, this.dataSource);

		const readSlot = (item) => {
			const bxajaxid = item.props['bxajaxid'];
			const dataSource = item.props['data-source'];

			if (dataSource) {
				this.init(bxajaxid, dataSource);
			}
		};

		// try to load using slots
		if (this.$slots?.source) {
			this.$slots?.source().forEach((item) => {
				readSlot(item);
				item.children?.forEach(readSlot);
			});
		}
	},

	methods: {
		dataSet(data, options) {
			console.info(`${this.componentName}: warning: v-source-mixin is used but sourceSet is not implemented in your component`, data, options);
		},

		async dataLoad(options = {}, dataSetOptions) {
			// use this.loading to set preloaders if needed
			this.loading = true;

			// check arguments
			if (!options || typeof options !== 'object' || !options.url) {
				console.warn(`${this.componentName}: warning: dataLoad options arg is wrong`, options);
			}

			// convert any options.data to transfer as FormData
			let formattedData = new FormData();

			if (options.data instanceof FormData) {
				formattedData = options.data;
			} else if (options.data) {
				let makeFormData = (data, parentKey) => {
					if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
						Object.keys(data).forEach((key) => {
							makeFormData(data[key], parentKey ? `${parentKey}[${key}]` : key);
						});
					} else {
						formattedData.append(parentKey, data == null ? '' : data);
					}
				};

				makeFormData(options.data);
			}

			// set bxajaxid if present
			if (this.localBxajaxid) {
				formattedData.set('bxajaxid', this.localBxajaxid);
			}

			// set min delay to ensure preloader fadein/fadeout plays fine (<transition name="fade"> speed is 250ms)
			let delayPromise = new Promise((resolve) => {
				options.delay ? setTimeout(resolve, 250) : resolve();
			});

			try {
				// create request
				let requestPromise = fetch(options.url, {
					method: 'POST',
					/*headers: {
						//'Content-Type': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded',
					},*/
					body: formattedData
				});

				// wait for both promises
				let [response] = await Promise.all([requestPromise, delayPromise]);

				// handle response
				if (!response.ok) {
					console.warn(`${this.componentName}: AJAX request failed`, response);
				} else {
					let data = await response.json();
					console.log(`${this.componentName}: AJAX request completed`, data);
					this.dataSet(data, dataSetOptions);
				}
			} catch (e) {
				console.warn(`${this.componentName}: AJAX request failed`, e);
			}

			this.loading = false;
		},

		init(bxajaxid, dataSource) {
			if (typeof bxajaxid !== 'undefined') {
				this.localBxajaxid = bxajaxid;
			}

			if (typeof dataSource === 'string') {
				if (this.loadOnInit) {
					this.dataLoad({url: dataSource});
				}
			} else if (typeof dataSource !== 'undefined') {
				this.dataSet(dataSource);
			}
		}
	}
};
</script>