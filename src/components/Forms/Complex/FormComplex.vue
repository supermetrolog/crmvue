<template>
    <Modal
        @close="$emit('close')"
        show
        :title="complex ? 'Редактирование комплекса' : 'Добавление комплекса'"
        has-tabs
        width="1200"
    >
        <Loader v-if="isLoading" />
        <Form @submit="onSubmit">
            <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="main" name="Основное">
                    <div class="row mb-2">
                        <Input
                            v-model.trim="form.title"
                            :v="v$.form.title"
                            :placeholder="complex && !form.title ? 'Без названия' : ''"
                            :disabled="form.title_novalue"
                            :required="!form.title_novalue"
                            label="Название"
                            class="col-6"
                        />
                        <MultiSelect
                            v-model="form.address"
                            :v="v$.form.address"
                            :title="form.address"
                            placeholder="Введите адрес.."
                            extra-classes="long-text"
                            :filterResults="false"
                            :min-chars="1"
                            :resolve-on-load="!!complex"
                            :delay="0"
                            :searchable="true"
                            required
                            label="Адрес комплекса"
                            class="col-6"
                            :options="
                                async query => {
                                    return await getAddress(query);
                                }
                            "
                        />
                        <div class="col-6">
                            <Switch v-model="form.title_novalue" true-title="Без названия" />
                        </div>
                        <div class="col-6">
                            <Switch
                                v-model="locationIsMetro"
                                false-title="Город"
                                true-title="Метро"
                            />
                        </div>
                    </div>
                    <div class="row mb-2">
                        <Input
                            v-model="form.from_mkad"
                            :v="v$.form.from_mkad"
                            label="Удаленность от МКАД"
                            class="col-md-4 col-12"
                            unit="км"
                            type="number"
                            :disabled="form.from_mkad_novalue"
                            :required="!form.from_mkad_novalue"
                        />
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <Switch
                                v-model="form.from_mkad_novalue"
                                @change="onChangeFromMkadNoValue"
                                true-title="Неприменимо (регион или Москва внутри МКАД)"
                            />
                        </div>
                    </div>
                </Tab>
                <Tab name="Характеристики">
                    <div class="row mb-2">
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
                            :v="v$.form.buildings_industry_num"
                            label="Количество вспом. строений"
                            class="col-4"
                            :options="countTypes"
                        />
                        <MultiSelect
                            v-model="form.owners_num"
                            label="Собственников на комплексе"
                            class="col-4"
                            type="number"
                            :options="countTypes"
                        />
                        <RadioOptions
                            v-model="form.managment_company"
                            :options="entityOptions.defaults.booleanSimple"
                            class="col-4"
                            label="Управляющая компания"
                            unselect
                        />
                    </div>
                </Tab>
                <Tab name="Коммуникации">
                    <FormGroup>
                        <RadioOptions
                            v-model="form.power"
                            :v="v$.form.power"
                            class="col-3"
                            label="Электроснабжение"
                            required
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <Input
                            v-model="form.power_value"
                            :v="v$.form.power_value"
                            :disabled="!form.power"
                            class="col-4"
                            label="Электричество"
                            unit="кВт"
                            type="number"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.heating_autonomous"
                            :v="v$.form.heating_autonomous"
                            class="col-3"
                            label="Отопление авт."
                            required
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.heating_autonomous_type"
                            :disabled="!form.heating_autonomous"
                            :options="heatingAutonomousTypes"
                            class="col-4"
                            multiple
                            mode="multiple"
                            :close-on-select="false"
                            label="Вид отопления"
                        />
                        <RadioOptions
                            v-model="form.heating_central"
                            :v="v$.form.heating_central"
                            class="col-3"
                            label="Центральное отопление"
                            required
                            :options="entityOptions.defaults.booleanSimple"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.water"
                            :v="v$.form.water"
                            class="col-3"
                            label="Водоснабжение"
                            required
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.water_type"
                            :options="waterTypes"
                            :disabled="!form.water"
                            multiple
                            mode="multiple"
                            :close-on-select="false"
                            class="col-4"
                            label="Вид водоснабжения"
                        />
                        <Input
                            v-model="form.water_value"
                            :v="v$.form.water_value"
                            class="col-4"
                            :disabled="!form.water"
                            label="Измерение водоснабжения"
                            unit="м<sup>3</sup>/сут"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.sewage"
                            :v="v$.form.sewage"
                            class="col-3"
                            label="Канализ. центр."
                            required
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <Input
                            v-model="form.sewage_value"
                            :v="v$.form.sewage_value"
                            class="col-4"
                            :disabled="!form.sewage"
                            label="Измерение канализ. центр."
                            unit="м<sup>3</sup>/сут"
                        />
                        <RadioOptions
                            v-model="form.sewage_rain"
                            :v="v$.form.sewage_rain"
                            class="col-3"
                            label="Канализация ливневая"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.gas"
                            class="col-3"
                            label="Газ"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.gas_type"
                            :disabled="!form.gas"
                            :options="gasTypes"
                            class="col-4"
                            label="Тип газа"
                        />
                        <Input
                            v-model="form.gas_value"
                            :v="v$.form.gas_value"
                            :disabled="!form.gas"
                            class="col-4"
                            label="Измерение газа"
                            unit="м<sup>3</sup>час"
                            type="number"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.steam"
                            class="col-3"
                            label="Пар"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <Input
                            v-model="form.steam_value"
                            :v="v$.form.steam_value"
                            :disabled="!form.steam"
                            class="col-4"
                            label="Измерение пара"
                            unit="бар"
                            type="number"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.internet"
                            class="col-3"
                            label="Интернет"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.internet_type"
                            :disabled="!form.internet"
                            class="col-4"
                            :options="internetTypes"
                            multiple
                            mode="multiple"
                            :close-on-select="false"
                            label="Тип интернета"
                        />
                        <RadioOptions
                            v-model="form.phone_line"
                            class="col-3"
                            label="Телефония"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                    </FormGroup>
                </Tab>
                <Tab name="Безопасность/Инфраструктура">
                    <p class="form__block">Безопасность</p>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.video_control"
                            class="col-3"
                            label="Видеонаблюдение"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.guard"
                            class="col-3"
                            label="Охрана объекта"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.guard_type"
                            :disabled="!form.guard"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            multiple
                            mode="multiple"
                            :close-on-select="false"
                            :options="guardTypes"
                        />
                    </FormGroup>
                    <FormGroup>
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
                            label="Охран. сигнализ."
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
                            v-model="form.fence_around_perimeter"
                            class="col-3"
                            label="Забор по перим."
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                    </FormGroup>
                    <p class="form__block">Железнодорожное сообщение</p>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.railway"
                            class="col-3"
                            label="Ж/Д ветка"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <Input
                            v-model="form.railway_value"
                            :v="v$.form.railway_value"
                            :disabled="!form.railway"
                            label="Значение"
                            class="col-4"
                            type="number"
                            unit="м"
                        />
                    </FormGroup>
                    <p class="form__block">Инфраструктура</p>
                    <FormGroup>
                        <MultiSelect
                            v-model="form.entry_territory_type"
                            :options="entryTerritoryTypes"
                            class="col-4"
                            label="Въезд на территорию"
                        />
                        <MultiSelect
                            v-model="form.entry_territory"
                            title="Плата за въезд"
                            label="Плата за въезд"
                            class="col-4"
                            :options="feeTypes"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.parking_car"
                            class="col-3"
                            label="«P» легковая"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.parking_car_value"
                            :disabled="!form.parking_car"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            :options="feeTypes"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.parking_lorry"
                            class="col-3"
                            label="«P» 3-10 тонн"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.parking_lorry_value"
                            :disabled="!form.parking_lorry"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            :options="feeTypes"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.parking_truck"
                            class="col-3"
                            label="«P» грузовая"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.parking_truck_value"
                            :disabled="!form.parking_truck"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            :options="feeTypes"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.canteen"
                            class="col-3"
                            label="Столовая/Кафе"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.hostel"
                            class="col-3"
                            label="Общежитие"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                    </FormGroup>
                </Tab>
                <Tab name="Описание">
                    <DescriptionEditor
                        v-model:description="form.description"
                        v-model:description-auto="form.description_auto"
                        v-model:manual-use="form.description_manual_use"
                        class="mt-3"
                    />
                </Tab>
                <Tab name="Документы">
                    <div class="row">
                        <FileInput
                            v-model:native="form.building_layouts_list"
                            v-model:data="form.building_layouts"
                            sortable
                            label="Планировки"
                            class="col-12"
                            item-class="col-2"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                    <div class="row mt-2">
                        <FileInput
                            v-model:native="form.building_presentations_list"
                            v-model:data="form.building_presentations"
                            sortable
                            label="Презентации"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                    <div class="row mt-2">
                        <FileInput
                            v-model:native="form.building_property_documents_list"
                            v-model:data="form.building_property_documents"
                            sortable
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

