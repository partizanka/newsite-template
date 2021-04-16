<template lang="pug">
form.v-form.form(@submit.prevent="submit" :class="{'form--card': mode === 'card'}" novalidate autocomplete="off")
	v-loader(:loading="loading")

	template(v-if="form")
		.form__header.flc.fcc(v-if="form.title || form.note")
			h2.form__header-title.flc(v-if="form.title") {{form.title}}
			.form__header-note.flc(v-if="form.note" v-html="form.note")

		.form__main.flc.fcc
			.form__groups
				.form__group(v-for="group in form.groups" :style="{width: group.width || null}" :key="group.id")
					h3.form__group-title.flc(v-if="group.title") {{group.title}}
					.form__group-note.flc(v-if="group.note" v-html="group.note")
					.form__group-body.flc
						.form__fields
							template(v-for="(field, index) in form.fields")
								template(v-if="field.groupId === group.id")
									.form__field.form__field--spacer(
											v-if="field.type === 'spacer'"
											:style="{width: field.width || null}"
											key="spacer")
									.form__field(v-else="" :style="{width: field.width || null}" :key="field.id")
										v-field(
												:field="field"
												v-model="field.value"
												@fileinput="fileInput(field, $event)"
												@fileremove="fileRemove(field, $event)"
												@remove="valueRemove(field, $event)"
												@update:model-value="fieldChanged(field, $event)")

		.form__footer.flc(v-if="form.buttons && form.buttons.length")
			.form__actions
				.form__action(v-for="(button, index) in form.buttons" :key="index")
					button(
							:type="button.type || 'submit'"
							:class="button.className || 'btn btn--primary'"
							:data-modal-url="button.modalUrl"
							:data-modal-data="button.modalData")
						| {{button.text}}
</template>

<script>
import sourceMixin from 'components/mixins/v-mixin-source.vue';

export default {
	mixins: [
		sourceMixin
	],

	props: {
		mode: {
			type: String,
			default: null
		}
	},

	data() {
		return {
			form: null,
			localFormData: new FormData()
		};
	},

	methods: {
		proxyFieldName(name) {
			return `state[form][${name}]`;
		},

		dataSet(data) {
			this.form = data;
		},

		submit(options = {}) {
			let namesOfCurrentIteration = [];
			if (this.form && this.form.fields) {

				this.form.fields.forEach(field => {
					let key = this.proxyFieldName(field.name);

					if (field.multiple) {
						key = this.proxyFieldName(field.name.replace('[]', '')) + '[]';
					}

					if (!field.value) {
						field.value = '';
					}

					if (field.type === 'file') {
						// обработка файлов происходит в fileInput / fileRemove
						// здесь ничего делать не нужно
						/*
						 _.each(field.value, (fileListItem) => {
						 this.localFormData.append(field.name, fileListItem.file, fileListItem.name)
						 });
						 */
					} else {
						// для отправки файлов придется держать в памяти неизменный localFormData
						// перед отправкой нужно удалить старые значения из localFormData
						// т.к. localFormData.append добавляет новые значения к существующим
						// а localFormData.set не позволила бы работать с массивами типа NAME[]
						if (namesOfCurrentIteration.indexOf(key) < 0) {
							this.localFormData.delete(key);
							namesOfCurrentIteration.push(key);
						}

						if (Array.isArray(field.value)) {
							field.value.forEach(val => {
								this.localFormData.append(key, val);
							});
						} else {
							this.localFormData.append(key, field.value);
						}
					}
				});
			}

			this.localFormData.set('state[action]', options.action || 'submit');
			this.localFormData.set('bxajaxid', this.bxajaxid);

			this.dataLoad({
				url: this.form.remote,
				data: this.localFormData,
				delay: true
			});
		},

		fieldChanged(field) {
			if (field.autosubmit) {
				this.submit({action: 'autosubmit'});
			}
		},

		fileInput(field, e) {
			for (let i = 0; i < e.target.files.length; i++) {
				this.localFormData.append(this.proxyFieldName(field.name) + '[' + e.key + ']', e.target.files[i].path || e.target.files[i]);
			}

			if (field.autosubmit && !e.nosubmit) {
				this.submit({action: 'autosubmit'});
			}
		},

		fileRemove(field, e) {
			this.localFormData.delete(this.proxyFieldName(field.name) + '[' + e.key + ']');

			if (field.autosubmit && !e.nosubmit) {
				this.submit({action: 'autosubmit'});
			}
		},

		valueRemove(field, e) {
			// remove error of removed value
			if (field.errors && field.errors.length) {
				field.errors.splice(e, 1);
			}
		}
	}
};
</script>