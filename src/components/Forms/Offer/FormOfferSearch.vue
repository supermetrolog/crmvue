<template>
    <div class="company-request-search-form">
        <Form @submit="onSubmit">
            <FormGroup class="mb-2">
                <Input
                    v-model="form.all"
                    @keydown.enter="onSubmit"
                    label="Поиск"
                    placeholder="ID, адрес, собственник, телефон, ФИО"
                    class="col-12 main-input"
                />
            </FormGroup>
            <FormGroup>
                <div class="col-12">
                    <div class="offer-search__actions">
                        <Button
                            @click="extraVisible = !extraVisible"
                            icon
                            :badge="filterCount || false"
                        >
                            <span>Фильтры</span>
                            <i v-if="extraVisible" class="fas fa-angle-up"></i>
                            <i v-else class="fas fa-angle-down"></i>
                        </Button>
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
                        <AnimationTransition>
                            <Button
                                v-for="btn in additionalButtons"
                                :key="btn.label"
                                @click="$emit(btn.event)"
                                danger
                                class="ml-auto"
                            >
                                {{ btn.label }}
                            </Button>
                        </AnimationTransition>
                    </div>
                </div>
            </FormGroup>
            <teleport to="body">
                <Modal
                    @close="extraVisible = false"
                    :show="extraVisible"
                    title="Фильтры предложений"
                    width="1200"
                    style="z-index: 5000"
                >
                    <Form>
                        <FormGroup class="mb-2">
                            <ConsultantPicker
                                v-model="form.agent_id"
                                :options="getConsultantsOptions"
                                class="col-12 col-md-3"
                            />
                            <MultiSelect
                                v-model="form.deal_type"
                                label="Тип сделки"
                                class="col-md-3 col-12 mb-2"
                                :options="DealTypeList"
                                placeholder="Выберите тип.."
                            />
                            <Input
                                v-if="hasApproximateDistance"
                                v-model="form.approximateDistanceFromMKAD"
                                maska="###"
                                placeholder="не более"
                                label="Удаленность от МКАД +30%"
                                class="col-md-3 col-12"
                                unit="км"
                                type="number"
                            />
                            <Input
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
                            <Input
                                v-model="form.rangeMinElectricity"
                                placeholder="не менее"
                                maska="##########"
                                label="Электричество"
                                class="col-md-3 col-12"
                                unit="кВт"
                                type="number"
                                :v="v$.form.rangeMinElectricity"
                                reactive
                            />
                            <DoubleInput
                                v-model:first="form.rangeMinArea"
                                v-model:second="form.rangeMaxArea"
                                label="S пола"
                                class="col-md-3 col-12"
                                unit="м<sup>2</sup>"
                                type="number"
                                :validators="formAreaValidators"
                                reactive
                            />
                            <DoubleInput
                                v-model:first="form.rangeMinPricePerFloor"
                                v-model:second="form.rangeMaxPricePerFloor"
                                label="Цена (продажи, аренды, о-х)"
                                class="col-md-3 col-12"
                                unit="₽"
                                type="number"
                                reactive
                                :validators="formPricePerFloorValidators"
                            />
                            <DoubleInput
                                v-model:first="form.rangeMinCeilingHeight"
                                v-model:second="form.rangeMaxCeilingHeight"
                                label="Высота потолков"
                                class="col-md-3 col-12"
                                unit="м"
                                type="number"
                                reactive
                                :validators="formCeilingHeightValidators"
                            />
                            <MultiSelect
                                v-model="form.fakeRegion"
                                @change="changeRegion"
                                label="Регионы"
                                placeholder="Выберите регион.."
                                can-deselect
                                class="col-md-3 col-sm-6 col-12"
                                district_moscow
                                searchable
                                :options="getRegionsOptions"
                            />
                        </FormGroup>
                        <FormGroup class="mb-2">
                            <AnimationTransition>
                                <div v-if="form.region.find(item => item == 6)" class="col-12 mb-2">
                                    <span class="form__subtitle">Округа Москвы</span>
                                    <div class="form__row mt-1">
                                        <CheckboxChip
                                            v-for="(districtItem, index) in DistrictList"
                                            :key="index"
                                            v-model="form.district_moscow"
                                            :value="Number(index)"
                                            :text="districtItem"
                                        />
                                    </div>
                                </div>
                            </AnimationTransition>
                            <AnimationTransition>
                                <div v-if="form.region.find(item => item == 1)" class="col-12 mb-2">
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
                                </div>
                            </AnimationTransition>
                            <CheckboxOptions
                                v-model="form.class"
                                class="col-md-2 col-12"
                                label="Классы"
                                :options="ObjectClassList"
                            />
                            <CheckboxOptions
                                v-model="form.gates"
                                class="col-md-5 col-12"
                                label="Тип ворот"
                                :options="GateTypeList"
                            />
                            <CheckboxOptions
                                v-model="form.floor_types"
                                class="col-md-5 col-12"
                                label="Тип пола"
                                :options="realFloorTypeOptions"
                            />
                        </FormGroup>
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
                        <div class="row mt-2">
                            <div class="col-12">
                                <span class="form__subtitle">Тип объекта</span>
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
                            <p class="form__block">Реклама</p>
                            <div class="row">
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
                            </div>
                        </div>
                    </Form>
                </Modal>
            </teleport>
        </Form>
    </div>
