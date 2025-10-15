<template>
    <Modal @close="$emit('close')" show width="1400" title="Фильтры">
        <template #header>
            <span v-if="filterCount" class="badge badge-danger">
                {{ filterCount }}
            </span>
        </template>
        <UiForm @submit="onSubmit">
            <div class="row mb-2">
                <div class="col-12 col-md-8">
                    <UiInput
                        v-model="querySearch"
                        @keydown.enter="onSubmit"
                        label="Поиск"
                        placeholder="ID, адрес, собственник, телефон, ФИО"
                    />
                </div>
                <div class="col-12 col-md-4 align-self-end">
                    <div class="offer-search__actions">
                        <Button
                            @click="toggleFavorites"
                            warning
                            :active="form.favorites"
                            :badge="favoritesCount || false"
                        >
                            избранные
                        </Button>
                        <Button @click="resetForm" :disabled="resetIsDisabled" danger>
                            Сбросить фильтры
                        </Button>
                    </div>
                </div>
            </div>
            <UiFormDivider />
            <UiFormGroup>
                <ConsultantPicker
                    v-model="form.agent_id"
                    :options="getConsultantsOptions"
                    class="col-12 col-md-4"
                />
                <MultiSelect
                    v-model="form.deal_type"
                    label="Тип сделки"
                    class="col-md-4 col-12"
                    :options="DealTypeList"
                    placeholder="Выберите тип.."
                />
                <UiInput
                    v-model="form.rangeMinElectricity"
                    placeholder="не менее"
                    label="Электричество"
                    class="col-md-4 col-12"
                    unit="кВт"
                    type="number"
                    :v="v$.form.rangeMinElectricity"
                    reactive
                />
                <DoubleInput
                    v-model:first="form.rangeMinArea"
                    v-model:second="form.rangeMaxArea"
                    label="S пола"
                    class="col-md-4 col-12"
                    unit="м<sup>2</sup>"
                    type="number"
                    :validators="formAreaValidators"
                    reactive
                />
                <DoubleInput
                    v-model:first="form.rangeMinPricePerFloor"
                    v-model:second="form.rangeMaxPricePerFloor"
                    label="Цена (продажи, аренды, о-х)"
                    class="col-md-4 col-12"
                    unit="₽"
                    type="number"
                    reactive
                    :validators="formPricePerFloorValidators"
                />
                <DoubleInput
                    v-model:first="form.rangeMinCeilingHeight"
                    v-model:second="form.rangeMaxCeilingHeight"
                    label="Высота потолков"
                    class="col-md-4 col-12"
                    unit="м"
                    type="number"
                    reactive
                    :validators="formCeilingHeightValidators"
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <MultiSelect
                    v-model="form.fakeRegion"
                    @change="changeRegion"
                    label="Регионы"
                    placeholder="Выберите регион.."
                    can-deselect
                    class="col-md-7 col-12"
                    searchable
                    :options="getRegionsOptions"
                />
                <UiInput
                    v-if="hasApproximateDistance"
                    v-model="form.approximateDistanceFromMKAD"
                    placeholder="не более"
                    label="Удаленность от МКАД +30%"
                    class="col-md-3 col-12"
                    unit="км"
                    type="number"
                />
                <UiInput
                    v-else
                    v-model="form.rangeMaxDistanceFromMKAD"
                    :v="v$.form.rangeMaxDistanceFromMKAD"
                    placeholder="не более"
                    label="Удаленность от МКАД"
                    class="col-md-3 col-12"
                    unit="км"
                    type="number"
                    reactive
                />
                <AnimationTransition>
                    <CheckboxOptions
                        v-if="hasDistricts"
                        v-model="form.district_moscow"
                        class="col-12"
                        label="Округа Москвы"
                        :options="DistrictList"
                    />
                </AnimationTransition>
                <AnimationTransition>
                    <SwitchSlider
                        v-if="hasDistricts"
                        v-model="form.outside_mkad"
                        vertical
                        label="МКАД"
                        true-title="Внутри МКАД"
                        false-title="Снаружи МКАД"
                        :true-value="0"
                        :false-value="1"
                        class="col-5"
                    />
                </AnimationTransition>
                <AnimationTransition>
                    <div v-if="hasDirections" class="col-12 mb-2">
                        <span class="form__subtitle">Направления МО</span>
                        <div class="form__row mt-1">
                            <CheckboxChip
                                v-for="(directionItem, index) in DirectionList"
                                :key="index"
                                v-model="form.direction"
                                :value="Number(index)"
                                :text="directionItem.short"
                            />
                        </div>
                        <Switch
                            v-model="form.region_neardy"
                            class="mt-2"
                            true-title="Регионы рядом с МО"
                            false-title="Только в пределах МО"
                            :transform="Number"
                        />
                    </div>
                </AnimationTransition>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <CheckboxOptions
                    v-model="form.cian_regions"
                    class="col-12"
                    label="Регион ЦИАН"
                    :options="locationOptions.cianRegion"
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <CheckboxOptions
                    v-model="form.class"
                    class="col-md-3 col-12"
                    label="Классы"
                    :options="ObjectClassList"
                />
                <CheckboxOptions
                    v-model="form.gates"
                    class="col-md-4 col-12"
                    label="Тип ворот"
                    :options="GateTypeList"
                />
                <CheckboxOptions
                    v-model="form.floor_types"
                    class="col-md-5 col-12"
                    label="Тип пола"
                    :options="realFloorTypeOptions"
                />
            </UiFormGroup>
            <UiFormDivider />
            <p class="form__block">Коммуникации</p>
            <div class="row">
                <SwitchSlider
                    v-model="form.heated"
                    class="col-12 col-lg-6 col-xxl-4"
                    label="Отопление"
                    :false-value="2"
                />
                <SwitchSlider
                    v-model="form.water"
                    class="col-12 col-lg-6 col-xxl-4"
                    label="Вода"
                    :false-value="2"
                />
                <SwitchSlider
                    v-model="form.gas"
                    class="col-12 col-lg-6 col-xxl-4"
                    label="Газ"
                    :false-value="2"
                />
                <SwitchSlider
                    v-model="form.steam"
                    class="col-12 col-lg-6 col-xxl-4"
                    label="Пар"
                    :false-value="2"
                />
                <SwitchSlider
                    v-model="form.sewage_central"
                    class="col-12 col-lg-6 col-xxl-4"
                    label="Канализация"
                    :false-value="2"
                />
                <SwitchSlider
                    v-model="form.racks"
                    class="col-12 col-lg-6 col-xxl-4"
                    label="Стелажи"
                    :false-value="2"
                />
                <SwitchSlider
                    v-model="form.railway"
                    class="col-12 col-lg-6 col-xxl-4"
                    label="Ж/Д ветка"
                    :false-value="2"
                />
                <SwitchSlider
                    v-model="form.has_cranes"
                    class="col-12 col-lg-6 col-xxl-4"
                    label="Краны"
                    :false-value="2"
                />
                <SwitchSlider
                    v-model="form.firstFloorOnly"
                    class="col-12 col-lg-6 col-xxl-4"
                    label="Только 1 этаж"
                    :false-value="2"
                />
            </div>
            <p class="form__block">Статус</p>
            <div class="row mt-2">
                <SwitchSlider
                    v-model="form.status"
                    class="col-12 col-lg-6 col-xxl-4"
                    label="Статус"
                    unknown-title="Любой"
                    true-title="Актив"
                    false-title="Пассив"
                    :false-value="2"
                />
            </div>
            <UiFormDivider />
            <p class="form__block">Тип объекта</p>
            <UiFormGroup>
                <div class="col-12">
                    <div class="row mt-2">
                        <ObjectTypePicker
                            v-model:value="form.purposes"
                            v-model:extra="form.object_type"
                            :extra-value="1"
                            label="Склад"
                            :options="objectPurposesWithSectionsOptions.warehouse"
                            class="col-md-4"
                        />
                        <ObjectTypePicker
                            v-model:value="form.purposes"
                            v-model:extra="form.object_type"
                            :extra-value="2"
                            label="Производство"
                            :options="objectPurposesWithSectionsOptions.production"
                            class="col-md-4"
                        />
                        <ObjectTypePicker
                            v-model:value="form.purposes"
                            v-model:extra="form.object_type"
                            :extra-value="3"
                            label="Участок"
                            :options="objectPurposesWithSectionsOptions.plot"
                            class="col-md-4"
                        />
                    </div>
                </div>
            </UiFormGroup>
            <UiFormDivider />
            <p class="form__block">Реклама</p>
            <UiFormGroup>
                <SwitchSlider
                    v-model="form.ad_avito"
                    class="col-12 col-lg-6 col-xl-4"
                    label="Авито"
                />
                <SwitchSlider
                    v-model="form.ad_realtor"
                    class="col-12 col-lg-6 col-xl-4"
                    label="Realtor.ru"
                />
                <SwitchSlider
                    v-model="form.ad_cian"
                    class="col-12 col-lg-6 col-xl-4"
                    label="Циан"
                />
                <SwitchSlider
                    v-model="form.ad_yandex"
                    class="col-12 col-lg-6 col-xl-4"
                    label="Яндекс"
                />
                <SwitchSlider
                    v-model="form.ad_free"
                    class="col-12 col-lg-6 col-xl-4"
                    label="Бесплатные"
                />
            </UiFormGroup>
        </UiForm>
    </Modal>
