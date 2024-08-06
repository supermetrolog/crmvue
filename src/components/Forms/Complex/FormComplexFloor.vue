<template>
    <Modal
        @close="$emit('close')"
        :title="floor ? 'Редактирование этажа' : 'Добавление этажа'"
        class="form-complex-floor"
        show
        has-tabs
    >
        <Loader v-if="isLoading" />
        <Form @submit="onSubmit">
            <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="main" name="Основное">
                    <template v-if="isRealFloor">
                        <div class="row mb-2">
                            <template v-if="isMezzanine">
                                <Input
                                    v-model="form.area_mezzanine_full"
                                    :v="v$.form.area_mezzanine_full"
                                    label="S - мезанина"
                                    class="col-4"
                                    type="number"
                                    unit="м<sup>2</sup>"
                                    required
                                />
                                <InputRelation
                                    class="col-2"
                                    :original="form.area_mezzanine_full"
                                    :related="related.area_mezzanine_full"
                                >
                                    <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                                        {{ related.area_mezzanine_full }}
                                    </WithUnitType>
                                </InputRelation>
                            </template>
                            <template v-else>
                                <Input
                                    v-model="form.area_floor_full"
                                    :v="v$.form.area_floor_full"
                                    label="S - пола"
                                    class="col-4"
                                    type="number"
                                    unit="м<sup>2</sup>"
                                    required
                                />
                                <InputRelation
                                    class="col-2"
                                    :original="form.area_floor_full"
                                    :related="related.area_floor_full"
                                >
                                    <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                                        {{ related.area_floor_full }}
                                    </WithUnitType>
                                </InputRelation>
                            </template>
                            <DoubleInput
                                v-model:first="form.ceiling_height_min"
                                v-model:second="form.ceiling_height_max"
                                :v-first="v$.form.ceiling_height_min"
                                :v-second="v$.form.ceiling_height_max"
                                :validators="formCeilingHeightValidators"
                                required
                                label="Высота потолков"
                                class="col-6"
                                unit="м"
                                type="number"
                            />
                        </div>
                        <div class="row mb-2">
                            <Input
                                v-model="form.area_office_full"
                                :v="v$.form.area_office_full"
                                label="S - офисов"
                                class="col-4"
                                type="number"
                                unit="м<sup>2</sup>"
                            />
                            <InputRelation
                                class="col-2"
                                :original="form.area_office_full"
                                :related="related.area_office_full"
                            >
                                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                                    {{ related.area_office_full }}
                                </WithUnitType>
                            </InputRelation>
                            <DoubleInput
                                v-model:first="form.load_floor_min"
                                v-model:second="form.load_floor_max"
                                :v-first="v$.form.load_floor_min"
                                :v-second="v$.form.load_floor_max"
                                :validators="formLoadFloorValidators"
                                label="Нагрузка на пол"
                                class="col-6"
                                unit="т/м<sup>2</sup>"
                                type="number"
                            />
                        </div>
                        <div class="row">
                            <Input
                                v-model="form.area_tech_full"
                                :v="v$.form.area_tech_full"
                                label="S - техническая"
                                class="col-4"
                                type="number"
                                unit="м<sup>2</sup>"
                            />
                            <InputRelation
                                class="col-2"
                                :original="form.area_tech_full"
                                :related="related.area_tech_full"
                            >
                                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                                    {{ related.area_tech_full }}
                                </WithUnitType>
                            </InputRelation>
                            <DoubleInput
                                v-model:first="form.temperature_min"
                                v-model:second="form.temperature_max"
                                label="Темп. режим"
                                class="col-6"
                                unit="°С"
                                type="number"
                            />
                        </div>
                        <div class="row mt-2">
                            <CheckboxOptions
                                v-model="form.floor_types"
                                :v="v$.form.floor_types"
                                class="col-6"
                                :options="realFloorTypeOptions"
                                label="Тип пола"
                                required
                            />
                            <MultiSelect
                                v-model="form.column_grids"
                                :v="v$.form.column_grids"
                                required
                                title="Сетки колонн"
                                label="Сетки колонн"
                                :close-on-select="false"
                                class="col-6"
                                mode="multiple"
                                multiple
                                :options="gridColumnTypes"
                            />
                        </div>
                        <div v-if="isFirstFloor" class="row mt-2">
                            <GateTypesPicker
                                v-model="form.gates"
                                label="Тип и количество ворот"
                                class="col-12"
                            />
                        </div>
                    </template>
                    <template v-else>
                        <div class="row">
                            <Input
                                v-model="form.area_field_full"
                                :v="v$.form.area_field_full"
                                label="S - участка"
                                class="col-4"
                                type="number"
                                unit="м<sup>2</sup>"
                                required
                            />
                            <InputRelation
                                class="col-2"
                                :original="form.area_field_full"
                                :related="related.area_field_full"
                            >
                                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                                    {{ related.area_field_full }}
                                </WithUnitType>
                            </InputRelation>
                            <DoubleInput
                                v-model:first="form.land_length"
                                v-model:second="form.land_width"
                                label="Габариты"
                                class="col-6"
                                type="number"
                                unit="м"
                                required
                                first-label="Длина"
                                second-label="Ширина"
                                :v-first="v$.form.land_length"
                                :v-second="v$.form.land_width"
                            />
                        </div>
                        <div class="row mt-2">
                            <MultiSelect
                                v-model="form.landscape_type"
                                :v="v$.form.landscape_type"
                                title="Рельеф участка"
                                label="Рельеф участка"
                                class="col-6"
                                required
                                :options="landscapeTypeOptions"
                            />
                            <CheckboxOptions
                                v-model="form.floor_types_land"
                                class="col-6"
                                label="Типы покрытия"
                                unselect
                                :options="landFloorTypeOptions"
                            />
                        </div>
                    </template>
                </Tab>
                <Tab name="Безопасность/Коммуникации">
                    <p class="form__block">Безопасность</p>
                    <div class="row">
                        <RadioOptions
                            v-model="form.video_control"
                            class="col-3"
                            label="Видеонаблюдение"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.access_control"
                            class="col-3"
                            label="Контроль доступа"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.security_alert"
                            class="col-3"
                            label="Охранная сигнализация"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.barrier"
                            class="col-3"
                            label="Шлагбаум"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.fence"
                            class="col-3"
                            label="Забор по периметру"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.fire_alert"
                            class="col-3"
                            label="Пожарная сигнализация"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.firefighting_type"
                            :v="v$.form.firefighting_type"
                            title="Пожаротушение"
                            label="Пожаротушение"
                            class="col-4 mt-2"
                            required
                            :options="firefightingTypes"
                        />
                    </div>
                    <p class="form__block">Коммуникации</p>
                    <div class="row">
                        <CheckboxOptions
                            v-model="form.water_type"
                            class="col-6"
                            label="Тип водоснабжения"
                            unselect
                            :options="waterTypes"
                        />
                        <RadioOptions
                            v-model="form.sewage"
                            :v="v$.form.sewage"
                            class="col-3"
                            label="Канализация"
                            unselect
                            required
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.gas"
                            class="col-3"
                            label="Газ для пр-ва"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.steam"
                            class="col-3"
                            label="Пар для пр-ва"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.phone_line"
                            class="col-3"
                            label="Телефония"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.internet"
                            class="col-3"
                            label="Интернет"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                    </div>
                    <div class="row mt-2">
                        <MultiSelect
                            v-model="form.ventilation"
                            :v="v$.form.ventilation"
                            title="Вентиляция"
                            label="Вентиляция"
                            class="col-5"
                            :options="ventilationTypes"
                        />
                        <CheckboxOptions
                            v-model="form.lighting"
                            class="col-7"
                            label="Освещение"
                            :options="lightingTypes"
                        />
                    </div>
                </Tab>
                <Tab name="Фотографии">
                    <div class="row">
                        <PhotoPicker v-model="form.photos" :photos="related.photo" />
                    </div>
                </Tab>
            </Tabs>
            <div class="row">
                <Submit class="col-3 mx-auto" small success>Сохранить</Submit>
            </div>
        </Form>
    </Modal>