</template>

<script setup>
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import {
    areaRangeValidators,
    ceilingHeightValidators,
    pricePerFloorValidators
} from '@//validators/fields';
import useVuelidate from '@vuelidate/core';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import Modal from '@/components/common/Modal.vue';
import ObjectTypePicker from '@/components/common/Forms/ObjectTypePicker.vue';
import { objectPurposesWithSectionsOptions } from '@/const/options/object.options.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useRegionsOptions } from '@/composables/options/useRegionsOptions.js';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { helpers, minValue } from '@vuelidate/validators';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import {
    DealTypeList,
    DirectionList,
    DistrictList,
    GateTypeList,
    ObjectClassList
} from '@/const/const.js';
import { realFloorTypeOptions } from '@/const/options/floor.options.js';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';
import { useDebounceFn } from '@vueuse/core';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { cloneObject } from '@/utils/index.js';

const emit = defineEmits(['close', 'search', 'reset', 'resetSelected', 'changed-query']);
const props = defineProps({
    additionalButtons: {
        type: Array,
        default: () => []
    },
    objectsCount: {
        type: Number,
        default: 0
    },
    noUrl: {
        type: Boolean,
        default: false
    },
    queryParams: {
        type: Object
    }
});

const REGIONS = {
    MSK_AND_MO: 'mskandmo',
    MSK_INSIDE_MKAD: 'mskinsidemkad',
    MO_AND_MSK_OUTSIDE_MKAD: 'moandmskoutsidemkad',
    MO_AND_REGIONS: 'moandregionneardy'
};

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
    region_neardy: null
};

const store = useStore();

const form = reactive({});
const extraVisible = ref(false);

const { getRegionsOptions } = useRegionsOptions();
const { getConsultantsOptions } = useConsultantsOptions();

const formCeilingHeightValidators = computed(() =>
    ceilingHeightValidators(form.rangeMaxCeilingHeight)
);
const formPricePerFloorValidators = computed(() =>
    pricePerFloorValidators(form.rangeMaxPricePerFloor)
);
const formAreaValidators = computed(() => areaRangeValidators(form.rangeMaxArea));

const resetIsDisabled = computed(() => {
    return filterCount.value === 0 && (form?.all?.length === 0 || form?.all == null);
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
    emit('search', form);
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
        if (typeof defaultForm[key] === 'object' || isArray(defaultForm[key]))
            form[key] = cloneObject(defaultForm[key]);
        else form[key] = defaultForm[key];
    });

    form.all = null;
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

const hasApproximateDistance = computed(() => {
    return Object.hasOwnProperty.call(form, 'approximateDistanceFromMKAD');
});

const setQueryFields = async () => {
    Object.assign(form, props.queryParams);
};

toDefaultForm();

watch(
    () => props.queryParams,
    () => {
        setQueryFields();
    },
    { deep: true }
);

const debouncedOnSubmit = useDebounceFn(onSubmit, 500);

watch(
    form,
    () => {
        debouncedOnSubmit();
    },
    { deep: true }
);

watch(
    () => form.all,
    () => {
        emit('changed-query');
    }
);

onMounted(() => {
    setQueryFields();
});
</script>
