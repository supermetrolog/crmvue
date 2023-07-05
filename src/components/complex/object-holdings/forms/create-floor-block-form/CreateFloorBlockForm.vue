<template>
	<div class="create-floor-block-form">
		<Modal
				:title="false ? 'Редактирование блока' : 'Создание блока'"
				@close="$emit('close')"
				classes="autosize"
		>
			<Loader class="center" v-if="loader"/>
			<Form @submit="onSubmit" class="center autosize">
				<Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }" nav-class="create-floor-block-form__tab-list"
							nav-item-link-class="create-floor-block-form__tab-link">
					<Tab name="Характеpистики" id="main">
						<p class="create-floor-block-form__label">Основное</p>
						<FormGroup class="mb-1">
							<Input
									v-if="form"
									v-model="form.area_floor_min"
									:v="v$.form.area_floor_min"
									label="S - пола"
									class="col-2 pr-1"
									type="number"
									required
							/>
							<p class="create-floor-block-form__text">-</p>
							<Input
									v-if="form"
									v-model="form.area_floor_max"
									:v="v$.form.area_floor_max"
									class="col-2 px-1 mt-4"
									type="number"
									required
							/>
							<p class="create-floor-block-form__text">м<sup>2</sup></p>
							<Input
									v-if="form"
									v-model="form.area_office_min"
									:v="v$.form.area_office_min"
									label="S - офисов"
									class="col-2 px-1"
									type="number"
							/>
							<p class="create-floor-block-form__text">-</p>
							<Input
									v-if="form"
									v-model="form.area_office_max"
									:v="v$.form.area_office_max"
									class="col-2 px-1 mt-4"
									type="number"
							/>
							<p class="create-floor-block-form__text">м<sup>2</sup></p>
						</FormGroup>
						<FormGroup class="mb-1">
							<Input
									v-if="form"
									v-model="form.area_tech_min"
									:v="v$.form.area_tech_min"
									label="S - технич."
									class="col-2 pr-1"
									type="number"
							/>
							<p class="create-floor-block-form__text">-</p>
							<Input
									v-if="form"
									v-model="form.area_tech_max"
									:v="v$.form.area_tech_max"
									class="col-2 px-1 mt-4"
									type="number"
							/>
							<p class="create-floor-block-form__text">м<sup>2</sup></p>
						</FormGroup>
						<FormGroup class="mb-1">
							<CheckboxIcons
									v-model="form.purposes_block"
									label="Назначение блока"
									:noAllSelect="true"
									class="col-12 mx-auto"
									:options="blockPossiblePurposes"
							/>
						</FormGroup>
						<p class="create-floor-block-form__label">Характеристики</p>
						<FormGroup class="mb-1">
							<Input
									v-if="form"
									v-model="form.ceiling_height_min"
									:v="v$.form.ceiling_height_min"
									label="Высота потолков"
									class="col-2 pr-1"
									type="number"
									required
							/>
							<p class="create-floor-block-form__text">-</p>
							<Input
									v-if="form"
									v-model="form.ceiling_height_max"
									:v="v$.form.ceiling_height_max"
									class="col-2 px-1 mt-4"
									type="number"
									required
							/>
							<p class="create-floor-block-form__text">м</p>
							<Input
									v-if="form"
									v-model="form.load_floor_min"
									:v="v$.form.load_floor_min"
									label="Нагрузка на пол"
									class="col-2 px-1"
									type="number"
									required
							/>
							<p class="create-floor-block-form__text">-</p>
							<Input
									v-if="form"
									v-model="form.load_floor_max"
									:v="v$.form.load_floor_max"
									class="col-2 px-1 mt-4"
									type="number"
									required
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<MultiSelect
									v-model="form.floor_types"
									:v="v$.form.floor_types"
									required
									title="Типы пола"
									label="Типы пола"
									mode="multiple"
									:closeOnSelect=false
									class="col-4 pr-1"
									:options="floorTypeOptions"
							/>
							<MultiSelect
									v-model="form.column_grids"
									:v="v$.form.column_grids"
									required
									title="Сетки колонн"
									label="Сетки колонн"
									:closeOnSelect=false
									class="col-4 px-1"
									mode="multiple"
									:options="gridColumnTypeOptions"
							/>
							<MultiSelect
									v-model="form.entrance_block"
									title="Вход в блок"
									label="Вход в блок"
									class="col-4 pl-1"
									:options="entranceBlockTypeOptions"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<MultiSelect
									v-model="form.gatesType"
									:v="v$.form.gatesType"
									title="Тип ворот"
									label="Тип ворот"
									class="col-4 pr-1"
									:options="gateTypeOptions"
									required
							/>
							<Input
									v-if="form"
									v-model="form.gatesCount"
									:v="v$.form.gatesCount"
									label="Количество"
									class="col-2 px-1"
									type="number"
									required
							/>
							<p class="create-floor-block-form__text">шт</p>
						</FormGroup>
						<FormGroup class="mb-1">
							<Input
									v-if="form"
									v-model="form.temperature_min"
									:v="v$.form.temperature_min"
									label="Темпер. режим"
									class="col-2 pr-1"
									type="number"
							/>
							<p class="create-floor-block-form__text">-</p>
							<Input
									v-if="form"
									v-model="form.temperature_max"
									:v="v$.form.temperature_max"
									class="col-2 px-1 mt-4"
									type="number"
									required
							/>
							<p class="create-floor-block-form__text">°С</p>
						</FormGroup>
						<p class="create-floor-block-form__label">Оборудование</p>
						<FormGroup class="mb-1">
							<Radio
									v-model="form.racks"
									label="Стеллажи"
									class="col-2 pr-1"
									required
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<MultiSelect
									v-model="form.rack_types"
									:v="v$.form.rack_types"
									title="Типы стеллажей"
									label="Типы стеллажей"
									:closeOnSelect=false
									class="col-4 px-1"
									mode="multiple"
									:options="rackTypeOptions"
							/>
							<Input
									v-if="form"
									v-model="form.rack_levels"
									:v="v$.form.rack_levels"
									label="Количество ярусов"
									class="col-2 px-1"
									type="number"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<Radio
									v-model="form.charging_room"
									label="Зарядная комната"
									class="col-2 pr-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Input
									v-if="form"
									v-model="form.pallet_place_min"
									:v="v$.form.pallet_place_min"
									label="Палет мест"
									class="col-2 px-1"
									type="number"
							/>
							<p class="create-floor-block-form__text">-</p>
							<Input
									v-if="form"
									v-model="form.pallet_place_max"
									:v="v$.form.pallet_place_max"
									class="col-2 px-1 mt-4"
									type="number"
							/>
							<p class="create-floor-block-form__text">п.м.</p>
						</FormGroup>
						<p class="create-floor-block-form__label">Оборудование</p>
						<FormGroup class="mb-1">
							<Input
									v-if="form"
									v-model="form.power"
									:v="v$.form.power"
									label="Электричество"
									class="col-2 pr-1"
									type="number"
							/>
							<p class="create-floor-block-form__text">кВт</p>
							<MultiSelect
									v-model="form.lighting"
									:v="v$.form.lighting"
									title="Освещение"
									label="Освещение"
									:closeOnSelect=false
									class="col-4 px-1"
									mode="multiple"
									:options="lightingTypeOptions"
							/>
							<MultiSelect
									v-model="form.ventilation"
									:v="v$.form.ventilation"
									title="Вентиляция"
									label="Вентиляция"
									class="col-4 px-1"
									:options="ventilationTypeOptions"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<Radio
									v-model="form.heated"
									label="Отапливаемый"
									class="col-3 pr-1"
									required
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Radio
									v-model="form.water"
									label="Водоснабжение"
									class="col-3 px-1"
									required
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Radio
									v-model="form.sewage"
									label="Канализация"
									class="col-3 px-1"
									required
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Radio
									v-model="form.climate_control"
									label="Климат контроль"
									class="col-3 px-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<Radio
									v-model="form.gas"
									label="Газ для пр-ва"
									class="col-3 pr-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Radio
									v-model="form.steam"
									label="Пар для пр-ва"
									class="col-3 px-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Radio
									v-model="form.phone_line"
									label="Телефония"
									class="col-3 px-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Radio
									v-model="form.internet"
									label="Интернет"
									class="col-3 px-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
						</FormGroup>
						<p class="create-floor-block-form__label">Безопасность</p>
						<FormGroup class="mb-1">
							<MultiSelect
									v-model="form.firefighting_type"
									:v="v$.form.firefighting_type"
									title="Пожаротушение"
									label="Пожаротушение"
									class="col-4 pr-1"
									required
									:options="firefightingTypeOptions"
							/>
							<Radio
									v-model="form.smoke_exhaust"
									label="Дымоудаление"
									class="col-3 px-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<Radio
									v-model="form.video_control"
									label="Видеонаблюдение"
									class="col-3 pr-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Radio
									v-model="form.access_control"
									label="Контроль доступа"
									class="col-3 px-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Radio
									v-model="form.security_alert"
									label="Охранная сигнализация"
									class="col-3 px-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Radio
									v-model="form.fire_alert"
									label="Пожарная сигнализация"
									class="col-3 px-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
						</FormGroup>
						<p class="create-floor-block-form__label">Подъемные устройства</p>
						<FormGroup class="mb-1">
							<Radio
									v-model="form.has_elevators"
									label="Лифт/подъемники"
									class="col-3 pr-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<Radio
									v-model="form.has_cranes"
									label="Крановые устройства"
									class="col-3 pr-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<Radio
									label="Подкрановые пути"
									v-model="form.cranes_runways"
									class="col-3 pr-1"
									:options="[[0, 'нет'], [1, 'да']]"
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
					<Tab name="Файлы">
						<FormGroup class="mb-1">
							<FileInput
									v-model:native="form.filesList"
									v-model:data="form.files"
									label="Файлы"
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
import {
	entranceBlockTypes, firefightingTypes,
	floorTypes, gateTypes,
	gridColumnTypes, lightingTypes,
	objectPurposes, rackTypes, ventilationTypes,
} from "@/const/constTypes";
import {helpers, required, minValue} from "@vuelidate/validators";