</template>

<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Modal from '@/components/common/Modal.vue';
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import useVuelidate from '@vuelidate/core';
import {
    areaRangeValidators,
    ceilingHeightValidators,
    pricePerFloorValidators
} from '@//validators/fields';
import ObjectTypePicker from '@/components/common/Forms/ObjectTypePicker.vue';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import {
    DealTypeList,
    DirectionList,
    DistrictList,
    GateTypeList,
    ObjectClassList
} from '@/const/const.js';
import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue';
import { deleteEmptyFields } from '@/utils/helpers/object/deleteEmptyFields.js';
import { useRoute, useRouter } from 'vue-router';
import { singleToArrayByKeys } from '@/utils/helpers/object/singleToArrayByKeys.js';
import { useStore } from 'vuex';
import { helpers, minValue } from '@vuelidate/validators';
import { realFloorTypeOptions } from '@/const/options/floor.options.js';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';
import { useQuerySearch } from '@/composables/useQuerySearch.js';
import { useRegionsOptions } from '@/composables/options/useRegionsOptions.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { objectPurposesWithSectionsOptions } from '@/const/options/object.options.js';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import { locationOptions } from '@/const/options/location.options.js';
import { toArray } from '@/utils/helpers/array/toArray';

const emit = defineEmits(['close', 'search', 'reset']);

