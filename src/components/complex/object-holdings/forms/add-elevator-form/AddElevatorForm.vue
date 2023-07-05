<template>
	<div class="add-elevator-form">
		<Modal
				title="Создание подъемника"
				@close="$emit('close')"
				classes="autosize"
		>
			<Loader class="center" v-if="loader"/>
			<Form @submit="onSubmit" class="center autosize">
				<Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }" nav-class="add-elevator-form__tab-list"
							nav-item-link-class="add-elevator-form__tab-link">
					<Tab name="Характеpистики" id="elevatorCharacteristics">
						<FormGroup class="mb-1">
							<MultiSelect
									v-model="form.elevator_type"
									title="Тип устройства"
									label="Тип устройства"
									class="col-4 pr-1"
									:options="craneTypeOptions"
							/>
							<MultiSelect
									v-model="form.elevator_location"
									:v="v$.form.elevator_location"
									title="Расположение"
									label="Расположение"
									class="col-4 px-1"
									:options="craneLocationOptions"
									required
							/>
							<Input
									v-if="form"
									v-model="form.elevator_capacity"
									:v="v$.form.elevator_capacity"
									label="Грузоподъемность"
									class="col-3 px-1"
									type="number"
									required
							/>
							<p class="add-elevator-form__text">т</p>
							<Input
									v-if="form"
									v-model="form.elevator_length"
									:v="v$.form.elevator_length"
									label="Габариты"
									class="col-2 pr-1"
									type="number"
							/>
							<p class="add-elevator-form__text">x</p>
							<Input
									v-if="form"
									v-model="form.elevator_width"
									:v="v$.form.elevator_width"
									class="col-2 px-1 mt-4"
									type="number"
							/>
							<Input
									v-if="form"
									v-model="form.elevator_volume"
									:v="v$.form.elevator_volume"
									class="col-3 px-1"
									label="Вместимость"
									type="number"
									required
							/>
							<p class="add-crane-form__text">п.м.</p>
						</FormGroup>
						<FormGroup class="mb-1">
							<Radio
									v-model="form.elevator_supervision"
									label="Под надзором"
									class="col-2 pr-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<Radio
									v-model="form.elevator_documents"
									label="Есть документы"
									class="col-2 px-1"
									:options="[[0, 'нет'], [1, 'да']]"
							/>
							<MultiSelect
									v-model="form.elevator_controls"
									title="Тип управления"
									label="Тип управления"
									:closeOnSelect=false
									class="col-4 px-1"
									mode="multiple"
									:options="craneControlsOptions"
							/>
							<MultiSelect
									v-model="form.elevator_condition"
									title="Состояние"
									label="Состояние"
									class="col-4 px-1"
									:options="craneConditionOptions"
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
					<Tab name="Фотографии" id="elevatorPhoto">
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
import {
	craneBeamsAmountTypes,
	craneBeamTypes, craneConditionTypes,
	craneControlsTypes,
	craneHoistingTypes,
	craneLocationTypes,
	craneTypes
} from "@/const/crane";

export default defineComponent({
	name: "AddElevatorForm",
	mixins: [ComplexForms],
	data() {
		return {
			form: {
				elevator_capacity: null,
				elevator_type: null,
				elevator_location: null,
				elevator_length: null,
				elevator_width: null,
				elevator_volume: null,
				elevator_controls: [],
				elevator_supervision: null,
				elevator_documents: null,
				elevator_condition: null,
				photosList: [],
				photos: [],
			},
		}
	},
	validations() {
		return {
			form: {
			}
		}
	},
	methods: {},
	computed: {
		craneControlsTypes() {
			return craneControlsTypes
		},
		craneBeamsAmountTypes() {
			return craneBeamsAmountTypes
		},
		craneTypeOptions() {
			return Object.values(craneTypes);
		},
		craneLocationOptions() {
			return Object.values(craneLocationTypes);
		},
		craneBeamOptions() {
			return Object.values(craneBeamTypes);
		},
		craneBeamsAmountOptions() {
			return Object.values(craneBeamsAmountTypes);
		},
		craneHoistingOptions() {
			return Object.values(craneHoistingTypes);
		},
		craneControlsOptions() {
			return Object.values(craneControlsTypes);
		},
		craneConditionOptions() {
			return Object.values(craneConditionTypes);
		}
	}
})
</script>

<style lang="scss" src="./AddElevatorForm.scss"/>