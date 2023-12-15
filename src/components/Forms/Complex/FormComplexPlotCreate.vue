<template>
    <div class="plot-create-form">
        <Modal
            @close="$emit('close')"
            :title="false ? 'Редактирование участка' : 'Создание участка'"
            classes="autosize"
        >
            <Loader v-if="loader" class="center" />
            <Form @submit="onSubmit" class="center autosize">
                <Tabs
                    :options="{ useUrlFragment: false, defaultTabHash: 'main' }"
                    nav-class="plot-create-form__tab-list"
                    nav-item-link-class="plot-create-form__tab-link"
                >
                    <Tab id="main" name="Основное">
                        <FormGroup class="mb-1 plot-create-form__form-group plot-create-form__form-group_long">
                            <MultiSelect
                                v-model="form.address"
                                @change="onChangeAddress"
                                extra-classes="long-text"
                                label="Адрес строения"
                                required
                                class="col-6 pr-1"
                                :filterResults="false"
                                :min-chars="1"
                                :resolve-on-load="true"
                                :delay="500"
                                :searchable="true"
                                :v="v$.form.address"
                                :options="
                                    async query => {
                                        return await searchAddress(query);
                                    }
                                "
                            />
                        </FormGroup>
                        <FormGroup class="mb-1 plot-create-form__form-group plot-create-form__form-group_long">
                            <MultiSelect
                                v-model="form.company_id"
                                @change="onChangeCompany"
                                extra-classes="long-text"
                                label="Компания"
                                required
                                class="col-6 pr-1"
                                :v="v$.form.company_id"
                                :filterResults="false"
                                :min-chars="1"
                                :resolve-on-load="true"
                                :delay="500"
                                :searchable="true"
                                :options="
                                    async query => {
                                        return await searchCompany(query);
                                    }
                                "
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <CheckboxIcons
                                v-model="form.purposes"
                                @extraSelect="selectObjectType"
                                label="Тип объекта"
                                extra-label="склад"
                                :no-all-select="true"
                                :extra-value="3"
                                :extra-options="form.object_type"
                                class="col-12 pr-2 mx-auto"
                                :options="[]"
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Checkbox v-model="form.test_only" label="Тестовый лот" class="col large text-center" />
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
                            <Input v-model="form.land_length" label="Длина участка" class="col-4 px-1" type="number" />
                            <Input v-model="form.land_width" label="Ширина участка" class="col-4 pl-1" type="number" />
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
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                            <Radio
                                v-model="form.first_line"
                                label="Первая линия"
                                class="col-4 pl-1"
                                required
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Textarea v-model="form.field_allow_usage" label="В.Р.И" class="col-12 px-0" />
                        </FormGroup>
                        <p class="plot-create-form__label">Коммуникации</p>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.power"
                                label="Электроснаб."
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                                required
                            />
                            <Input
                                v-if="form.power"
                                v-model="form.power_value"
                                label="Значение"
                                :v="v$.form.power_value"
                                class="col-4 px-1"
                                type="number"
                                required
                            />
                            <p v-if="form.power" class="col-1 plot-create-form__text pr-2">кВт</p>
                            <Radio
                                v-model="form.heating_central"
                                label="Центр. отоплен."
                                class="col-4 pl-3"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                                required
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.water"
                                label="Водоснабжен."
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                                required
                            />
                            <Input
                                v-if="form.water"
                                v-model="form.water_value"
                                label="Значение"
                                :v="v$.form.water_value"
                                class="col-4 px-1"
                                type="number"
                                required
                            />
                            <p v-if="form.water" class="col-1 plot-create-form__text pr-2">м<sup>3</sup>/сут</p>
                            <MultiSelect
                                v-if="form.water"
                                v-model="form.water_type"
                                :v="v$.form.water_type"
                                title="Тип"
                                label="Тип"
                                class="col-4 pl-3"
                                required
                                :options="waterTypeOptions"
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.sewage_central"
                                label="Канализ. центр."
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                                required
                            />
                            <Input
                                v-if="form.sewage_central"
                                v-model="form.sewage_central_value"
                                label="Значение"
                                :v="v$.form.sewage_central_value"
                                class="col-4 px-1"
                                type="number"
                                required
                            />
                            <p v-if="form.sewage_central" class="col-1 plot-create-form__text pr-2">
                                м<sup>3</sup>/сут
                            </p>
                            <Radio
                                v-model="form.sewage_rain"
                                label="Канализ. ливн."
                                class="col-4 pl-3"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.gas"
                                label="Газ"
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                            <Input
                                v-if="form.gas"
                                v-model="form.gas_value"
                                :v="v$.form.gas_value"
                                label="Значение"
                                class="col-4 px-1"
                                type="number"
                                required
                            />
                            <p v-if="form.gas" class="col-1 plot-create-form__text pr-2">м<sup>3</sup>/час</p>
                            <MultiSelect
                                v-if="form.gas"
                                v-model="form.gas_type"
                                :v="v$.form.gas_type"
                                title="Тип"
                                label="Тип"
                                class="col-4 pl-3"
                                required
                                :options="gasTypeOptions"
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.steam"
                                label="Пар"
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                            <Input
                                v-if="form.steam"
                                v-model="form.steam_value"
                                :v="v$.form.steam_value"
                                label="Значение"
                                class="col-4 px-1"
                                type="number"
                                required
                            />
                            <p v-if="form.steam" class="col-1 plot-create-form__text pr-2">бар</p>
                            <Radio
                                v-model="form.phone_line"
                                label="Телефония"
                                class="col-4 pl-3"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.internet"
                                label="Интернет"
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                            <MultiSelect
                                v-if="form.internet"
                                v-model="form.internet_type"
                                :v="v$.form.internet_type"
                                title="Тип"
                                label="Тип"
                                class="col-4 px-1"
                                required
                                :options="internetTypeOptions"
                            />
                        </FormGroup>
                        <p class="plot-create-form__label">Безопасность</p>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.guard"
                                label="Охрана объекта"
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                            <MultiSelect
                                v-if="form.guard"
                                v-model="form.guard_type"
                                title="Тип"
                                label="Тип"
                                class="col-4 pl-1 pr-3"
                                required
                                :options="guardTypeOptions"
                            />
                            <Radio
                                v-model="form.video_control"
                                label="Видеонаблюдение"
                                class="col-3"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.access_control"
                                label="Контроль доступа"
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                            <Radio
                                v-model="form.security_alert"
                                label="Охран. сигнализ."
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                            <Radio
                                v-model="form.barrier"
                                label="Шлагбаум"
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                            <Radio
                                v-model="form.fence_around_perimeter"
                                label="Забор по перим."
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                        </FormGroup>
                        <p class="plot-create-form__label">Ж/Д на территории</p>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.railway"
                                label="Ж/Д ветка"
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                                required
                            />
                            <Input
                                v-if="form.railway"
                                v-model="form.railway_value"
                                label="Значение"
                                :v="v$.form.railway_value"
                                class="col-4 px-1"
                                type="number"
                                required
                            />
                            <p v-if="form.railway" class="col-1 plot-create-form__text pr-2">м</p>
                        </FormGroup>
                        <p class="plot-create-form__label">Инфраструктура</p>
                        <FormGroup class="mb-1">
                            <MultiSelect
                                v-model="form.entry_territory_type"
                                title="Въезд на территорию"
                                label="Въезд на террит."
                                class="col-4 pr-1"
                                :options="entryTerritoryTypeOptions"
                            />
                            <MultiSelect
                                v-model="form.entrance_type"
                                title="Плата за въезд"
                                label="Плата за въезд"
                                class="col-4 pl-1"
                                :options="feeTypeOptions"
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.parking_car"
                                label="P легковая"
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                            <MultiSelect
                                v-if="form.parking_car"
                                v-model="form.parking_car_value"
                                :v="v$.form.parking_car_value"
                                title="Тип"
                                label="Тип"
                                class="col-4 px-1"
                                required
                                :options="feeTypeOptions"
                            />
                            <Radio
                                v-model="form.canteen"
                                label="Столовая/Кафе"
                                class="col-3 pl-3"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.parking_lorry"
                                label="P 3-10 тонн"
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                            <MultiSelect
                                v-if="form.parking_lorry"
                                v-model="form.parking_lorry_value"
                                :v="v$.form.parking_lorry_value"
                                title="Тип"
                                label="Тип"
                                class="col-4 px-1"
                                required
                                :options="feeTypeOptions"
                            />
                            <Radio
                                v-model="form.hostel"
                                label="Общежитие"
                                class="col-3 pl-3"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.parking_truck"
                                label="P грузовая"
                                class="col-3 pr-1"
                                :options="[
                                    [0, 'нет'],
                                    [1, 'да']
                                ]"
                            />
                            <MultiSelect
                                v-if="form.parking_truck"
                                v-model="form.parking_truck_value"
                                :v="v$.form.parking_truck_value"
                                title="Тип"
                                label="Тип"
                                class="col-4 px-1"
                                required
                                :options="feeTypeOptions"
                            />
                        </FormGroup>
                    </Tab>
                    <Tab name="Описание">
                        <Textarea v-model="form.description" label="Описание" class="col-12 px-0" />
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
                <FormGroup class="mt-1 mb-4">
                    <Submit class="col-4 mx-auto"> Сохранить</Submit>
                </FormGroup>
            </Form>
        </Modal>
    </div>
