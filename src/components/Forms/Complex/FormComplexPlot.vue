<template>
    <Modal @close="$emit('close')" show width="1100" has-tabs>
        <template #header>
            <Switch v-model="form.test_only" false-title="Обычный лот" true-title="Тестовый лот" />
        </template>
        <Loader v-if="isLoading" />
        <UiForm @submit="onSubmit">
            <Tabs always-render :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="main" name="Основное">
                    <div class="row">
                        <MultiSelect
                            v-model="form.address"
                            @change="onChangeAddress"
                            extra-classes="long-text"
                            placeholder="Введите адрес.."
                            label="Адрес строения"
                            required
                            class="col-6"
                            :filterResults="false"
                            :min-chars="1"
                            :resolve-on-load="true"
                            :delay="600"
                            :searchable="true"
                            :v="v$.form.address"
                            :options="
                                async query => {
                                    return await searchAddress(query);
                                }
                            "
                        />
                        <MultiSelect
                            v-model="form.company_id"
                            @change="onChangeCompany"
                            placeholder="Введите название компании или ID"
                            extra-classes="long-text"
                            label="Компания"
                            required
                            class="col-6"
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
                    </div>
                    <div class="row mt-2">
                        <div class="col-12">
                            <span class="form__subtitle">Тип объекта</span>
                            <div class="row mt-2">
                                <ObjectTypePicker
                                    v-model:value="form.purposes"
                                    v-model:extra="form.object_type"
                                    :extra-value="2"
                                    label="Участок"
                                    :options="objectPurposesWithSectionsOptions.plot"
                                    class="col-12"
                                />
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab name="Характериcтики">
                    <div class="row">
                        <UiInput
                            v-model="form.area_field_full"
                            :v="v$.form.area_field_full"
                            label="S - участка общая"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                            required
                        />
                        <DoubleInput
                            v-model:first="form.land_length"
                            v-model:second="form.land_width"
                            label="Габариты"
                            class="col-8"
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
                            v-model="form.own_type_land"
                            :v="v$.form.own_type_land"
                            required
                            title="Право на участок"
                            label="Право на участок"
                            class="col-4"
                            :options="entityOptions.object.ownTypeLand"
                        />
                        <MultiSelect
                            v-model="form.land_category"
                            title="Категория земли"
                            label="Категория земли"
                            class="col-4"
                            :options="entityOptions.object.landCategory"
                        />
                        <MultiSelect
                            v-model="form.landscape_type"
                            :v="v$.form.landscape_type"
                            title="Рельеф участка"
                            label="Рельеф участка"
                            class="col-4"
                            required
                            :options="entityOptions.object.landscape"
                        />
                    </div>
                    <div class="row mt-2">
                        <UiInput
                            v-model="form.cadastral_number_land"
                            :v="v$.form.cadastral_number_land"
                            label="Кадастровый № строения"
                            class="col-4"
                            required
                        />
                        <RadioOptions
                            v-model="form.land_use_restrictions"
                            label="Ограничения"
                            class="col-3"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.first_line"
                            :v="v$.form.first_line"
                            label="Первая линия"
                            required
                            class="col-3"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                    </div>
                    <div class="row mt-2">
                        <UiTextarea v-model="form.field_allow_usage" label="В.Р.И" class="col-12" />
                    </div>
                    <DescriptionEditor
                        v-model:description="form.description"
                        v-model:description-auto="form.description_auto"
                        v-model:manual-use="form.description_manual_use"
                        class="mt-3"
                    />
                </Tab>
                <Tab name="Коммуникации">
                    <div class="row">
                        <RadioOptions
                            v-model="form.heating_central"
                            :v="v$.form.heating_central"
                            class="col-4"
                            label="Центральное отопление"
                            required
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.power"
                            :v="v$.form.power"
                            class="col-3"
                            label="Электроснабжение"
                            required
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <UiInput
                            v-model="form.power_value"
                            :disabled="!form.power"
                            :v="v$.form.power_value"
                            label="Значение"
                            class="offset-1 col-4"
                            type="number"
                            unit="кВт"
                            required
                        />
                    </div>
                    <div class="row mt-2">
                        <RadioOptions
                            v-model="form.water"
                            :v="v$.form.water"
                            class="col-4"
                            label="Водоснабжение"
                            required
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <UiInput
                            v-model="form.water_value"
                            label="Значение"
                            :v="v$.form.water_value"
                            :disabled="!form.water"
                            class="col-4"
                            type="number"
                            unit="м<sup>3</sup>/сут"
                            required
                        />
                        <MultiSelect
                            v-model="form.water_type"
                            :v="v$.form.water_type"
                            :disabled="!form.water"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            required
                            mode="multiple"
                            multiple
                            :options="entityOptions.complex.water"
                        />
                    </div>
                    <div class="row mt-2">
                        <RadioOptions
                            v-model="form.sewage_rain"
                            class="col-4"
                            label="Канализация ливн."
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.sewage_central"
                            :v="v$.form.sewage_central"
                            class="col-4"
                            label="Канализация центр."
                            required
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <UiInput
                            v-model="form.sewage_central_value"
                            :disabled="!form.sewage_central"
                            label="Значение"
                            :v="v$.form.sewage_central_value"
                            class="col-4"
                            type="number"
                            unit="м<sup>3</sup>/сут"
                            required
                        />
                    </div>
                    <div class="row mt-2">
                        <RadioOptions
                            v-model="form.gas"
                            class="col-4"
                            label="Газ"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <UiInput
                            v-model="form.gas_value"
                            label="Значение"
                            :v="v$.form.water_value"
                            :disabled="!form.gas"
                            class="col-4"
                            type="number"
                            unit="м<sup>3</sup>/час"
                            required
                        />
                        <MultiSelect
                            v-model="form.gas_type"
                            :disabled="!form.gas"
                            :v="v$.form.gas_type"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            required
                            :options="entityOptions.complex.gas"
                        />
                    </div>
                    <div class="row mt-2">
                        <RadioOptions
                            v-model="form.phone_line"
                            class="col-4"
                            label="Телефония"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.steam"
                            class="col-4"
                            label="Пар"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <UiInput
                            v-model="form.steam_value"
                            :disabled="!form.steam"
                            label="Значение"
                            :v="v$.form.steam_value"
                            class="col-4"
                            type="number"
                            unit="бар"
                            required
                        />
                    </div>
                    <div class="row mt-2">
                        <RadioOptions
                            v-model="form.internet"
                            unselect
                            class="col-4"
                            label="Интернет"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.internet_type"
                            :disabled="!form.internet"
                            :v="v$.form.internet_type"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            required
                            mode="multiple"
                            multiple
                            :options="entityOptions.complex.internet"
                        />
                    </div>
                </Tab>
                <Tab name="Безопасность/Инфраструктура">
                    <p class="form__block">Безопасность</p>
                    <div class="row">
                        <RadioOptions
                            v-model="form.video_control"
                            unselect
                            class="col-3"
                            label="Видеонаблюдение"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.guard"
                            unselect
                            class="col-3"
                            label="Охрана объекта"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.guard_type"
                            :disabled="!form.guard"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            required
                            mode="multiple"
                            multiple
                            :options="entityOptions.complex.guard"
                        />
                    </div>
                    <div class="row mt-2">
                        <RadioOptions
                            v-model="form.access_control"
                            unselect
                            class="col-3"
                            label="Контроль доступа"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.security_alert"
                            unselect
                            class="col-3"
                            label="Охран. сигнализ."
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.barrier"
                            unselect
                            class="col-3"
                            label="Шлагбаум"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.fence_around_perimeter"
                            unselect
                            class="col-3"
                            label="Забор по перим."
                            :options="entityOptions.defaults.booleanSimple"
                        />
                    </div>
                    <p class="form__block">Железнодорожное сообщение</p>
                    <div class="row mt-2">
                        <RadioOptions
                            v-model="form.railway"
                            unselect
                            class="col-3"
                            label="Ж/Д ветка"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <UiInput
                            v-model="form.railway_value"
                            :disabled="!form.railway"
                            label="Значение"
                            :v="v$.form.railway_value"
                            class="col-4"
                            type="number"
                            unit="м"
                            required
                        />
                    </div>
                    <p class="form__block">Инфраструктура</p>
                    <div class="row mt-2">
                        <RadioOptions
                            v-model="form.parking_car"
                            unselect
                            class="col-3"
                            label="P легковая"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.parking_car_value"
                            :disabled="!form.parking_car"
                            title="Тип"
                            label="Тип"
                            class="col-3"
                            :options="entityOptions.complex.fee"
                        />
                        <MultiSelect
                            v-model="form.entry_territory_type"
                            title="Въезд на территорию"
                            label="Въезд на террит."
                            class="col-4"
                            :options="entityOptions.complex.entryTerritory"
                        />
                    </div>
                    <div class="row mt-2">
                        <RadioOptions
                            v-model="form.parking_lorry"
                            unselect
                            class="col-3"
                            label="P 3-10 тонн"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.parking_lorry_value"
                            :disabled="!form.parking_lorry"
                            title="Тип"
                            label="Тип"
                            class="col-3"
                            :options="entityOptions.complex.fee"
                        />
                        <MultiSelect
                            v-model="form.entrance_type"
                            title="Плата за въезд"
                            label="Плата за въезд"
                            class="col-4"
                            :options="entityOptions.complex.fee"
                        />
                    </div>
                    <div class="row mt-2">
                        <RadioOptions
                            v-model="form.parking_truck"
                            unselect
                            class="col-3"
                            label="P грузовая"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <MultiSelect
                            v-model="form.parking_truck_value"
                            :disabled="!form.parking_truck"
                            title="Тип"
                            label="Тип"
                            class="col-3"
                            :options="entityOptions.complex.fee"
                        />
                        <RadioOptions
                            v-model="form.canteen"
                            unselect
                            class="col-3"
                            label="Столовая/Кафе"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.hostel"
                            unselect
                            class="col-3"
                            label="Общежитие"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                    </div>
                </Tab>
                <Tab name="Документы">
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
                    <div class="row mt-2">
                        <FileInput
                            v-model:native="form.building_layouts_list"
                            v-model:data="form.building_layouts"
                            sortable
                            label="Планировки"
                            class="col-12"
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
                <Tab name="Строения">
                    <div class="row">
                        <Switch
                            v-model="form.buildings_on_territory"
                            false-title="Участок без строений"
                            true-title="Строения на участке"
                            class="col-12 mb-3"
                        />
                    </div>
                    <AnimationTransition :speed="0.5">
                        <div v-if="form.buildings_on_territory" class="row">
                            <div class="col-12 mb-2">
                                <BuildingPicker
                                    v-model="form.buildings_on_territory_id"
                                    :buildings="buildings"
                                    :disabled="!form.buildings_on_territory"
                                />
                            </div>
                            <UiTextarea
                                v-model="form.buildings_on_territory_description"
                                :v="v$.form.buildings_on_territory_description"
                                label="Описание строений"
                                :disabled="!form.buildings_on_territory"
                                class="col-12"
                                required
                            />
                        </div>
                        <EmptyData v-else>
                            Для доступа к выбору строений укажите, что на участке есть строения
                        </EmptyData>
                    </AnimationTransition>
                </Tab>
            </Tabs>
            <div class="row">
                <Submit class="col-3 mx-auto" success>Сохранить</Submit>
            </div>
        </UiForm>
    </Modal>