const REGIONS = {
    MSK_AND_MO: 'mskandmo',
    MSK_INSIDE_MKAD: 'mskinsidemkad',
    MO_AND_MSK_OUTSIDE_MKAD: 'moandmskoutsidemkad',
    MO_AND_REGIONS: 'moandregionneardy'
};

const formKeysOnlyArray = [
    'purposes',
    'class',
    'gates',
    'region',
    'direction',
    'district_moscow',
    'object_type',
    'floor_types',
    'cian_regions'
];

const defaultForm = {
    all: null,
    rangeMinElectricity: null,
    rangeMaxDistanceFromMKAD: null,
    deal_type: null,
    agent_id: null,
    rangeMaxArea: null,
    rangeMinArea: null,
    rangeMaxPricePerFloor: null,
    rangeMinPricePerFloor: null,
    rangeMinCeilingHeight: null,
    rangeMaxCeilingHeight: null,
    class: [],
    gates: [],
    heated: null,
    water: null,
    gas: null,
    steam: null,
    sewage_central: null,
    is_fake: null,
    racks: null,
    railway: null,
    has_cranes: null,
    floor_types: [],
    purposes: [],
    object_type: [],
    region: [],
    fakeRegion: null,
    direction: [],
    district_moscow: [],
    status: null,
    firstFloorOnly: null,
    ad_realtor: null,
    ad_cian: null,
    ad_yandex: null,
    ad_free: null,
    ad_avito: null,
    favorites: null,
    outside_mkad: null,
    region_neardy: null,
    cian_regions: []
};