</template>

<script>
import { helpers, minValue, required } from '@vuelidate/validators';
import { ComplexFormMixin } from '@/components/Forms/Complex/mixin';
import { mapActions } from 'vuex';
import { yandexmap } from '@/utils';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import {
    entryTerritoryTypes,
    feeTypes,
    gasTypes,
    guardTypes,
    internetTypes,
    landCategoryTypes,
    landscapeTypes,
    ownTypesLand,
    waterTypes
} from '@/const/types';

export default {
    name: 'FormComplexPlotCreate',
    components: { Modal, Loader },
    mixins: [ComplexFormMixin],
    data() {
        return {
            form: {
                address: null,
                company_id: null,
                object_type: [],
                purposes: [],
                test_only: null,
                area_field_full: null,
                land_length: null,
                land_width: null,
                own_type_land: null,
                land_category: null,
                landscape_type: null,
                cadastral_number_land: null,
                first_line: null,
                field_allow_usage: null,
                power: null,
                power_value: null,
                sewage_central: null,
                sewage_central_value: null,
                sewage_rain: null,
                water: null,
                water_value: null,
                water_type: null,
                gas: null,
                gas_value: null,
                gas_type: null,
                steam: null,
                steam_value: null,
                phone_line: null,
                internet: null,
                internet_type: null,
                guard: null,
                guard_type: null,
                video_control: null,
                access_control: null,
                security_alert: null,
                barrier: null,
                fence_around_perimeter: null,
                railway: null,
                railway_value: null,
                entry_territory: null,
                entry_territory_type: null,
                entrance_type: null,
                parking_car: null,
                parking_car_value: null,
                parking_lorry: null,
                parking_lorry_value: null,
                parking_truck: null,
                parking_truck_value: null,
                canteen: null,
                hostel: null,
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
                photosList: []
            }
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
                cadastral_number_land: {
                    required: helpers.withMessage('заполните поле', required)
                },
                first_line: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                area_field_full: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                own_type_land: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                landscape_type: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                power: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                power_value: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                heating_central: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                water: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                water_value: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                water_type: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                sewage_central: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                sewage_central_value: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                gas: {},
                gas_value: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                gas_type: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                steam_value: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                internet_type: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                guard_type: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                parking_car_value: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                parking_lorry_value: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                parking_truck_value: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                railway_value: {
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                }
            }
        };
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
    computed: {
        ownTypeLandOptions() {
            return Object.values(ownTypesLand);
        },
        landCategoryOptions() {
            return Object.values(landCategoryTypes);
        },
        landscapeTypeOptions() {
            return Object.values(landscapeTypes);
        },
        waterTypeOptions() {
            return Object.values(waterTypes);
        },
        gasTypeOptions() {
            return Object.values(gasTypes);
        },
        internetTypeOptions() {
            return Object.values(internetTypes);
        },
        guardTypeOptions() {
            return Object.values(guardTypes);
        },
        feeTypeOptions() {
            return Object.values(feeTypes);
        },
        entryTerritoryTypeOptions() {
            return Object.values(entryTerritoryTypes);
        }
    }
};
</script>