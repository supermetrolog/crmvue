<template>
    <Modal
        @close="$emit('close')"
        class="modal-form-complex"
        :title="complex ? 'Редактирование комплекса' : 'Добавление комплекса'"
        has-tabs
    >
        <Loader v-if="loader" class="center" />
        <Form @submit="onSubmit">
            <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="main" name="Основное">
                    <div class="row">
                        <Input
                            v-model.trim="form.title"
                            :placeholder="complex && !form.title ? 'Без названия' : ''"
                            :v="v$.form.title"
                            label="Название"
                            class="col-6"
                        />
                        <MultiSelect
                            v-model="form.address"
                            :title="form.address"
                            extra-classes="long-text"
                            label="Адрес комплекса"
                            class="col-6"
                            :filterResults="false"
                            :min-chars="1"
                            :resolve-on-load="!!complex"
                            :delay="0"
                            :searchable="true"
                            :v="v$.form.address"
                            required
                            :options="
                                async query => {
                                    return await getAddress(query);
                                }
                            "
                        />
                    </div>
                </Tab>
                <Tab name="Характеристики">
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
                        <Input
                            v-model="form.area_buildings_full"
                            :v="v$.form.area_buildings_full"
                            label="S - строений комплекса"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                        />
                        <Input
                            v-model="form.buildings_admin_num"
                            :v="v$.form.buildings_admin_num"
                            label="Количество адм. строений"
                            class="col-4"
                            type="number"
                        />
                        <Input
                            v-model="form.buildings_industry_num"
                            :v="v$.form.buildings_industry_num"
                            label="Количество склад. строений"
                            class="col-4"
                            type="number"
                        />
                        <MultiSelect
                            v-model="form.buildings_help_num"
                            label="Количество вспом. строений"
                            class="col-4"
                            :options="countOptions"
                        />
                        <MultiSelect
                            v-model="form.owners_num"
                            label="Собственников на комплексе"
                            class="col-4"
                            type="number"
                            :options="countOptions"
                        />
                        <Input
                            v-model="form.from_mkad"
                            label="Удаленность от МКАД"
                            class="col-md-4 col-12"
                            unit="км"
                            type="number"
                            :v="v$.form.from_mkad"
                        />
                        <RadioGroup
                            v-model="form.managment_company"
                            class="col-4"
                            label="Управляющая компания"
                            unselect
                        />
                    </div>
                </Tab>
                <Tab name="Коммуникации">
                    <FormGroup>
                        <RadioGroup
                            v-model="form.power"
                            class="col-3"
                            label="Электроснабжение"
                            required
                        />
                        <Input
                            v-model="form.power_value"
                            :disabled="!form.power"
                            class="col-4"
                            label="Электричество"
                            unit="кВт"
                            type="number"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.heating_autonomous"
                            class="col-3"
                            label="Отопление авт."
                            required
                        />
                        <MultiSelect
                            v-model="form.heating_autonomous_type"
                            :disabled="!form.heating_autonomous"
                            :options="heatingAutonomousTypes"
                            class="col-4"
                            label="Вид отопления"
                        />
                        <RadioGroup
                            v-model="form.heating_central"
                            class="col-3"
                            label="Центральное отопление"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.water"
                            class="col-3"
                            label="Водоснабжение"
                            required
                        />
                        <MultiSelect
                            v-model="form.water_type"
                            :options="waterTypes"
                            :disabled="!form.water"
                            class="col-4"
                            label="Вид водоснабжения"
                        />
                        <Input
                            v-model="form.water_value"
                            class="col-4"
                            :disabled="!form.water"
                            label="Измерение водоснабжения"
                            unit="м<sup>3</sup>/сут"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.sewage"
                            class="col-3"
                            label="Канализ. центр."
                            required
                        />
                        <Input
                            v-model="form.sewage_value"
                            class="col-4"
                            :disabled="!form.sewage"
                            label="Измерение канализ. центр."
                            unit="м<sup>3</sup>/сут"
                        />
                        <RadioGroup
                            v-model="form.sewage_rain"
                            class="col-3"
                            label="Канализация ливневая"
                            unselect
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup v-model="form.gas" class="col-3" label="Газ" unselect />
                        <MultiSelect
                            v-model="form.gas_type"
                            :disabled="!form.gas"
                            :options="gasTypes"
                            class="col-4"
                            label="Тип газа"
                        />
                        <Input
                            v-model="form.gas_value"
                            :disabled="!form.gas"
                            class="col-4"
                            label="Измерение газа"
                            unit="м<sup>3</sup>час"
                            type="number"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup v-model="form.steam" class="col-3" label="Пар" unselect />
                        <Input
                            v-model="form.steam_value"
                            :disabled="!form.steam"
                            class="col-4"
                            label="Измерение пара"
                            unit="бар"
                            type="number"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.internet"
                            class="col-3"
                            label="Интернет"
                            unselect
                        />
                        <MultiSelect
                            v-model="form.internet_type"
                            :disabled="!form.internet"
                            class="col-4"
                            :options="internetTypes"
                            label="Тип интернета"
                        />
                        <RadioGroup
                            v-model="form.phone_line"
                            class="col-3"
                            label="Телефония"
                            unselect
                        />
                    </FormGroup>
                </Tab>
                <Tab name="Безопасность/Инфраструктура">
                    <p class="form__block">Безопасность</p>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.video_control"
                            class="col-3"
                            label="Видеонаблюдение"
                            unselect
                        />
                        <RadioGroup
                            v-model="form.guard"
                            class="col-3"
                            label="Охрана объекта"
                            unselect
                        />
                        <MultiSelect
                            v-model="form.guard_type"
                            :disabled="!form.guard"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            required
                            :options="guardTypeOptions"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.access_control"
                            class="col-3"
                            label="Контроль доступа"
                            unselect
                        />
                        <RadioGroup
                            v-model="form.security_alert"
                            class="col-3"
                            label="Охран. сигнализ."
                            unselect
                        />
                        <RadioGroup
                            v-model="form.barrier"
                            class="col-3"
                            label="Шлагбаум"
                            unselect
                        />
                        <RadioGroup
                            v-model="form.fence_around_perimeter"
                            class="col-3"
                            label="Забор по перим."
                            unselect
                        />
                    </FormGroup>
                    <p class="form__block">Железнодорожное сообщение</p>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.railway"
                            class="col-3"
                            label="Ж/Д ветка"
                            unselect
                        />
                        <Input
                            v-model="form.railway_value"
                            :disabled="!form.railway"
                            label="Значение"
                            :v="v$.form.railway_value"
                            class="col-4"
                            type="number"
                            unit="м"
                        />
                    </FormGroup>
                    <p class="form__block">Инфраструктура</p>
                    <FormGroup>
                        <MultiSelect
                            v-model="form.entry_territory_type"
                            :options="entryTerritoryTypeOptions"
                            class="col-4"
                            label="Въезд на территорию"
                        />
                        <MultiSelect
                            v-model="form.entry_territory"
                            title="Плата за въезд"
                            label="Плата за въезд"
                            class="col-4"
                            :options="feeTypeOptions"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.parking_car"
                            class="col-3"
                            label="«P» легковая"
                            unselect
                        />
                        <MultiSelect
                            v-model="form.parking_car_value"
                            :disabled="!form.parking_car"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            :options="feeTypeOptions"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.parking_lorry"
                            class="col-3"
                            label="«P» 3-10 тонн"
                            unselect
                        />
                        <MultiSelect
                            v-model="form.parking_lorry_value"
                            :disabled="!form.parking_lorry"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            :options="feeTypeOptions"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.parking_truck"
                            class="col-3"
                            label="«P» грузовая"
                            unselect
                        />
                        <MultiSelect
                            v-model="form.parking_truck_value"
                            :disabled="!form.parking_truck"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            :options="feeTypeOptions"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioGroup
                            v-model="form.canteen"
                            class="col-3"
                            label="Столовая/Кафе"
                            unselect
                        />
                        <RadioGroup
                            v-model="form.hostel"
                            class="col-3"
                            label="Общежитие"
                            unselect
                        />
                    </FormGroup>
                </Tab>
                <Tab name="Документы">
                    <div class="row">
                        <FileInput
                            v-model:native="form.layoutsList"
                            v-model:data="form.layouts"
                            label="Планировки"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                    <div class="row mt-2">
                        <FileInput
                            v-model:native="form.presentationsList"
                            v-model:data="form.presentations"
                            label="Презентации"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                    <div class="row mt-2">
                        <FileInput
                            v-model:native="form.ownerShipDocumentsList"
                            v-model:data="form.ownerShipDocuments"
                            label="Документы на собственность"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                </Tab>
            </Tabs>
            <div class="row mb-2">
                <Submit class="col-3 mx-auto" small success>Сохранить</Submit>
            </div>
        </Form>
    </Modal>
