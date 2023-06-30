<template>
	<div class="plot-create-form">
		<Modal
				:title="false ? 'Редактирование участка' : 'Создание участка'"
				@close="$emit('close')"
				classes="autosize"
		>
			<Loader class="center" v-if="loader"/>
			<Form @submit="onSubmit" class="center">
				<Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }" nav-class="plot-create-form__tab-list"
							nav-item-link-class="plot-create-form__tab-link">
					<Tab name="Основное" id="main">
						<FormGroup class="mb-1 plot-create-form__form-group plot-create-form__form-group_long">
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
						<FormGroup class="mb-1 plot-create-form__form-group plot-create-form__form-group_long">
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
									:extraValue="3"
									:extraOptions="form.object_type"
									@extraSelect="selectObjectType"
									class="col-12 pr-2 mx-auto"
									:options="[]"
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
									v-model="form.area_field_full"
									:v="v$.form.area_field_full"
									label="S - участка общая"
									class="col-4 pr-1"
									type="number"
									required
							/>
							<Input
									v-model="form.land_length"
									label="Длина участка"
									class="col-4 px-1"
									type="number"
							/>
							<Input
									v-model="form.land_width"
									label="Ширина участка"
									class="col-4 pl-1"
									type="number"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<MultiSelect
									v-model="form.own_type_land"
									:v="v$.form.own_type_land"
									required
									title="Право на участок"
									label="Право на участок"
									class="col-4 pr-1"
									:options="ownTypeLandOptions"
							/>
							<MultiSelect
									v-model="form.land_category"
									title="Категория земли"
									label="Категория земли"
									class="col-4 px-1"
									:options="landCategoryOptions"
							/>
							<MultiSelect
									v-model="form.landscape_type"
									:v="v$.form.landscape_type"
									title="Рельеф участка"
									label="Рельеф участка"
									class="col-4 pl-1"
									required
									:options="landscapeTypeOptions"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<Input
									v-model="form.cadastral_number_land"
									:v="v$.form.cadastral_number_land"
									label="Кадастровый № строения"
									class="col-4 pr-1"
									required
							/>
							<Radio
									v-model="form.land_use_restrictions"
									label="Ограничения"
									class="col-4 px-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Radio
									v-model="form.first_line"
									label="Первая линия"
									class="col-4 pl-1"
									required
									:options="[[0, 'нет'], [1, 'да']]"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
              <Textarea
									v-model="form.field_allow_usage"
									label="В.Р.И"
									class="col-12 px-0"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<div class="col-6 row no-gutters">
								<Radio
										v-model="form.power"
										label="Электроснаб."
										class="col-5 pr-1"
										:options="[[0, 'нет'], [1, 'да']]"
										required
								/>
								<Input
										v-if="form.power"
										v-model="form.power_value"
										:v="v$.form.power_value"
										class="col-5 px-1 pt-4"
										type="number"
										required
								/>
								<p v-if="form.power" class="col-2 plot-create-form__text pr-2">кВт</p>
							</div>
							<div class="col-6 row no-gutters">
								<Radio
										v-model="form.heating_central"
										label="Центр. отоплен."
										class="col-5 pr-1"
										:options="[[0, 'нет'], [1, 'да']]"
										required
								/>
							</div>
						</FormGroup>
						<FormGroup class="mb-1">
							<div class="col-6 row no-gutters">
								<Radio
										v-model="form.water"
										label="Водоснабжен."
										class="col-5 pr-1"
										:options="[[0, 'нет'], [1, 'да']]"
										required
								/>
								<Input
										v-if="form.water"
										v-model="form.water_value"
										:v="v$.form.water_value"
										class="col-5 px-1 pt-4"
										type="number"
										required
								/>
								<p v-if="form.water" class="col-2 plot-create-form__text pr-2">м<sup>3</sup>/сут</p>
							</div>
							<div class="col-6 row no-gutters" v-if="form.water">
								<MultiSelect
										v-model="form.water_type"
										:v="v$.form.water_type"
										title="Тип"
										label="Тип"
										class="col-8 pl-1"
										required
										:options="waterTypeOptions"
								/>
							</div>
						</FormGroup>
						<FormGroup class="mb-1">
							<div class="col-6 row no-gutters">
								<Radio
										v-model="form.sewage_central"
										label="Канализ. центр."
										class="col-5 pr-1"
										:options="[[0, 'нет'], [1, 'да']]"
										required
								/>
								<Input
										v-if="form.sewage_central"
										v-model="form.sewage_central_value"
										:v="v$.form.sewage_central_value"
										class="col-5 px-1 pt-4"
										type="number"
										required
								/>
								<p v-if="form.sewage_central" class="col-2 plot-create-form__text pr-2">м<sup>3</sup>/сут</p>
							</div>
							<div class="col-6 row no-gutters">
								<Radio
										v-model="form.sewage_rain"
										label="Канализ. ливн."
										class="col-5 pr-1"
										:options="[[0, 'нет'], [1, 'да']]"
								/>
							</div>
						</FormGroup>
					</Tab>
					<Tab name="Описание">
						<Textarea
								v-model="form.description"
								label="Описание"
								class="col-12 px-0"
						/>
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
import {defineComponent} from "vue";
import {helpers, required} from "@vuelidate/validators";
import {ObjectForms} from "@/components/complex/object-holdings/forms/mixin";


export default defineComponent({
	name: "PlotCreateForm",
	mixins: [ObjectForms],
	data() {
		return {}
	},
	validations() {
		return {
			form: {
				cadastral_number_land: {
					required: helpers.withMessage("заполните поле", required),
				},
				first_line: {
					required: helpers.withMessage(
							"выберите один из вариантов",
							required
					),
				},
				area_field_full: {
					required: helpers.withMessage(
							"заполните поле",
							required
					),
				},
				own_type_land: {
					required: helpers.withMessage(
							"выберите один из вариантов",
							required
					),
				},
				landscape_type: {
					required: helpers.withMessage(
							"выберите один из вариантов",
							required
					),
				},
			}
		}
	},
	methods: {},
	computed: {
		ownTypeLandOptions() {
			return Object.values(this.ownTypesLand);
		},
		landCategoryOptions() {
			return Object.values(this.landCategoryTypes);
		},
		landscapeTypeOptions() {
			return Object.values(this.landscapeTypes);
		},
		waterTypeOptions() {
			return Object.values(this.waterTypes);
		}
	}
})
</script>

<style lang="scss" src="./PlotCreateForm.scss"/>