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
									class="col-4 pr-1"
									:options="floorTypeOptions"
							/>
							<MultiSelect
									v-model="form.column_grids"
									:v="v$.form.column_grids"
									required
									title="Сетки колонн"
									label="Сетки колонн"
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
	floorTypes,
	gridColumnTypes,
	objectPurposes,
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
				column_grids: []

			},
		}
	},
	validations() {
		return {
			form: {

			}
		}
	},
	methods: {
	},
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
		}
	}
})
</script>

<style lang="scss" src="./CreateFloorBlockForm.scss"/>