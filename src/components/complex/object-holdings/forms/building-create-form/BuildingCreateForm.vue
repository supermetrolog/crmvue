<template>
	<div class="building-create-form">
		<Modal
				:title="false ? 'Редактирование строения' : 'Создание строения'"
				@close="$emit('close')"
				classes="autosize"
		>
			<Loader class="center" v-if="loader"/>
			<Form @submit="onSubmit" class="center">
				<Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }" nav-class="building-create-form__tab-list"
							nav-item-link-class="building-create-form__tab-link">
					<Tab name="Основное" id="main">
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
									:v="v$.form.address"
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
						<FormGroup class="mb-1">
							<CheckboxIcons
									v-model="form.purposes"
									label="Тип объекта"
									extraLabel="склад"
									:noAllSelect="true"
									:extraValue="1"
									:extraOptions="form.object_type"
									@extraSelect="selectObjectType"
									class="col-12 pr-2 mx-auto"
									:options="objectPurposesWarehouse"
							/>
							<CheckboxIcons
									v-model="form.purposes"
									extraLabel="производство"
									:noAllSelect="true"
									:extraValue="2"
									:extraOptions="form.object_type"
									@extraSelect="selectObjectType"
									class="col-12 mt-4 pr-2 mx-auto"
									:options="objectPurposesProduction"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<Checkbox
									v-model="form.test_only"
									label="Тестовый лот"
									class="col large text-center"
							/>
						</FormGroup>
					</Tab>
					<Tab name="Характериcтики">
						<FormGroup class="mb-1">
							<Input
									v-model="form.area_building"
									:v="v$.form.area_building"
									label="S - здания"
									class="col-4 pr-1"
									type="number"
									required
							/>
							<Input
									v-model="form.area_floor_full"
									label="S - пола общая"
									class="col-4 px-1"
									type="number"
							/>
							<Input
									v-model="form.area_mezzanine_full"
									label="S - мезанина общая"
									class="col-4 pl-1"
									type="number"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<Input
									v-model="form.area_office_full"
									label="S - офисов общая"
									class="col-4 pr-1"
									type="number"
							/>
							<Input
									v-model="form.area_tech_full"
									label="S - техническая"
									class="col-4 px-1"
									type="number"
							/>
							<Radio
									v-model="form.land_use_restrictions"
									label="Ограничения"
									class="col-4 pl-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<MultiSelect
									v-model="form.object_class"
									:v="v$.form.object_class"
									required
									title="Класс объекта"
									label="Класс объекта"
									class="col-4 pr-1"
									:options="objectClassOptions"
							/>
							<MultiSelect
									v-model="form.facing_type"
									title="Внешняя отделка"
									label="Внешняя отделка"
									class="col-4 px-1"
									:options="facingTypeOptions"
							/>
							<MultiSelect
									v-model="form.own_type"
									title="Право на строение"
									label="Право на строение"
									class="col-4 pl-1"
									:options="ownTypeOptions"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<Input
									v-model="form.year_build"
									:v="v$.form.year_build"
									label="Год постройки"
									class="col-4 pr-1"
									type="number"
									maska="####"
							/>
							<Input
									v-model="form.year_repair"
									:v="v$.form.year_repair"
									label="Год последнего ремонта"
									class="col-4 px-1"
									type="number"
									maska="####"
							/>
							<Input
									v-model="form.cadastral_number"
									:v="v$.form.cadastral_number"
									label="Кадастровый № строения"
									class="col-4 pl-1"
									required
							/>
						</FormGroup>
						<FormGroup class="mb-1">
              <Textarea
									v-model="form.description"
									label="Описание"
									class="col-12 px-0"
							/>
						</FormGroup>
					</Tab>
					<Tab name="Фотографии">
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
					<Tab name="Документы">
						<FormGroup class="mb-1">
							<FileInput
									v-model:native="form.layoutsList"
									v-model:data="form.layouts"
									label="Планировки"
									class="col-12"
							>
								Выбрать файлы
							</FileInput>
						</FormGroup>
						<FormGroup class="mb-1">
							<FileInput
									v-model:native="form.panoramasList"
									v-model:data="form.panoramas"
									label="Панорамы"
									class="col-12"
							>
								Выбрать файлы
							</FileInput>
						</FormGroup>
						<FormGroup class="mb-1">
							<FileInput
									v-model:native="form.presentationsList"
									v-model:data="form.presentations"
									label="Презентации"
									class="col-12"
							>
								Выбрать файлы
							</FileInput>
						</FormGroup>
						<FormGroup class="mb-1">
							<FileInput
									v-model:native="form.ownerShipDocumentsList"
									v-model:data="form.ownerShipDocuments"
									label="Документы на собственность"
									class="col-12"
							>
								Выбрать файлы
							</FileInput>
						</FormGroup>
					</Tab>
				</Tabs>
				<FormGroup class="mt-1">
					<Submit class="col-4 mx-auto">
						Сохранить
					</Submit>
				</FormGroup>
			</Form>
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
import {helpers, required, minValue, maxValue} from "@vuelidate/validators";
import {mapActions} from "vuex";
import CheckboxIcons from "@/components/common/form/CheckboxIcons.vue";
import {facingTypes, objectClassTypes, objectPurposes, ownTypes} from "@/const/constTypes";
import {ObjectTypes} from "@/types/objectTypes.enum";
import FileInput from "@/components/common/form/FileInput.vue";
import Input from "@/components/common/form/Input.vue";
import {yandexmap} from "@/utils";
import Radio from "@/components/common/form/Radio.vue";
import Textarea from "@/components/common/form/Textarea.vue";
import Checkbox from "@/components/common/form/Checkbox.vue";


