<template>
	<div class="add-crane-form">
		<Modal
				title="Создание крана"
				@close="$emit('close')"
				classes="autosize"
		>
			<Loader class="center" v-if="loader"/>
			<Form @submit="onSubmit" class="center autosize">
				<Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }" nav-class="add-crane-form__tab-list"
							nav-item-link-class="add-crane-form__tab-link">
					<Tab name="Характеpистики" id="craneCharacteristics">

					</Tab>
					<Tab name="Фотографии" id="cranePhoto">
						<FormGroup class="mb-1">
							<FileInput
									v-model:native="form.photosList"
									v-model:data="form.photos"
									label="Фотографии"
									class="col-12"
							>
								Выбрать файлы
							</FileInput>
						</FormGroup>
					</Tab>
				</Tabs>
				<FormGroup class="mt-1 mb-4">
					<Submit class="col-4 mx-auto">
						Сохранить
					</Submit>
				</FormGroup>
			</Form>
		</Modal>
	</div>
</template>

<script>
import {defineComponent} from "vue";
import {ComplexForms} from "@/components/complex/object-holdings/forms/mixin";

export default defineComponent({
	name: "AddCraneForm",
	mixins: [ComplexForms],
	data() {
		return {
			form: {
				photosList: [],
				photos: [],
			},
		}
	},
	validations() {
		return {
			form: {}
		}
	},
	methods: {},
	computed: {
	}
})
</script>

<style lang="scss" src="./AddCraneForm.scss"/>