</template>

<script setup>
import { cloneObject } from '@/utils';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import {
    firefightingTypes,
    gridColumnTypes,
    lightingTypes,
    ventilationTypes,
    waterTypes
} from '@/const/types';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import Input from '@/components/common/Forms/Input.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import Form from '@/components/common/Forms/Form.vue';
import { computed, onBeforeMount, reactive, shallowRef } from 'vue';
import useVuelidate from '@vuelidate/core';
import { validationRulesForFloor } from '@/validators/rules/floor.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import InputRelation from '@/components/common/Forms/InputRelation.vue';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { entityOptions } from '@/const/options/options.js';
import { ceilingHeightValidators, loadFloorValidators } from '@/validators/fields.js';
import GateTypesPicker from '@/components/common/Forms/GateTypesPicker.vue';
import PhotoPicker from '@/components/common/Forms/PhotoPicker.vue';
import { landscapeTypeOptions } from '@/const/options/object.options.js';
import { landFloorTypeOptions, realFloorTypeOptions } from '@/const/options/floor.options.js';

defineEmits(['close']);
const props = defineProps({
    floor: {
        type: Object,
        default: null
    },
    related: {
        type: Object,
        required: true
    },
    fillFloor: {
        type: Object,
        default: null
    }
});

const arrayParams = [
    'photo_block',
    'parts',
    'lifts',
    'lighting',
    'hoists',
    'gates',
    'floor_types',
    'floorTypes',
    'elevators',
    'column_grids'
];

