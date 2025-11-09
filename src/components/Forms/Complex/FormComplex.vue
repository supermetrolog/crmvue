<template>
    <UiModal
        @close="$emit('close')"
        show
        custom-close
        :title="complex ? 'Редактирование комплекса' : 'Добавление комплекса'"
        has-tabs
        :width="1200"
    >
        <Loader v-if="isLoading" />
        <UiForm @submit="onSubmit">
            <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="main" name="Основное">
                    <UiFormGroup>
                        <UiInput
                            v-model.trim="form.title"
                            :v="v$.form.title"
                            :disabled="form.title_novalue"
                            :required="!form.title_novalue"
                            label="Название"
                            class="col-12"
                        >
                            <template #after>
                                <UiCheckbox
                                    v-model="form.title_novalue"
                                    class="mt-1"
                                    :true-value="1"
                                    :false-value="null"
                                >
                                    Без названия
                                </UiCheckbox>
                            </template>
                        </UiInput>
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <AddressAutocomplete
                            v-model="form.address"
                            v-model:location="selectedLocation"
                            :current-value="complex?.address"
                            :v="v$.form.address"
                            :resolve-on-load="Boolean(complex)"
                            required
                            label="Адрес комплекса"
                            placeholder="Введите адрес.."
                            class="col-md-9 col-12"
                        />
                        <UiInput
                            v-model="form.from_mkad"
                            :v="v$.form.from_mkad"
                            label="Удаленность от МКАД"
                            class="col-md-3 col-12"
                            unit="км"
                            type="number"
                            :disabled="form.from_mkad_novalue"
                            :required="!form.from_mkad_novalue"
                        >
                            <template #after>
                                <UiCheckbox
                                    v-model="form.from_mkad_novalue"
                                    @change="onChangeFromMkadNoValue"
                                    class="mt-1"
                                    :true-value="1"
                                    :false-value="null"
                                >
                                    Неприменимо
                                </UiCheckbox>
                            </template>
                        </UiInput>
                    </UiFormGroup>
                    <UiFormGroup>
                        <Switch
                            v-model="locationIsMetro"
                            false-title="Город"
                            true-title="Метро"
                            class="col-12"
                        />
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <UiCol :cols="12">
                            <MapContainer
                                v-model="mapModel"
                                :center="complex ? complexLocation.coords : undefined"
                                class="form-complex__map"
                            >
                                {{ selectedLocation }}
                                <MapMarker
                                    v-if="selectedLocation"
                                    :coordinates="parsedSelectedLocation.coords"
                                    static-hint
                                    :title="parsedSelectedLocation.title"
                                    :subtitle="parsedSelectedLocation.subtitle"
                                    color="blue"
                                />
                                <MapMarker
                                    v-if="complex"
                                    :coordinates="complexLocation.coords"
                                    static-hint
                                    :title="complexLocation.title"
                                    :subtitle="complexLocation.subtitle"
                                    color="red"
                                />
                            </MapContainer>
                        </UiCol>
                    </UiFormGroup>
                </Tab>
                <Tab name="Характеристики">
                    <div class="row mb-2">
                        <UiInput
                            v-model="form.area_field_full"
                            :v="v$.form.area_field_full"
                            label="S - участка"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                            required
                        />
                        <UiInput
                            v-model="form.area_buildings_full"
                            :v="v$.form.area_buildings_full"
                            label="S - строений комплекса"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                        />
                        <UiInput
                            v-model="form.buildings_admin_num"
                            :v="v$.form.buildings_admin_num"
                            label="Количество адм. строений"
                            class="col-4"
                            type="number"
                        />
                        <UiInput
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
                    <UiFormGroup>
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
                            :v="v$.form.power_value"
                            :disabled="!form.power"
                            class="col-4"
                            label="Электричество"
                            unit="кВт"
                            type="number"
                        />
                    </UiFormGroup>
                    <UiFormGroup>
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
                    </UiFormGroup>
                    <UiFormGroup>
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
                        <UiInput
                            v-model="form.water_value"
                            :v="v$.form.water_value"
                            class="col-4"
                            :disabled="!form.water"
                            label="Измерение водоснабжения"
                            unit="м<sup>3</sup>/сут"
                        />
                    </UiFormGroup>
                    <UiFormGroup>
                        <RadioOptions
                            v-model="form.sewage"
                            :v="v$.form.sewage"
                            class="col-3"
                            label="Канализ. центр."
                            required
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <UiInput
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
                    </UiFormGroup>
                    <UiFormGroup>
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
                        <UiInput
                            v-model="form.gas_value"
                            :v="v$.form.gas_value"
                            :disabled="!form.gas"
                            class="col-4"
                            label="Измерение газа"
                            unit="м<sup>3</sup>час"
                            type="number"
                        />
                    </UiFormGroup>
                    <UiFormGroup>
                        <RadioOptions
                            v-model="form.steam"
                            class="col-3"
                            label="Пар"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <UiInput
                            v-model="form.steam_value"
                            :v="v$.form.steam_value"
                            :disabled="!form.steam"
                            class="col-4"
                            label="Измерение пара"
                            unit="бар"
                            type="number"
                        />
                    </UiFormGroup>
                    <UiFormGroup>
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
                    </UiFormGroup>
                </Tab>
                <Tab name="Безопасность/Инфраструктура">
                    <p class="form__block">Безопасность</p>
                    <UiFormGroup>
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
                    </UiFormGroup>
                    <UiFormGroup>
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
                    </UiFormGroup>
                    <p class="form__block">Железнодорожное сообщение</p>
                    <UiFormGroup>
                        <RadioOptions
                            v-model="form.railway"
                            class="col-3"
                            label="Ж/Д ветка"
                            unselect
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <UiInput
                            v-model="form.railway_value"
                            :v="v$.form.railway_value"
                            :disabled="!form.railway"
                            label="Значение"
                            class="col-4"
                            type="number"
                            unit="м"
                        />
                    </UiFormGroup>
                    <p class="form__block">Инфраструктура</p>
                    <UiFormGroup>
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
                    </UiFormGroup>
                    <UiFormGroup>
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
                    </UiFormGroup>
                    <UiFormGroup>
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
                    </UiFormGroup>
                    <UiFormGroup>
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
                    </UiFormGroup>
                    <UiFormGroup>
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
                    </UiFormGroup>
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
        </UiForm>
    </UiModal>