</template>

<script setup>
import { useStore } from 'vuex';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import { entityOptions } from '@/const/options/options';
import Switch from '@/components/common/Forms/Switch.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import ObjectTypePicker from '@/components/common/Forms/ObjectTypePicker.vue';
import { objectPurposesWithSectionsOptions } from '@/const/options/object.options.js';
import DescriptionEditor from '@/components/common/Forms/DescriptionEditor.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import BuildingPicker from '@/components/common/Forms/BuildingPicker/BuildingPicker.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import { computed, onBeforeMount, reactive, shallowRef, toRef } from 'vue';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import useVuelidate from '@vuelidate/core';
import { validationRulesForComplexPlot } from '@/validators/rules/complex-plot.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import { useSearchAddress } from '@/composables/useSearchAddress.js';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';

const store = useStore();
const props = defineProps({
    plot: {
        type: Object,
        default: null
    }
});

const form = reactive({
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
    land_use_restrictions: null,
    field_allow_usage: null,
    description: null,
    description_auto: null,
    description_manual_use: null,
    heating_central: null,
    power: null,
    power_value: null,
    water: null,
    water_value: null,
    water_type: [],
    sewage_central: null,
    sewage_central_value: null,
    sewage_rain: null,
    gas: null,
    gas_value: null,
    gas_type: null,
    steam: null,
    steam_value: null,
    phone_line: null,
    internet: null,
    internet_type: [],
    video_control: null,
    access_control: null,
    guard: null,
    guard_type: [],
    security_alert: null,
    barrier: null,
    fence_around_perimeter: null,
    railway: null,
    railway_value: null,
    parking_car: null,
    parking_car_value: null,
    entry_territory_type: null,
    entrance_type: null,
    parking_lorry: null,
    parking_lorry_value: null,
    parking_truck: null,
    parking_truck_value: null,
    canteen: null,
    hostel: null,
    photos: [],
    photosList: [],
    building_layouts_list: [],
    building_presentations_list: [],
    building_property_documents_list: [],
    buildings_on_territory: null,
    buildings_on_territory_id: [],
    buildings_on_territory_description: null
});

const isLoading = shallowRef(false);

const v$ = useVuelidate({ form: validationRulesForComplexPlot }, { form });

const onSubmit = () => {
    console.log('SUBMIT');
};

const buildings = computed(() => {
    return store.state.Complex.complex.objects.filter(element => !element.is_land);
});
const onChangeAddress = () => {};
const onChangeCompany = () => {};

const searchAddress = useSearchAddress(toRef(() => props.plot?.address));
const searchCompany = useSearchCompany(toRef(() => props.plot?.company_id));

onBeforeMount(() => {
    if (props.plot) Object.assign(form, cloneObject(props.plot));
});
</script>