export default defineComponent({
	name: "CreateFloorBlockForm",
	mixins: [ComplexForms],
	props: {
		object: {
			type: Object,
			required: true,
		}
	},
	data() {
		return {
			selectedCompany: null,
			form: {
				area_floor_min: null,
				area_floor_max: null,
				area_office_min: null,
				area_office_max: null,
				area_tech_min: null,
				area_tech_max: null,
				purposes_block: [],
				ceiling_height_min: null,
				ceiling_height_max: null,
				load_floor_min: null,
				load_floor_max: null,
				floor_types: [],
				column_grids: [],
				entrance_block: [],
				gatesType: [],
				gatesCount: [],
				temperature_min: null,
				temperature_max: null,
				racks: null,
				rack_types: [],
				rack_levels: null,
				charging_room: null,
				pallet_place_min: null,
				pallet_place_max: null,
				power: null,
				lighting: [],
				ventilation: [],
				heated: null,
				water: null,
				sewage: null,
				climate_control: null,
				gas: null,
				steam: null,
				phone_line: null,
				internet: null,
				firefighting_type: [],
				smoke_exhaust: null,
				video_control: null,
				access_control: null,
				security_alert: null,
				fire_alert: null,
				has_elevators: null,
				has_cranes: null,
				cranes_runways: null,
				description: null,
				photosList: [],
				photos: [],
				filesList: [],
				files: []
			},
		}
	},
	validations() {
		return {
			form: {
				area_floor_min: {
					required: helpers.withMessage(
							"заполните поле",
							required
					),
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				area_floor_max: {
					required: helpers.withMessage(
							"заполните поле",
							required
					),
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				area_office_min: {
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				area_office_max: {
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				area_tech_min: {
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				area_tech_max: {
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				ceiling_height_min: {
					required: helpers.withMessage(
							"заполните поле",
							required
					),
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				ceiling_height_max: {
					required: helpers.withMessage(
							"заполните поле",
							required
					),
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				load_floor_min: {
					required: helpers.withMessage(
							"заполните поле",
							required
					),
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				load_floor_max: {
					required: helpers.withMessage(
							"заполните поле",
							required
					),
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				floor_types: {
					required: helpers.withMessage(
							"выберите один или несколько вариантов",
							required
					),
				},
				column_grids: {
					required: helpers.withMessage(
							"выберите один или несколько вариантов",
							required
					),
				},
				temperature_min: {
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				temperature_max: {
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				racks: {
					required: helpers.withMessage(
							"выберите один из вариантов",
							required
					),
				},
				rack_levels: {
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				pallet_place_min: {
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				pallet_place_max: {
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				power: {
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				gatesType: {
					required: helpers.withMessage(
							"выберите один или несколько вариантов",
							required
					),
				},
				gatesCount: {
					required: helpers.withMessage(
							"заполните поле",
							required
					),
					minValue: helpers.withMessage(
							"значение должно быть больше 0",
							minValue(1)
					)
				},
				heated: {
					required: helpers.withMessage(
							"выберите один из вариантов",
							required
					),
				},
				water: {
					required: helpers.withMessage(
							"выберите один из вариантов",
							required
					),
				},
				sewage: {
					required: helpers.withMessage(
							"выберите один из вариантов",
							required
					),
				},
				firefighting_type: {
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
		blockPossiblePurposes() {
			const result = [];
			for (const purpose in objectPurposes) {
				if (this.object.purposes.find(el => el == purpose)) {
					result.push([purpose, objectPurposes[purpose]]);
				}
			}
			return result
		},
		floorTypeOptions() {
			return Object.values(floorTypes)
		},
		gridColumnTypeOptions() {
			return Object.values(gridColumnTypes)
		},
		entranceBlockTypeOptions() {
			return Object.values(entranceBlockTypes);
		},
		gateTypeOptions() {
			return Object.values(gateTypes);
		},
		rackTypeOptions() {
			return Object.values(rackTypes);
		},
		lightingTypeOptions() {
			return Object.values(lightingTypes);
		},
		ventilationTypeOptions() {
			return Object.values(ventilationTypes);
		},
		firefightingTypeOptions() {
			return Object.values(firefightingTypes);
		}
	}
})
</script>

<style lang="scss" src="./CreateFloorBlockForm.scss"/>