</template>

<script setup>
import Loader from '@/components/common/Loader.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
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
import { computed, onBeforeMount, reactive, ref, shallowRef, watchEffect } from 'vue';
import { validationRulesForComplex } from '@/validators/rules/complex.js';
import Switch from '@/components/common/Forms/Switch.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import DescriptionEditor from '@/components/common/Forms/DescriptionEditor.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { entityOptions } from '@/const/options/options.js';
import AddressAutocomplete from '@/components/common/Forms/AddressAutocomplete.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import MapContainer from '@/components/common/Map/MapContainer.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import MapMarker from '@/components/common/Map/MapMarker.vue';

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

const onSubmit = () => {
    return 'submit';
};

onBeforeMount(() => {
    if (props.complex) Object.assign(form, cloneObject(props.complex));
});

// location

const complexLocation = computed(() => {
    if (!props.complex) {
        return null;
    }

    return {
        coords: [props.complex.longitude, props.complex.latitude],
        title: props.complex.title_novalue ? `Комплекс #${props.complex.id}` : props.complex.title,
        subtitle: props.complex.address
    };
});

const selectedLocation = ref(null);

const parsedSelectedLocation = computed(() => {
    if (!selectedLocation.value) {
        return null;
    }

    return {
        coords: selectedLocation.value.coords,
        title: selectedLocation.value.label,
        subtitle: selectedLocation.value.value
    };
});

const currentSelectedLocation = computed(() => {
    if (parsedSelectedLocation.value) {
        return parsedSelectedLocation.value;
    }

    if (props.complex) {
        return complexLocation.value;
    }

    return null;
});

const mapModel = shallowRef(null);

watchEffect(() => {
    if (!mapModel.value || !currentSelectedLocation.value) {
        return;
    }

    mapModel.value.setLocation({
        center: currentSelectedLocation.value.coords,
        duration: 1000
    });
});
</script>

<style lang="scss">
.form-complex {
    &__map {
        height: 300px;
        width: 100%;
        border: 1px solid rgba(0, 0, 0, 00.1);
    }
}
</style>