const route = useRoute();
const router = useRouter();
const store = useStore();

let timeout = null;
const form = reactive({});

const { getRegionsOptions } = useRegionsOptions();
const { getConsultantsOptions } = useConsultantsOptions();
const { querySearch } = useQuerySearch();

const formCeilingHeightValidators = computed(() =>
    ceilingHeightValidators(form.rangeMaxCeilingHeight)
);
const formPricePerFloorValidators = computed(() =>
    pricePerFloorValidators(form.rangeMaxPricePerFloor)
);
const formAreaValidators = computed(() => areaRangeValidators(form.rangeMaxArea));

const hasApproximateDistance = computed(() => {
    return Object.hasOwnProperty.call(form, 'approximateDistanceFromMKAD');
});

const resetIsDisabled = computed(() => {
    return (
        filterCount.value === 0 && (querySearch.value?.length === 0 || querySearch.value == null)
    );
});

const favoritesCount = computed(() => store.getters.FAVORITES_OFFERS.length);

const filterCount = computed(() => {
    let count = 0;

    Object.keys(defaultForm).forEach(key => {
        const value = form[key];
        if (
            value !== null &&
            value !== '' &&
            key !== 'fakeRegion' &&
            key !== 'region_neardy' &&
            key !== 'outside_mkad'
        ) {
            if (Array.isArray(value)) {
                if (value.length) count++;
            } else {
                count++;
            }
        }
    });

    return count;
});

const v$ = useVuelidate(
    {
        form: {
            rangeMaxDistanceFromMKAD: {
                min: helpers.withMessage('Некорректная минимальная удаленность', minValue(0))
            },
            rangeMinElectricity: {
                min: helpers.withMessage('Некорректное минимальное электричество', minValue(0))
            }
        }
    },
    {
        form
    }
);

const onSubmit = async () => {
    const query = { ...route.query, ...form };

    deleteEmptyFields(query);

    await router.replace({ query });
    emit('search', query);
};

const toggleFavorites = () => {
    if (form.favorites) form.favorites = null;
    else form.favorites = 1;
};

const setDefaultRegionOptions = () => {
    form.direction = [];
    form.district_moscow = [];
    form.region_neardy = null;
    form.outside_mkad = null;
};

const toDefaultForm = () => {
    Object.keys(defaultForm).forEach(key => {
        form[key] = defaultForm[key];
    });

    querySearch.value = null;
};

const resetForm = () => {
    toDefaultForm();
    emit('reset');
};

const changeRegion = () => {
    setDefaultRegionOptions();

    if (
        form.fakeRegion == null ||
        (Array.isArray(form.fakeRegion) && form.fakeRegion.length === 0)
    ) {
        form.region = [];
        return;
    }

    switch (form.fakeRegion) {
        case REGIONS.MSK_AND_MO: {
            form.region = [1, 6];
            return;
        }
        case REGIONS.MSK_INSIDE_MKAD: {
            form.region = [6];
            form.outside_mkad = 0;
            return;
        }
        case REGIONS.MO_AND_MSK_OUTSIDE_MKAD: {
            form.region = [1, 6];
            form.outside_mkad = 1;
            return;
        }
        case REGIONS.MO_AND_REGIONS: {
            form.region = [1];
            form.region_neardy = 1;
            return;
        }
    }

    form.region = [form.fakeRegion];
};

const setQueryFields = async () => {
    Object.assign(form, route.query);

    singleToArrayByKeys(form, formKeysOnlyArray);

    form.purposes = form.purposes.map(Number);
    form.object_type = form.object_type.map(Number);

    const query = { ...form };
    deleteEmptyFields(query);
    await router.replace({ query });
};

toDefaultForm();

onMounted(async () => {
    await setQueryFields();

    watch(
        () => form,
        () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => onSubmit(), 500);
        },
        { deep: true }
    );
});

onBeforeUnmount(() => {
    clearTimeout(timeout);
});

const regions = computed(() => toArray(form.region).map(region => Number(region)));

const hasDirections = computed(() => regions.value.includes(1));
const hasDistricts = computed(() => regions.value.includes(6));
</script>
