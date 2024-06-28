<template>
    <Modal
        @close="$emit('close')"
        :title="floor ? 'Редактирование этажа' : 'Добавление этажа'"
        class="form-complex-floor"
        has-tabs
    >
        <Loader v-if="loader" />
        <Form @submit="onSubmit">
            <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="main" name="Основное">
                    <div class="row">
                        <Input
                            v-model="form.area_floor_full"
                            :v="v$.form.area_floor_full"
                            label="S - пола"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                            required
                        />
                        <Input
                            v-model="form.area_office_full"
                            :v="v$.form.area_office_full"
                            label="S - офисов"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                        />
                        <Input
                            v-model="form.area_tech_full"
                            :v="v$.form.area_tech_full"
                            label="S - техническая"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                        />
                        <Textarea v-model="form.description" label="Описание" class="col-12 mt-2" />
                    </div>
                </Tab>
                <Tab name="Характериcтики/Оборудование">
                    <div class="row">
                        <DoubleInput
                            v-model:first="form.ceiling_height_min"
                            v-model:second="form.ceiling_height_max"
                            label="Высота потолков"
                            class="col-6"
                            unit="м"
                            type="number"
                        />
                        <DoubleInput
                            v-model:first="form.load_floor_min"
                            v-model:second="form.load_floor_max"
                            label="Нагрузка на пол"
                            class="col-6"
                            unit="т/м<sup>2</sup>"
                            type="number"
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="col-6">
                            <span class="form__subtitle">Тип пола</span>
                            <div class="form__row mt-1">
                                <CheckboxChip
                                    v-for="(type, index) in floorTypes"
                                    :key="index"
                                    v-model="form.floor_types"
                                    :value="index"
                                    :text="type"
                                />
                            </div>
                        </div>
                        <MultiSelect
                            v-model="form.column_grids"
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
                    <div class="row mt-2">
                        <!--                        {{ form.gates }}-->
                        <!--                        <MultiSelect-->
                        <!--                            v-model="form.gates"-->
                        <!--                            :v="v$.form.gates"-->
                        <!--                            title="Тип ворот"-->
                        <!--                            label="Тип ворот"-->
                        <!--                            class="col-4"-->
                        <!--                            :options="gateTypeOptions"-->
                        <!--                            required-->
                        <!--                        />-->
                        <!--                        <Input-->
                        <!--                            v-model="form.gatesCount"-->
                        <!--                            :v="v$.form.gatesCount"-->
                        <!--                            label="Количество"-->
                        <!--                            class="col-2"-->
                        <!--                            type="number"-->
                        <!--                            unit="шт"-->
                        <!--                            required-->
                        <!--                        />-->
                        <DoubleInput
                            v-model:first="form.temperature_min"
                            v-model:second="form.temperature_max"
                            label="Темп. режим"
                            class="col-6"
                            unit="°С"
                            type="number"
                        />
                    </div>
                    <p class="form__block">Подъемные устройства</p>
                    <div class="row">
                        <div class="col-4">
                            <span class="form__subtitle">Лифт/подъемники</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.elevators"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.elevators"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                        <div class="col-4">
                            <span class="form__subtitle">Крановые устройства</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.has_cranes"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.has_cranes"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                        <div class="col-4">
                            <span class="form__subtitle">Подкрановые пути</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.cranes_runways"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.cranes_runways"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab name="Безопасность/Коммуникации">
                    <p class="form__block">Безопасность</p>
                    <div class="row">
                        <div class="col-2">
                            <span class="form__subtitle">Дымоудаление</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.smoke_exhaust" label="Нет" :value="0" />
                                <RadioChip v-model="form.smoke_exhaust" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-2">
                            <span class="form__subtitle">Видеонаблюдение</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.video_control" label="Нет" :value="0" />
                                <RadioChip v-model="form.video_control" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-2">
                            <span class="form__subtitle">Контроль доступа</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.access_control" label="Нет" :value="0" />
                                <RadioChip v-model="form.access_control" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Охранная сигнализация</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.security_alert" label="Нет" :value="0" />
                                <RadioChip v-model="form.security_alert" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Пожарная сигнализация</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.fire_alert" label="Нет" :value="0" />
                                <RadioChip v-model="form.fire_alert" label="Да" :value="1" />
                            </div>
                        </div>
                        <MultiSelect
                            v-model="form.firefighting_type"
                            :v="v$.form.firefighting_type"
                            title="Пожаротушение"
                            label="Пожаротушение"
                            class="col-4 mt-2"
                            required
                            :options="firefightingTypeOptions"
                        />
                    </div>
                    <p class="form__block">Коммуникации</p>
                    <div class="row">
                        <Input
                            v-model="form.power"
                            :v="v$.form.power"
                            label="Электричество"
                            class="col-2"
                            type="number"
                            unit="кВт"
                        />
                        <MultiSelect
                            v-model="form.ventilation"
                            :v="v$.form.ventilation"
                            title="Вентиляция"
                            label="Вентиляция"
                            class="col-3"
                            :options="ventilationTypeOptions"
                        />
                        <div class="col-7">
                            <span class="form__subtitle">Освещение</span>
                            <div class="form__row mt-1">
                                <CheckboxChip
                                    v-for="(type, index) in lightingTypes"
                                    :key="index"
                                    v-model="form.lighting"
                                    :value="index"
                                    :text="type"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-3 mb-2">
                            <span class="form__subtitle">Отапливаемый</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.heated" label="Нет" :value="0" />
                                <RadioChip v-model="form.heated" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-3 mb-2">
                            <span class="form__subtitle">Водоснабжение</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.water" label="Нет" :value="0" />
                                <RadioChip v-model="form.water" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-3 mb-2">
                            <span class="form__subtitle">Канализация</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.sewage" label="Нет" :value="0" />
                                <RadioChip v-model="form.sewage" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-3 mb-2">
                            <span class="form__subtitle">Климат контроль</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.climate_control" label="Нет" :value="0" />
                                <RadioChip v-model="form.climate_control" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Газ для пр-ва</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.gas" label="Нет" :value="0" />
                                <RadioChip v-model="form.gas" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Пар для пр-ва</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.steam" label="Нет" :value="0" />
                                <RadioChip v-model="form.steam" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Телефония</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.phone_line" label="Нет" :value="0" />
                                <RadioChip v-model="form.phone_line" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Интернет</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.internet" label="Нет" :value="0" />
                                <RadioChip v-model="form.internet" label="Да" :value="1" />
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab name="Фотографии">
                    <div class="row">
                        <FileInput
                            v-model:native="form.photosList"
                            v-model:data="form.photos"
                            label="Фотографии"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                </Tab>
            </Tabs>
            <div class="row">
                <Submit class="col-3 mx-auto" small success>Сохранить</Submit>
            </div>
        </Form>
    </Modal>
