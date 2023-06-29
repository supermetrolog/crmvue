<template>
	<div class="building-create-form">
		<Modal
				:title="false ? 'Редактирование строения' : 'Создание строения'"
				@close="$emit('close')"
				classes="autosize"
		>
			<Loader class="center" v-if="loader"/>
			<Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }" nav-class="building-create-form__tab-list"
						nav-item-link-class="building-create-form__tab-link">
				<Tab name="Основное" id="main">
					<Form @submit="onSubmit" class="center">
						<FormGroup class="mb-1 building-create-form__form-group building-create-form__form-group_long">
							<MultiSelect
									v-model="form.address"
									extraClasses="long-text"
									label="Адрес строения"
									required
									class="col-6 pr-1"
									:filterResults="false"
									:minChars="1"
									:resolveOnLoad="true"
									:delay="500"
									:searchable="true"
									:options="async (query) => {
                return await searchAddress(query);
              }"
									@change="onChangeAddress"
							/>
						</FormGroup>
						<FormGroup class="mb-1 building-create-form__form-group building-create-form__form-group_long">
							<MultiSelect
									v-model="form.company_id"
									extraClasses="long-text"
									label="Компания"
									required
									class="col-6 pr-1"
									:v="v$.form.company_id"
									:filterResults="false"
									:minChars="1"
									:resolveOnLoad="true"
									:delay="500"
									:searchable="true"
									:options="
              async (query) => {
                return await searchCompany(query);
              }
            "
									@change="onChangeCompany"
							/>
						</FormGroup>

						<FormGroup class="mt-4">
							<Submit class="col-4 mx-auto">
								Сохранить
							</Submit>
						</FormGroup>
					</Form>
				</Tab>
				<Tab name="Характериcтики">
				</Tab>
				<Tab name="Фотографии">
				</Tab>
				<Tab name="Документы">
				</Tab>
			</Tabs>
		</Modal>
	</div>
</template>

<script>
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import Submit from "@/components/common/form/Submit.vue";
import useValidate from "@vuelidate/core";
import {defineComponent} from "vue";
import {helpers, required} from "@vuelidate/validators";
import {mapActions} from "vuex";


export default defineComponent({
	name: "BuildingCreateForm",
	components: {MultiSelect, Submit, Form, FormGroup},
	data() {
		return {
			loader: false,
			v$: useValidate(),
			selectedCompany: null,
			requestOptions: [],
			form: {
				address: null,
				company_id: null
			},
		}
	},
	validations() {
		return {
			form: {
				company_id: {
					required: helpers.withMessage("заполните поле", required),
				},
			}
		}
	},
	methods: {
		...mapActions([
			"SEARCH_COMPANIES",
		]),
		onSubmit() {
			console.log("SUBMIT");
		},
		onChangeAddress() {
			console.log("CHANGE ADDRESS")
		},
		async onChangeCompany() {
			console.log("CHANGE COMPANY")
		},
		async searchCompany() {
			return ["ОАО Тореадор", "ЗАО ИнкЛомМет"]
		},
		async searchAddress() {
			return ['Питер', 'Москва']
		}
	}
})
</script>

<style lang="scss" src="./BuildingCreateForm.scss"/>