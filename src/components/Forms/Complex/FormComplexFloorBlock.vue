<template>
    <Modal
        @close="$emit('close')"
        :title="section ? 'Редактирование блока' : 'Добавление блока'"
        class="modal-form-floor-block"
    >
        <Loader v-if="loader" class="center" />
        <Form @submit="onSubmit">
            <Tabs
                :options="{ useUrlFragment: false, defaultTabHash: 'main' }"
                nav-class="create-floor-block-form__tab-list"
                nav-item-link-class="create-floor-block-form__tab-link"
            >
                <Tab id="main" name="Характеристики">
                    <FormGroup>
                        <DoubleInput
                            v-model:first="form.area_floor_min"
                            v-model:second="form.area_floor_max"
                            label="S пола"
                            class="col-md-4 col-6"
                            type="number"
                            unit="м<sup>2</sup>"
                            required
                            :v-first="v$.form.area_floor_min"
                            :v-second="v$.form.area_floor_max"
                            :validators="formAreaFloorValidators"
                        />
                        <DoubleInput
                            v-model:first="form.area_office_min"
                            v-model:second="form.area_office_max"
                            label="S офисов"
                            class="col-md-4 col-6"
                            type="number"
                            unit="м<sup>2</sup>"
                            :validators="formAreaOfficeValidators"
                        />
                        <DoubleInput
                            v-model:first="form.area_tech_min"
                            v-model:second="form.area_tech_max"
                            label="S техническая"
                            class="col-md-4 col-6"
                            type="number"
                            unit="м<sup>2</sup>"
                            :validators="formAreaTechValidators"
                        />
                    </FormGroup>
                    <FormGroup>
                        <DoubleInput
                            v-model:first="form.ceiling_height_min"
                            v-model:second="form.ceiling_height_max"
                            label="Высота потолков"
                            class="col-md-4 col-6"
                            type="number"
                            unit="м"
                            required
                            :v-first="v$.form.ceiling_height_min"
                            :v-second="v$.form.ceiling_height_max"
                            :validators="formCeilingHeightValidators"
                        />
                        <DoubleInput
                            v-model:first="form.load_floor_min"
                            v-model:second="form.load_floor_max"
                            label="Нагрузка на пол"
                            class="col-md-4 col-6"
                            type="number"
                            unit="т/м<sup>2</sup>"
                            required
                            :v-first="v$.form.load_floor_min"
                            :v-second="v$.form.load_floor_max"
                            :validators="formLoadFloorValidators"
                        />
                        <DoubleInput
                            v-model:first="form.temperature_min"
                            v-model:second="form.temperature_max"
                            label="Температурный режим"
                            class="col-md-4 col-6"
                            type="number"
                            unit="°С"
                            :validators="formTemperatureValidators"
                        />
                    </FormGroup>
                    <FormGroup>
                        <!--                        <MultiSelect-->
                        <!--                            v-model="form.floor_types"-->
                        <!--                            :v="v$.form.floor_types"-->
                        <!--                            required-->
                        <!--                            title="Типы пола"-->
                        <!--                            label="Типы пола"-->
                        <!--                            mode="multiple"-->
                        <!--                            multiple-->
                        <!--                            :close-on-select="false"-->
                        <!--                            class="col-4"-->
                        <!--                            :options="floorTypeOptions"-->
                        <!--                        />-->
                        <!--                        <MultiSelect-->
                        <!--                            v-model="form.column_grids"-->
                        <!--                            :v="v$.form.column_grids"-->
                        <!--                            required-->
                        <!--                            title="Сетки колонн"-->
                        <!--                            label="Сетки колонн"-->
                        <!--                            :close-on-select="false"-->
                        <!--                            class="col-4"-->
                        <!--                            mode="multiple"-->
                        <!--                            multiple-->
                        <!--                            :options="gridColumnTypeOptions"-->
                        <!--                        />-->
                        <MultiSelect
                            v-model="form.entrance_block"
                            title="Вход в блок"
                            label="Вход в блок"
                            class="col-4"
                            :options="entranceBlockTypeOptions"
                        />
                    </FormGroup>
                    <FormGroup>
                        <MultiSelect
                            v-model="form.gatesType"
                            :v="v$.form.gatesType"
                            title="Тип ворот"
                            label="Тип ворот"
                            class="col-4"
                            :options="gateTypeOptions"
                            required
                        />
                        <Input
                            v-model="form.gatesCount"
                            :v="v$.form.gatesCount"
                            label="Количество"
                            class="col-2"
                            type="number"
                            unit="шт"
                            required
                        />
                    </FormGroup>
                    <FormGroup class="mt-2">
                        <CheckboxIcons
                            v-model="form.purposes_block"
                            label="Назначение блока"
                            :no-all-select="true"
                            class="col-12 mx-auto"
                            :options="blockPossiblePurposes"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Textarea v-model="form.description" label="Описание" class="col-12" />
                    </FormGroup>
                </Tab>
                <Tab name="Оборудование/Коммуникации">
                    <p class="form__block">Оборудование</p>
                    <FormGroup class="mt-1">
                        <RadioGroup v-model="form.racks" class="col-3" label="Стеллажи" unselect />
                        <AnimationTransition>
                            <!--                            <MultiSelect-->
                            <!--                                v-if="form.racks"-->
                            <!--                                v-model="form.rack_types"-->
                            <!--                                :v="v$.form.rack_types"-->
                            <!--                                title="Типы стеллажей"-->
                            <!--                                label="Типы стеллажей"-->
                            <!--                                :close-on-select="false"-->
                            <!--                                class="col-5"-->
                            <!--                                mode="multiple"-->
                            <!--                                multiple-->
                            <!--                                :options="rackTypeOptions"-->
                            <!--                            />-->
                        </AnimationTransition>
                        <Input
                            v-model="form.rack_levels"
                            :v="v$.form.rack_levels"
                            label="Количество ярусов"
                            class="col-3"
                            type="number"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.charging_room"
                            class="col-3"
                            label="Зарядная комната"
                            unselect
                        />
                        <DoubleInput
                            v-model:first="form.pallet_place_min"
                            v-model:second="form.pallet_place_max"
                            label="Паллет места"
                            class="col-md-6 col-12"
                            type="number"
                            unit="п. м."
                            :validators="formAreaFloorValidators"
                        />
                    </FormGroup>
                    <p class="form__block">Коммуникации</p>
                    <FormGroup class="mt-1">
                        <Input
                            v-if="form"
                            v-model="form.power"
                            :v="v$.form.power"
                            label="Электричество"
                            class="col-2"
                            type="number"
                            unit="кВт"
                            required
                        />
                        <!--                        <MultiSelect-->
                        <!--                            v-model="form.lighting"-->
                        <!--                            :v="v$.form.lighting"-->
                        <!--                            title="Освещение"-->
                        <!--                            label="Освещение"-->
                        <!--                            :close-on-select="false"-->
                        <!--                            class="col-6"-->
                        <!--                            mode="multiple"-->
                        <!--                            multiple-->
                        <!--                            :options="lightingTypeOptions"-->
                        <!--                        />-->
                        <MultiSelect
                            v-model="form.ventilation"
                            :v="v$.form.ventilation"
                            title="Вентиляция"
                            label="Вентиляция"
                            class="col-4"
                            :options="ventilationTypeOptions"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.heated"
                            class="col-3"
                            label="Отапливаемый"
                            :v="v$.form.heated"
                            required
                        />
                        <RadioGroup
                            v-model="form.water"
                            class="col-3"
                            label="Водоснабжение"
                            :v="v$.form.water"
                            required
                        />
                        <RadioGroup
                            v-model="form.sewage"
                            class="col-3"
                            label="Канализация"
                            :v="v$.form.sewage"
                            required
                        />
                        <RadioGroup
                            v-model="form.climate_control"
                            class="col-3"
                            label="Климат. контроль"
                            unselect
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.gas"
                            class="col-3"
                            label="Газ для пр-ва"
                            unselect
                        />
                        <RadioGroup
                            v-model="form.steam"
                            class="col-3"
                            label="Пар для пр-ва"
                            unselect
                        />
                        <RadioGroup
                            v-model="form.phone_line"
                            class="col-3"
                            label="Телефония"
                            unselect
                        />
                        <RadioGroup
                            v-model="form.internet"
                            class="col-3"
                            label="Интернет"
                            unselect
                        />
                    </FormGroup>
                </Tab>
                <Tab name="Безопасность/Подъемники">
                    <p class="form__block">Безопасность</p>
                    <FormGroup class="mt-1">
                        <MultiSelect
                            v-model="form.firefighting_type"
                            :v="v$.form.firefighting_type"
                            title="Пожаротушение"
                            label="Пожаротушение"
                            class="col-4"
                            required
                            :options="firefightingTypeOptions"
                        />
                        <RadioGroup
                            v-model="form.smoke_exhaust"
                            class="col-3"
                            label="Дымоудаление"
                            unselect
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.video_control"
                            class="col-3"
                            label="Видеонаблюдение"
                            unselect
                        />
                        <RadioGroup
                            v-model="form.access_control"
                            class="col-3"
                            label="Контроль доступа"
                            unselect
                        />
                        <RadioGroup
                            v-model="form.security_alert"
                            label="Охранная сигнализация"
                            class="col-3"
                        />
                        <RadioGroup
                            v-model="form.fire_alert"
                            label="Пожарная сигнализация"
                            class="col-3"
                        />
                    </FormGroup>
                    <p class="form__block">Подъемные устройства</p>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.has_elevators"
                            label="Лифт/подъемники"
                            class="col-3"
                        />
                        <RadioGroup
                            v-model="form.has_cranes"
                            label="Крановые устройства"
                            class="col-3"
                        />
                        <RadioGroup
                            v-model="form.cranes_runways"
                            label="Подкрановые пути"
                            class="col-3"
                        />
                    </FormGroup>
                </Tab>
                <Tab name="Фотографии">
                    <FormGroup>
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
                    <FormGroup>
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
            <FormGroup>
                <Submit class="col-4 mx-auto">Сохранить</Submit>
            </FormGroup>
        </Form>
    </Modal>