export default defineComponent({
	name: "BuildingCreateForm",
	components: {Checkbox, Textarea, Radio, Input, FileInput, CheckboxIcons, MultiSelect, Submit, Form, FormGroup},
	data() {
		return {
			loader: false,
			v$: useValidate(),
			selectedCompany: null,
			requestOptions: [],
			objectPurposes,
			objectClassTypes,
			facingTypes,
			ownTypes,
			form: {
				address: null,
				company_id: null,
				purposes: [],
				object_type: [],
				test_only: null,
				area_building: null,
				area_floor_full: null,
				area_mezzanine_full: null,
				area_office_full: null,
				area_tech_full: null,
				object_class: null,
				facing_type: null,
				own_type: null,
				land_use_restrictions: null,
				year_build: null,
				year_repair: null,
				cadastral_number: null,
				description: null,
				layouts: [],
				layoutsList: [],
				panoramas: [],
				panoramasList: [],
				presentations: [],
				presentationsList: [],
				ownerShipDocuments: [],
				ownerShipDocumentsList: [],
				photos: [],
				photosList: [],

			},
		}
	},
	validations() {
		return {
			form: {
				address: {
					required: helpers.withMessage("заполните поле", required),
				},
				company_id: {
					required: helpers.withMessage("заполните поле", required),
				},
				area_building: {
					required: helpers.withMessage("заполните поле", required),
				},
				object_class: {
					required: helpers.withMessage(
							"выберите класс объекта",
							required
					),
				},
				year_build: {
					minValue: helpers.withMessage(
							"минимальное значение - 1800",
							minValue(1800)
					),
					maxValue: helpers.withMessage(
							`максимальное значение - ${new Date().getFullYear()}`,
							maxValue(new Date().getFullYear())
					),
				},
				year_repair: {
					minValue: helpers.withMessage(
							"минимальное значение - 1800",
							minValue(1800)
					),
					maxValue: helpers.withMessage(
							`максимальное значение - ${new Date().getFullYear()}`,
							maxValue(new Date().getFullYear())
					),
				},
				cadastral_number: {
					required: helpers.withMessage("заполните поле", required),
				}
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
		async searchAddress(query) {
			return await yandexmap.getAddress(query);
		},
		selectObjectType(isSelected, type) {
			this.form.object_type = this.form.object_type.filter(
					(item) => item !== type
			);
			if (isSelected) {
				this.form.object_type.push(type);
			}
		},
	},
	computed: {
		objectPurposesWarehouse() {
			const result = [];
			for (const purpose in objectPurposes) {
				if (objectPurposes[purpose].type === ObjectTypes.WAREHOUSE) {
					result.push([purpose, objectPurposes[purpose]]);
				}
			}
			return result
		},
		objectPurposesProduction() {
			const result = [];
			for (const purpose in objectPurposes) {
				if (objectPurposes[purpose].type === ObjectTypes.PRODUCTION) {
					result.push([purpose, objectPurposes[purpose]]);
				}
			}
			return result
		},
		objectClassOptions() {
			return Object.values(objectClassTypes)
		},
		facingTypeOptions() {
			return Object.values(facingTypes)
		},
		ownTypeOptions() {
			return Object.values(ownTypes);
		}
	}
})
</script>

<style lang="scss" src="./BuildingCreateForm.scss"/>