const isLoading = shallowRef(false);

const form = reactive({
    area_floor_full: null,
    area_office_full: null,
    area_tech_full: null,
    ceiling_height_min: null,
    ceiling_height_max: null,
    load_floor_min: null,
    load_floor_max: null,
    temperature_min: null,
    temperature_max: null,
    floor_types: [],
    column_grids: [],
    gates: [],
    smoke_exhaust: null,
    video_control: null,
    access_control: null,
    security_alert: null,
    fire_alert: null,
    firefighting_type: null,
    heated: null,
    water: null,
    sewage: null,
    climate_control: null,
    gas: null,
    steam: null,
    phone_line: null,
    internet: null,
    ventilation: null,
    lighting: [],
    photos: [],
    area_mezzanine_full: null,
    area_field_full: null,
    land_length: null,
    land_width: null,
    landscape_type: null,
    floor_types_land: [],
    barrier: null,
    fence: null,
    water_type: []
});

const v$ = useVuelidate({ form: validationRulesForFloor }, { form });

const formCeilingHeightValidators = computed(() => {
    return ceilingHeightValidators(form.ceiling_height_max);
});

const formLoadFloorValidators = computed(() => {
    return loadFloorValidators(form.load_floor_max);
});

const floorNumber = computed(() => {
    return props.floor ? Number(props.floor.number.id) : Number(props.fillFloor);
});
const isRealFloor = computed(() => {
    return floorNumber.value !== 16;
});
const isFirstFloor = computed(() => {
    return floorNumber.value === 1;
});
const isMezzanine = computed(() => {
    return floorNumber.value > 1 && floorNumber.value < 6;
});

const normalizeForm = () => {
    arrayParams.forEach(param => {
        if (!Array.isArray(form[param])) form[param] = [];
    });
};

const onSubmit = () => {};

onBeforeMount(() => {
    console.log(props.related);
    if (props.floor) Object.assign(form, cloneObject(props.floor));
    normalizeForm();
});
</script>