</template>

<script>
import { ComplexFormMixin } from '@/components/Forms/Complex/mixin';
import {
    entranceBlockTypes,
    firefightingTypes,
    floorTypes,
    gateTypes,
    gridColumnTypes,
    lightingTypes,
    objectPurposes,
    rackTypes,
    ventilationTypes
} from '@/const/types';
import { helpers, minValue, required } from '@vuelidate/validators';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import {
    areaRangeValidators,
    ceilingHeightValidators,
    loadFloorValidators,
    temperatureValidators
} from '@//validators/fields';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import RadioGroup from '@/components/common/Forms/RadioGroup.vue';

export default {
    name: 'FormComplexFloorBlock',
    components: { RadioGroup, AnimationTransition, DoubleInput, Modal, Loader },
    mixins: [ComplexFormMixin],
    emits: ['close'],
    props: {
        object: {
            type: Object,
            required: true
        },
        section: {
            type: Object,
            default: null
        },
        floor: {
            type: Object,
            default: null
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
            }
        };
    },
    validations() {
        return {
            form: {
                area_floor_min: {
                    required: helpers.withMessage('Заполните поле', required)
                },
                area_floor_max: {
                    required: helpers.withMessage('Заполните поле', required)
                },
                ceiling_height_min: {
                    required: helpers.withMessage('Заполните поле', required)
                },
                ceiling_height_max: {
                    required: helpers.withMessage('Заполните поле', required)
                },
                load_floor_min: {
                    required: helpers.withMessage('Заполните поле', required)
                },
                load_floor_max: {
                    required: helpers.withMessage('Заполните поле', required)
                },
                floor_types: {
                    required: helpers.withMessage('Выберите один или несколько вариантов', required)
                },
                column_grids: {
                    required: helpers.withMessage('Выберите один или несколько вариантов', required)
                },
                racks: {
                    required: helpers.withMessage('Выберите один из вариантов', required)
                },
                rack_levels: {
                    minValue: helpers.withMessage('Значение должно быть больше 0', minValue(1))
                },
                power: {
                    minValue: helpers.withMessage('Значение должно быть больше 0', minValue(1))
                },
                gatesType: {
                    required: helpers.withMessage('Выберите один или несколько вариантов', required)
                },
                gatesCount: {
                    required: helpers.withMessage('Заполните поле', required),
                    minValue: helpers.withMessage('Значение должно быть больше 0', minValue(1))
                },
                heated: {
                    required: helpers.withMessage('Выберите один из вариантов', required)
                },
                water: {
                    required: helpers.withMessage('Выберите один из вариантов', required)
                },
                sewage: {
                    required: helpers.withMessage('Выберите один из вариантов', required)
                },
                firefighting_type: {
                    required: helpers.withMessage('Выберите один из вариантов', required)
                }
            }
        };
    },
    computed: {
        blockPossiblePurposes() {
            const result = [];
            for (const purpose in objectPurposes) {
                if (this.object.purposes.find(el => el == purpose)) {
                    result.push({ id: purpose, ...objectPurposes[purpose] });
                }
            }
            return result;
        },
        floorTypeOptions() {
            return Object.values(floorTypes);
        },
        gridColumnTypeOptions() {
            return Object.values(gridColumnTypes);
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
        },
        formAreaFloorValidators() {
            return areaRangeValidators(this.form.area_floor_max);
        },
        formAreaOfficeValidators() {
            return areaRangeValidators(this.form.area_office_max);
        },
        formAreaTechValidators() {
            return areaRangeValidators(this.form.area_tech_max);
        },
        formCeilingHeightValidators() {
            return ceilingHeightValidators(this.form.ceiling_height_max);
        },
        formLoadFloorValidators() {
            return loadFloorValidators(this.form.load_floor_max);
        },
        formTemperatureValidators() {
            return temperatureValidators(this.form.temperature_max);
        }
    },
    created() {
        if (this.section !== null) {
            // eslint-disable-next-line no-undef
            this.form = { ...this.form, ...structuredClone(this.section) };
        }
    }
};
</script>
