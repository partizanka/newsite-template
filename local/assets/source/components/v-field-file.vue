<template lang="pug">
.v-field-file.field-file

	transition(name="fade")
		transition-group.field-file__list.flc(tag="div" name="content-fade" v-if="localFiles.length")
			.field-file__item(v-for="file in localFiles" :key="file.key")
				.field-file__item-start {{file.name}}
				.field-file__item-end
					button.field-file__item-remove.link(type="button" @click="remove(file)") Удалить

	.field-file__main
		.field-file__cell-input
			.field-file__input-block
				label.field-label(v-if="field.label" :for="uniqueId") {{field.label}}
				input.field-file__input(:id="uniqueId" type="file" @change="fileInput" :key="rerenderKey" ref="input")
				button.field-file__btn.btn(type="button" @click="$refs['input'].click()" @keydown.enter="$refs['input'].click()") Добавить файл

		.field-file__cell-note(v-if="note")
			.field-file__note {{note}}
</template>

<script>
import uniqueId from 'scripts/helpers/uniqueId';

export default {
	props: {
		note: {
			type: String,
			default: null
		},

		field: {
			type: Object,
			default: null
		}
	},
	
	emits: [
		'fileinput',
		'fileremove'
	],

	data() {
		return {
			localValue: null,
			localFiles: [],
			rerenderKey: 0,
			uniqueId: uniqueId('field-')
		};
	},

	watch: {
		value() {
			this.initLocalValueFromValue();
		}
	},

	created() {
		this.initLocalValueFromValue(true);
	},

	methods: {
		getKey() {
			return Date.now().toString() + Math.round(Math.random() * 100000);
		},

		fileInput(e) {
			let newKey = this.getKey();

			if (!this.field.multiple) {
				this.localFiles.forEach(this.remove);
			}

			// always 1 file per event! (no multiple <input>)
			if (e.target.files) {
				console.log('file input', e.target.files, e.target.files[0]);
				for (let i = 0; i < e.target.files.length; i++) {
					this.localFiles.push({
						name: e.target.files[i].name,
						size: e.target.files[i].size,
						key: newKey
					});
				}

				e.key = newKey;
				this.$emit('fileinput', e);
			}

			this.rerenderKey = this.getKey();
		},

		remove(file) {
			this.localFiles.splice(this.localFiles.indexOf(file), 1);
			this.$emit('fileremove', file);
		},

		initLocalValueFromValue(initial) {
			if (this.field.files && initial) {
				this.localFiles = [];

				this.field.files.forEach((file) => {
					let newKey = this.getKey();

					this.localFiles.push({
						name: file.name,
						size: file.size,
						key: newKey
					});

					this.$emit('fileinput', {
						key: newKey,
						target: {files: [file]}
					});
				});
			}
		}
	}
};
</script>
