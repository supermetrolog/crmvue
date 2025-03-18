<template>
    <UiForm @submit="onSubmit" class="form-offer-search">
        <UiFormGroup>
            <UiInput
                v-model="form.all"
                @keydown.enter="onSubmit"
                placeholder="Поиск по: id, адрес, собственник, телефон, ФИО"
                class="col-6"
            />
            <div class="col-6">
                <div class="offer-search__actions">
                    <Button @click="extraVisible = !extraVisible" icon :badge="filtersCount">
                        <span>Фильтры</span>
                        <i class="fa-solid fa-sliders icon" />
                    </Button>
                    <Button @click="resetForm" :disabled="resetIsDisabled">
                        <i class="fa-regular fa-trash-can icon"></i>
                    </Button>
                    <Button
                        @click="toggleFavorites"
                        warning
                        :active="form.favorites"
                        :badge="favoritesCount || false"
                    >
                        избранные
                    </Button>
                </div>
            </div>
            <div class="col-12">
                <div class="company-table__filters">
                    <Chip
                        v-for="item in humanizedSelectedFilters"
                        :key="item.value"
                        @delete="removeFilter(item.value)"
                        :value="item.value"
                        :html="item.label"
                    />
                </div>
            </div>
        </UiFormGroup>
        <teleport to="body">
            <Modal
                @close="extraVisible = false"
                :show="extraVisible"
                title="Фильтры предложений"
                width="1200"
                style="z-index: 5000"
            >
                <UiForm>
                    <UiFormGroup class="mb-2">
                        <ConsultantPicker
                            v-model="form.agent_id"
                            :options="getConsultantsOptions"
                            class="col-12 col-md-4"
                        />
                        <MultiSelect
                            v-model="form.deal_type"
                            label="Тип сделки"
                            class="col-md-4 col-12 mb-2"
                            :options="DealTypeList"
                            placeholder="Выберите тип.."
                        />
                        <UiInput
                            v-model="form.rangeMinElectricity"
                            placeholder="не менее"
                            maska="##########"
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
                        <hr class="col-12" />
                        <MultiSelect
                            v-model="form.region"
                            @change="changeRegion"
                            :v="v$.form.regions"
                            :options="getClearedRegionsOptions"
                            :close-on-select="false"
                            :hide-selected="false"
                            multiple-property="label"
                            label="Регионы"
                            class="col-7"
                            mode="multiple"
                            searchable
                            multiple
                            required
                        />
                        <UiInput
                            v-if="hasApproximateDistance"
                            v-model="form.approximateDistanceFromMKAD"
                            maska="###"
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
                            <RadioOptions
                                v-if="hasDistricts"
                                v-model="form.outside_mkad"
                                class="col-5"
                                label="МКАД"
                                :options="OutsideMkad"
                                unselect
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
                        <hr class="col-12" />
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
                        <hr class="col-12" />
                    </UiFormGroup>
                    <p class="form__block">Коммуникации</p>
                    <UiFormGroup>
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
                    </UiFormGroup>
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
                        <hr class="col-12" />
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
                    </div>
                    <p class="form__block">Реклама</p>
                    <div>
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
                </UiForm>
            </Modal>
        </teleport>
    </UiForm>
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
import {
    objectOptions,
    objectPurposesWithSectionsOptions
} from '@/const/options/object.options.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useRegionsOptions } from '@/composables/options/useRegionsOptions.js';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { helpers, minValue } from '@vuelidate/validators';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import {
    ActivePassiveFUCK,
    DealTypeList,
    DirectionList,
    DistrictList,
    GateTypeList,
    ObjectClassList,
    OutsideMkad,
    YesNo
} from '@/const/const.js';
import { floorOptions, realFloorTypeOptions } from '@/const/options/floor.options.js';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';
import { useDebounceFn } from '@vueuse/core';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import Chip from '@/components/common/Chip.vue';
import { useSelectedFilters } from '@/composables/useSelectedFilters.js';
import { dealOptions } from '@/const/options/deal.options.js';
import { defaultsOptions } from '@/const/options/options.js';
import { locationOptions } from '@/const/options/location.options.js';
import { useStore } from 'vuex';
import Switch from '@/components/common/Forms/Switch.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isEmptyString } from '@/utils/helpers/string/isEmptyString.js';

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