<script setup>
import { yandexmap } from '@/utils/yandexMap.js';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import Input from '@/components/common/Forms/Input.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import useVuelidate from '@vuelidate/core';
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
import { onBeforeMount, onMounted, reactive, shallowRef } from 'vue';
import { validationRulesForComplex } from '@/validators/rules/complex.js';
import Switch from '@/components/common/Forms/Switch.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import { cloneObject } from '@/utils/index.js';
import DescriptionEditor from '@/components/common/Forms/DescriptionEditor.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { entityOptions } from '@/const/options/options.js';

defineEmits(['close']);
const props = defineProps({
    complex: {
        type: Object,
        default: null
    }
});

const isLoading = shallowRef(false);
const locationIsMetro = shallowRef(false);

const form = reactive({
    address: null,
    from_mkad: null,
    from_mkad_novalue: 0,
    area_buildings_full: null,
    area_field_full: null,
    title: null,
    title_novalue: 0,
    buildings_admin_num: null,
    buildings_industry_num: null,
    buildings_help_num: null,
    owners_num: null,
    managment_company: null,
    power: null,
    power_value: null,
    heating_autonomous: null,
    heating_autonomous_type: [],
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
});

const v$ = useVuelidate({ form: validationRulesForComplex }, { form });

const onChangeFromMkadNoValue = () => {
    if (form.from_mkad_novalue) form.from_mkad = null;
};

const getAddress = async query => {
    if (props.complex) return await yandexmap.getAddress(query, props.complex.address);
    return await yandexmap.getAddress(query);
};

const onSubmit = () => {
    return 'submit';
};

onBeforeMount(() => {
    if (props.complex) Object.assign(form, cloneObject(props.complex));
});
</script>