</template>

<script>
import { helpers, maxValue, minValue, required } from '@vuelidate/validators';
import { cloneObject, yandexmap } from '@/utils';
import Loader from '@/components/common/Loader.vue';
import { ComplexFormMixin } from '@/components/Forms/Complex/mixin';
import Modal from '@/components/common/Modal.vue';
import {
    countTypes,
    entryTerritoryTypes,
    feeTypes,
    gasTypes,
    guardTypes,
    heatingAutonomousTypes,
    internetTypes,
    waterTypes
} from '@/const/types';
import RadioGroup from '@/components/common/Forms/RadioGroup.vue';

export default {
    name: 'FormComplex',
    components: { RadioGroup, Modal, Loader },
    mixins: [ComplexFormMixin],
    emits: ['close'],
    props: {
        complex: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            form: {
                address: null,
                from_mkad: null,
                area_buildings_full: null,
                area_field_full: null,
                title: null,
                buildings_admin_num: null,
                buildings_industry_num: null,
                buildings_help_num: null,
                owners_num: null,
                managment_company: null,
                power: null,
                power_value: null,
                heating_autonomous: null,
                heating_autonomous_type: null,
                heating_central: null,
                water: null,
                water_type: null,
                water_value: null,
                sewage: null,
                sewage_value: null,
                sewage_rain: null,
                gas: null,
                gas_value: null,
                steam: null,
                steam_value: null,
                internet: null,
                internet_type: null,
                phone_line: null,
                video_control: null,
                guard: null,
                guard_type: null,
                access_control: null,
                security_alert: null,
                barrier: null,
                fence_around_perimeter: null,
                railway: null,
                railway_value: null,
                entry_territory_type: null,
                entry_territory: null,
                parking_car: null,
                parking_car_value: null,
                parking_lorry: null,
                parking_lorry_value: null,
                parking_truck: null,
                parking_truck_value: null,
                canteen: null,
                hostel: null,
                photosList: [],
                photos: []
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
        entryTerritoryTypes() {
            return entryTerritoryTypes;
        },
        countOptions: () => countTypes,
        internetTypes: () => internetTypes,
        gasTypes: () => gasTypes,
        waterTypes: () => waterTypes,
        heatingAutonomousTypes: () => heatingAutonomousTypes,
        guardTypeOptions: () => guardTypes,
        feeTypeOptions: () => feeTypes,
        entryTerritoryTypeOptions: () => entryTerritoryTypes
    },
    methods: {
        async searchCompany() {
            return ['ОАО Тореадор', 'ЗАО ИнкЛомМет'];
        },
        async getAddress(query) {
            if (this.complex) return await yandexmap.getAddress(query, this.complex.address);
            return await yandexmap.getAddress(query);
        }
    },
    created() {
        if (this.complex) {
            this.form = { ...this.form, ...cloneObject(this.complex) };
        }
    }
};
</script>