</template>

<script>
import { helpers, maxValue, minValue, required } from '@vuelidate/validators';
import { mapActions } from 'vuex';
import { cloneObject } from '@/utils';
import { yandexmap } from '@/utils/yandexMap.js';
import Loader from '@/components/common/Loader.vue';
import { ComplexFormMixin } from '@/components/Forms/Complex/mixin';
import Modal from '@/components/common/Modal.vue';
import {
    entranceBlockTypes,
    firefightingTypes,
    floorTypes,
    gateTypes,
    gridColumnTypes,
    lightingTypes,
    ventilationTypes
} from '@/const/types';
import { ObjectTypeList } from '@/const/const';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

export default {
    name: 'FormComplexFloor',
    components: { RadioChip, DoubleInput, CheckboxChip, Modal, Loader },
    mixins: [ComplexFormMixin],
    emits: ['close'],
    props: {
        floor: {
            type: Object,
            default: null
        },
        object: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            selectedCompany: null,
            form: {
                access_control: null,
                area_field_full: null,
                area_floor_full: null,
                area_mezzanine_full: null,
                area_office_full: null,
                area_tech_full: null,
                barrier: null,
                ceiling_height: null,
                ceiling_height_max: null,
                ceiling_height_min: null,
                climate_control: null,
                column_grid: null,
                column_grid_length: null,
                column_grid_width: null,
                column_grids: [],
                cranes_cathead: null,
                cranes_overhead: null,
                deleted: null,
                description: null,
                elevators: [],
                fence: null,
                fire_alert: null,
                firefighting_type: null,
                floorTypes: [],
                floor_num: null,
                floor_num_id: null,
                floor_type: Object,
                floor_types: [],
                floor_types_land: null,
                gas: null,
                gates: [],
                heated: null,
                heating: null,
                heating_value: null,
                hoists: [],
                id: null,
                internet: null,
                internet_value: null,
                land: null,
                land_length: null,
                land_width: null,
                landscape_type: null,
                last_update: null,
                lifts: [],
                lighting: [],
                lighting_value: null,
                load_floor: null,
                load_floor_max: null,
                load_floor_min: null,
                number: {
                    id: null,
                    title: null,
                    description: null,
                    sign: null,
                    color: null,
                    order_row: null
                },
                object_id: null,
                order_row: null,
                parts: [],
                phone_line: null,
                photo_block: [],
                power: null,
                power_value: null,
                publ_time: null,
                security_alert: null,
                sewage: null,
                sewage_value: null,
                smoke_exhaust: null,
                steam: null,
                telphers: null,
                temperature: null,
                temperature_max: null,
                temperature_min: null,
                title: null,
                title_empty_communications: null,
                title_empty_cranes: null,
                title_empty_infrastructure: null,
                title_empty_main: null,
                title_empty_security: null,
                title_empty_stats: null,
                ventilation: null,
                video_control: null,
                water: null
            },
            arrayParams: [
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
            ]
        };
    },
    validations() {
        return {
            form: {
                address: {
                    required: helpers.withMessage('заполните поле', required)
                },
                company_id: {
                    required: helpers.withMessage('заполните поле', required)
                },
                area_building: {
                    required: helpers.withMessage('заполните поле', required)
                },
                object_class: {
                    required: helpers.withMessage('выберите класс объекта', required)
                },
                year_build: {
                    minValue: helpers.withMessage('минимальное значение - 1800', minValue(1800)),
                    maxValue: helpers.withMessage(
                        `максимальное значение - ${new Date().getFullYear()}`,
                        maxValue(new Date().getFullYear())
                    )
                },
                year_repair: {
                    minValue: helpers.withMessage('минимальное значение - 1800', minValue(1800)),
                    maxValue: helpers.withMessage(
                        `максимальное значение - ${new Date().getFullYear()}`,
                        maxValue(new Date().getFullYear())
                    )
                },
                cadastral_number: {
                    required: helpers.withMessage('заполните поле', required)
                }
            }
        };
    },
    computed: {
        objectTypeListWareHouse: () => ObjectTypeList.warehouse,
        objectTypeListProduction: () => ObjectTypeList.production,
        objectTypeListPlot: () => ObjectTypeList.plot,
        lightingTypes: () => lightingTypes,
        gridColumnTypes: () => gridColumnTypes,
        floorTypes: () => floorTypes,
        entranceBlockTypeOptions() {
            return Object.values(entranceBlockTypes);
        },
        gateTypeOptions() {
            return Object.values(gateTypes);
        },
        ventilationTypeOptions() {
            return Object.values(ventilationTypes);
        },
        firefightingTypeOptions() {
            return Object.values(firefightingTypes);
        }
    },
    methods: {
        ...mapActions(['SEARCH_COMPANIES']),
        onChangeAddress() {
            console.log('CHANGE ADDRESS');
        },
        async onChangeCompany() {
            console.log('CHANGE COMPANY');
        },
        async searchCompany() {
            return ['ОАО Тореадор', 'ЗАО ИнкЛомМет'];
        },
        async searchAddress(query) {
            return await yandexmap.getAddress(query);
        },
        selectObjectType(isSelected, type) {
            this.form.object_type = this.form.object_type.filter(item => item !== type);
            if (isSelected) {
                this.form.object_type.push(type);
            }
        }
    },
    created() {
        if (this.floor) {
            this.form = cloneObject(this.floor);
            this.normalizeForm(this.arrayParams);
        }
    }
};
</script>