const hasDirections = computed(() => form.region.includes(1));
const hasDistricts = computed(() => form.region.includes(6));

// other

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

const form = reactive({});
const extraVisible = ref(false);

const { getClearedRegionsOptions } = useRegionsOptions();
const { getConsultantsOptions } = useConsultantsOptions();

const formCeilingHeightValidators = computed(() =>
    ceilingHeightValidators(form.rangeMaxCeilingHeight)
);
const formPricePerFloorValidators = computed(() =>
    pricePerFloorValidators(form.rangeMaxPricePerFloor)
);
const formAreaValidators = computed(() => areaRangeValidators(form.rangeMaxArea));

const resetIsDisabled = computed(() => {
    return filtersCount.value === 0 && (isNullish(form.all) || isEmptyString(form.all));
});

// filters

const store = useStore();
const { consultantsOptions } = useConsultantsOptions();

const gettersForFilters = {
    rangeMinElectricity: value => value + ' кВт',
    rangeMaxDistanceFromMKAD: value => value + ' км',
    deal_type: value => dealOptions.type[Number(value) + 1].toUpperCase(),
    agent_id: value => {
        return consultantsOptions.value.find(elem => Number(elem.value) === Number(value))?.label;
    },
    consultant_id: value => {
        return consultantsOptions.value.find(elem => Number(elem.value) === Number(value))?.label;
    },
    rangeMinArea: value => value + ' м<sup>2</sup>',
    rangeMaxArea: value => value + ' м<sup>2</sup>',
    rangeMinPricePerFloor: value => value + ' р',
    rangeMaxPricePerFloor: value => value + ' р',
    rangeMinCeilingHeight: value => value + ' м',
    rangeMaxCeilingHeight: value => value + ' м',
    class: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(elem => objectOptions.class[elem]).join(', ');
    },
    gates: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(elem => GateTypeList[elem]).join(', ');
    },
    heated: value => {
        if (!value) return null;
        return defaultsOptions.booleanSimple[value];
    },
    floor_types: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(elem => floorOptions.floorTypes[elem]).join(', ');
    },
    purposes: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value
            .map(element => {
                const param = objectOptions.purposes[element];
                return `<i title="${param.name}"" class="' ${param.icon} '"></i>`;
            })
            .join(', ');
    },
    object_type: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(element => objectOptions.typeGeneral[element - 1].name).join(', ');
    },
    region: value => {
        if (!value || !store.getters.REGION_LIST) return null;

        return value
            .map(key => store.getters.REGION_LIST.find(region => region.value == key)?.label)
            .join(', ');
    },
    district_moscow: value => {
        if (!value) return null;
        if (!isArray(value)) value = [value];
        return value.map(key => locationOptions.district[key]).join(', ');
    },
    direction: value => {
        if (!value) return null;
        if (!isArray(value)) value = [value];
        return value.map(elem => locationOptions.directionWithShort[elem].full).join(', ');
    },
    status: value => {
        if (!value) return null;
        return ActivePassiveFUCK[value];
    },
    ad_realtor: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_cian: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_yandex: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_free: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_avito: value => {
        if (!value) return null;
        return YesNo[value];
    },
    sort: value => value
};

const { humanizedSelectedFilters, filtersCount } = useSelectedFilters(form, gettersForFilters, {
    useFakeRegion: false
});

function removeFilter(keyFilter) {
    if (keyFilter === 'fakeRegion') {
        form['region'] = [];
    }

    if (keyFilter === 'region') {
        form['fakeRegion'] = null;
        form['direction'] = [];
        form['district_moscow'] = [];
        form['outside_mkad'] = null;
        form['region_neardy'] = null;
    }

    form[keyFilter] = defaultForm[keyFilter];
}

// validation

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
    if (isArray(form.region) && isEmptyArray(form.region)) setDefaultRegionOptions();
};

const hasApproximateDistance = computed(() => {
    return Object.hasOwnProperty.call(form, 'approximateDistanceFromMKAD');
});

const toggleFavorites = () => {
    if (form.favorites) form.favorites = null;
    else form.favorites = 1;
};

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
