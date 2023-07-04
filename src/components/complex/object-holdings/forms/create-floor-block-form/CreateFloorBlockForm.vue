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
									v-model="form.purposes"
									label="Назначение блока"
									:noAllSelect="true"
									:extraOptions="form.purposes_block"
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
									v-model="form.column_grids"
									:v="v$.form.column_grids"
									title="Вход в блок"
									label="Вход в блок"
									class="col-4 pl-1"
									:options="entranceBlockTypeOptions"
							/>
						</FormGroup>
						<FormGroup class="mb-1">
							<MultiSelect
									v-model="form.gates"
									:v="v$.form.gatesType"
									title="Тип, кол-во ворот"
									label="Тип, кол-во ворот"
									class="col-4 pr-1"
									:options="gateTypeOptions"
									required
							/>
							<Input
									v-if="form"
									v-model="form.gates"
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
	entranceBlockTypes,
	floorTypes, gateTypes,
	gridColumnTypes, lightingTypes,
	objectPurposes, rackTypes, ventilationTypes,
} from "@/const/constTypes";

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
				floor_types: [],
				column_grids: [],
				gates: [],
				rack_types: [],
				lighting: [],
				ventilation: []
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
		}
	}
})
</script>

<style lang="scss" src="./CreateFloorBlockForm.scss"/>