<template>
    <UiForm>
        <UiFormGroup>
            <div class="col-12">
                <div class="d-flex align-items-end">
                    <UiInput
                        v-model="form.all"
                        label="Поиск"
                        class="w-100"
                        placeholder="ID запроса, название компании"
                    />
                    <div class="form-search__actions ml-4">
                        <Button
                            @click="extraIsVisible = !extraIsVisible"
                            :badge="filtersCount || undefined"
                        >
                            <span>Фильтры</span>
                        </Button>
                        <Button @click="resetForm" :disabled="!filtersCount" danger>
                            Сбросить фильтры
                        </Button>
                    </div>
                </div>
            </div>
        </UiFormGroup>
        <UiFormGroup>
            <UiCol :cols="12">
                <div class="d-flex gap-2 flex-wrap">
                    <Chip
                        v-for="item in humanizedSelectedFilters"
                        :key="item.value"
                        @delete="removeQueryFilterByKey(item.value)"
                        :value="item.value"
                        :html="item.label"
                    />
                </div>
            </UiCol>
        </UiFormGroup>
        <teleport to="body">
            <Modal @close="extraIsVisible = false" :show="extraIsVisible" width="1400">
                <template #header>
                    <Switch
                        v-model="form.expressRequest"
                        :transform="Number"
                        false-title="Обычный запрос"
                        true-title="Срочный запрос"
                        only-true
                    />
                </template>
                <UiForm>
                    <div class="form-search__extra col-12">
                        <UiFormGroup>
                            <ConsultantPicker
                                v-model="form.consultant_ids"
                                :disabled="withoutConsultant"
                                :options="getConsultantsOptions"
                                :close-on-select="false"
                                label="Консультант"
                                mode="multiple"
                                multiple-property="label"
                                multiple
                                class="col-12"
                            >
                                <template #after>
                                    <UiCheckbox
                                        v-model="form.with_passive_consultant"
                                        :true-value="1"
                                        :false-value="null"
                                    >
                                        С неактивными консультантами
                                    </UiCheckbox>
                                </template>
                            </ConsultantPicker>
                        </UiFormGroup>
                        <UiFormDivider />
                        <UiFormGroup>
                            <MultiSelect
                                v-model="form.dealType"
                                label="Тип сделки"
                                class="col-3"
                                :options="DealTypeList"
                            />
                            <UiCol :cols="5">
                                <p class="form__label">Дата оформления запроса</p>
                                <div class="d-flex gap-1">
                                    <UiDateInput
                                        v-model="form.dateStart"
                                        :max-date="form.dateEnd"
                                        placeholder="Создано после"
                                    />
                                    <UiDateInput
                                        v-model="form.dateEnd"
                                        :min-date="form.dateStart"
                                        placeholder="Создано до"
                                    />
                                </div>
                            </UiCol>
                            <RadioOptions
                                v-model="form.status"
                                label="Статус"
                                class="col-4"
                                :options="entityOptions.request.status"
                                unselect
                                show-radio
                                :rounded="false"
                            />
                        </UiFormGroup>
                        <UiFormDivider />
                        <UiFormGroup>
                            <DoubleInput
                                v-model:first="form.rangeMinArea"
                                v-model:second="form.rangeMaxArea"
                                label="S пола"
                                class="col-6"
                                type="number"
                                unit="м<sup>2</sup>"
                                reactive
                                :validators="formAreaValidators"
                            />
                            <DoubleInput
                                v-model:first="form.rangeMinPricePerFloor"
                                v-model:second="form.rangeMaxPricePerFloor"
                                label="Цена за пол"
                                class="col-6"
                                type="number"
                                :unit="pricePerFloorUnit"
                                reactive
                                :validators="formPricePerFloorValidators"
                            />
                            <DoubleInput
                                v-model:first="form.rangeMinCeilingHeight"
                                v-model:second="form.rangeMaxCeilingHeight"
                                label="Высота потолков"
                                class="col-6"
                                unit="м"
                                type="number"
                                reactive
                                :validators="formCeilingHeightValidators"
                            />
                            <UiInput
                                v-model="form.maxElectricity"
                                placeholder="не более"
                                :v="v$.form.maxElectricity"
                                maska="##########"
                                label="Электричество"
                                unit="кВт"
                                type="number"
                                class="col-6"
                            />
                        </UiFormGroup>
                        <UiFormDivider />
                        <UiFormGroup>
                            <MultiSelect
                                v-model="form.regions"
                                @change="changeRegion"
                                label="Регионы"
                                placeholder="Выберите регионы.."
                                can-deselect
                                class="col-8"
                                searchable
                                :options="getClearedRegionsOptions"
                                mode="multiple"
                                multiple
                                multiple-property="label"
                                :close-on-select="false"
                            />
                            <UiInput
                                v-model="form.maxDistanceFromMKAD"
                                maska="###"
                                :v="v$.form.maxDistanceFromMKAD"
                                placeholder="не более"
                                label="Удаленность от МКАД"
                                unit="км"
                                type="number"
                                reactive
                                class="col-4"
                            />
                            <AnimationTransition>
                                <CheckboxOptions
                                    v-if="hasDistricts"
                                    v-model="form.districts"
                                    label="Округа"
                                    class="col-12"
                                    :options="DistrictList"
                                />
                            </AnimationTransition>
                            <AnimationTransition>
                                <RadioOptions
                                    v-if="hasDistricts"
                                    v-model="form.outside_mkad"
                                    class="col-12"
                                    label="МКАД"
                                    show-radio
                                    :rounded="false"
                                    :options="OutsideMkad"
                                    unselect
                                />
                            </AnimationTransition>
                            <AnimationTransition>
                                <UiCol v-if="hasDirections" :cols="12">
                                    <span class="form__subtitle">Направления МО</span>
                                    <div class="form__row mt-1">
                                        <CheckboxChip
                                            v-for="(directionItem, index) in DirectionList"
                                            :key="index"
                                            v-model="form.directions"
                                            :value="Number(index)"
                                            :text="directionItem.full"
                                            show-checkbox
                                            :rounded="false"
                                        />
                                    </div>
                                    <Switch
                                        v-model="form.region_neardy"
                                        class="mt-3"
                                        true-title="Регионы рядом с МО"
                                        false-title="Только в пределах МО"
                                        :transform="Number"
                                    />
                                </UiCol>
                            </AnimationTransition>
                        </UiFormGroup>
                        <UiFormDivider />
                        <UiFormGroup>
                            <CheckboxOptions
                                v-model="form.objectClasses"
                                :options="ObjectClassList"
                                class="col-4"
                                label="Классы"
                            />
                            <CheckboxOptions
                                v-model="form.gateTypes"
                                :options="GateTypeList"
                                class="col-8"
                                label="Тип ворот"
                            />
                            <SwitchSlider
                                v-model="form.heated"
                                class="col-4"
                                label="Отопление"
                                true-title="С отоплением"
                                false-title="Без отопления"
                                vertical
                            />
                            <UiCol :cols="8">
                                <span class="form__subtitle">Необходимые коммуникации</span>
                                <div class="form__row mt-1">
                                    <RadioChip
                                        v-model="form.water"
                                        :value="1"
                                        :rounded="false"
                                        label="Вода"
                                        unselect
                                        icon="fa-solid fa-droplet"
                                    />
                                    <RadioChip
                                        v-model="form.gaz"
                                        :value="1"
                                        :rounded="false"
                                        label="Газ"
                                        unselect
                                        icon="fa-solid fa-gas-pump"
                                    />
                                    <RadioChip
                                        v-model="form.steam"
                                        :value="1"
                                        :rounded="false"
                                        label="Пар"
                                        unselect
                                        icon="fa-solid fa-cloud"
                                    />
                                    <RadioChip
                                        v-model="form.sewerage"
                                        :value="1"
                                        :rounded="false"
                                        label="Канализация"
                                        unselect
                                        icon="fa-solid fa-faucet-drip"
                                    />
                                    <RadioChip
                                        v-model="form.shelving"
                                        :value="1"
                                        :rounded="false"
                                        label="Стеллажи"
                                        unselect
                                        icon="fa-solid fa-box-archive"
                                    />
                                    <RadioChip
                                        v-model="form.haveCranes"
                                        :value="1"
                                        :rounded="false"
                                        label="Краны"
                                        unselect
                                        icon="fa-solid fa-arrows-up-to-line"
                                    />
                                    <RadioChip
                                        v-model="form.trainLine"
                                        :value="1"
                                        :rounded="false"
                                        label="Ж/Д ветка"
                                        unselect
                                        icon="fa-solid fa-train"
                                    />
                                </div>
                            </UiCol>
                            <UiCol :cols="12">
                                <span class="form__subtitle">Дополнительные требования</span>
                                <div class="form__row mt-1">
                                    <RadioChip
                                        v-model="form.firstFloorOnly"
                                        :value="1"
                                        :rounded="false"
                                        label="Только 1 этаж"
                                        unselect
                                    />
                                    <RadioChip
                                        v-model="form.antiDustOnly"
                                        :value="1"
                                        :rounded="false"
                                        label="Только антипыль"
                                        unselect
                                    />
                                </div>
                            </UiCol>
                        </UiFormGroup>
                        <UiFormDivider />
                        <UiFormGroup>
                            <ObjectTypePicker
                                v-model:value="form.objectTypes"
                                v-model:extra="form.objectTypesGeneral"
                                :extra-value="0"
                                label="Склад"
                                :options="objectPurposesWithSectionsOptions.warehouse"
                                class="col-md-4"
                            />
                            <ObjectTypePicker
                                v-model:value="form.objectTypes"
                                v-model:extra="form.objectTypesGeneral"
                                :extra-value="1"
                                label="Производство"
                                :options="objectPurposesWithSectionsOptions.production"
                                class="col-md-4"
                            />
                            <ObjectTypePicker
                                v-model:value="form.objectTypes"
                                v-model:extra="form.objectTypesGeneral"
                                :extra-value="2"
                                label="Участок"
                                :options="objectPurposesWithSectionsOptions.plot"
                                class="col-md-4"
                            />
                        </UiFormGroup>
                    </div>
                </UiForm>
            </Modal>
        </teleport>
    </UiForm>
</template>

<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import {
    areaRangeValidators,
    ceilingHeightValidators,
    pricePerFloorValidators
} from '@//validators/fields';
import useVuelidate from '@vuelidate/core';
import { onlyPositiveNumber } from '@//validators';
import Modal from '@/components/common/Modal.vue';
import { deleteEmptyFields } from '@/utils/helpers/object/deleteEmptyFields.js';
import { useSearchForm } from '@/composables/useSearchForm.js';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import {
    ActivePassive,
    DealTypeList,
    DirectionList,
    DistrictList,
    GateTypeList,
    ObjectClassList,
    OutsideMkad
} from '@/const/const.js';
import { objectPurposesWithSectionsOptions } from '@/const/options/object.options.js';
import ObjectTypePicker from '@/components/common/Forms/ObjectTypePicker.vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import { entityOptions } from '@/const/options/options.js';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import { useSelectedFilters } from '@/composables/useSelectedFilters.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { useRegionsOptions } from '@/composables/options/useRegionsOptions.js';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import Chip from '@/components/common/Chip.vue';
import { isArray } from '@/utils/helpers/array/isArray.ts';
import { toDateFormat } from '@/utils/formatters/date.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { singleToArrayByKeys } from '@/utils/helpers/object/singleToArrayByKeys.js';
import { toNumberFormat } from '@/utils/formatters/number.js';

const route = useRoute();
const router = useRouter();

defineProps({
    withoutConsultant: {
        type: Boolean,
        default: false
    }
});

const formTemplate = {
    all: null,
    status: null,
    consultant_ids: [],
    dateStart: null,
    dateEnd: null,
    objectTypes: [],
    objectTypesGeneral: [],
    rangeMinArea: null,
    rangeMaxArea: null,
    rangeMinPricePerFloor: null,
    rangeMaxPricePerFloor: null,
    rangeMinCeilingHeight: null,
    rangeMaxCeilingHeight: null,
    maxDistanceFromMKAD: null,
    water: null,
    gaz: null,
    steam: null,
    sewerage: null,
    shelving: null,
    objectClasses: [],
    haveCranes: null,
    heated: null,
    maxElectricity: null,
    antiDustOnly: null,
    expressRequest: null,
    firstFloorOnly: null,
    trainLine: null,
    gateTypes: [],
    dealType: null,
    regions: [],
    districts: [],
    directions: [],
    outside_mkad: null,
    region_neardy: null,

    with_passive_consultant: null
};

const extraIsVisible = ref(false);

const formCeilingHeightValidators = computed(() =>
    ceilingHeightValidators(form.rangeMaxCeilingHeight)
);

const formPricePerFloorValidators = computed(() =>
    pricePerFloorValidators(form.rangeMaxPricePerFloor)
);

const formAreaValidators = computed(() => areaRangeValidators(form.rangeMaxArea));

const pricePerFloorUnit = computed(() => {
    if (form.dealType === null || form.dealType === undefined || form.dealType === 1) return '₽';
    return '₽ за м<sup>2</sup>/год';
});

// options

const { getConsultantsOptions, consultantsOptions } = useConsultantsOptions();
const { getClearedRegionsOptions } = useRegionsOptions();

const hasDirections = computed(() => form.regions.some(item => Number(item) === 1));
const hasDistricts = computed(() => form.regions.some(item => Number(item) === 6));

const changeRegion = () => {
    if (form.regions === null) {
        form.directions = [];
        form.districts = [];
    }

    if (!form.regions.some(item => Number(item.region ?? item) === 1)) {
        form.directions = [];
        form.region_neardy = null;
    }

    if (!form.regions.some(item => Number(item.region ?? item) === 6)) {
        form.districts = [];
        form.outside_mkad = null;
    }
};

const formKeysOnlyArray = [
    'directions',
    'districts',
    'regions',
    'objectTypesGeneral',
    'objectTypes',
    'gateTypesGeneral',
    'gateTypes',
    'objectClasses',
    'consultant_ids'
];

const setQueryFields = async () => {
    Object.assign(form, route.query);

    singleToArrayByKeys(form, formKeysOnlyArray);

    if (form.objectTypes) {
        form.objectTypes = form.objectTypes.map(Number);
    }

    if (form.objectTypesGeneral) {
        form.objectTypesGeneral = form.objectTypesGeneral.map(Number);
    }

    const query = { ...form };

    deleteEmptyFields(query);

    await router.replace({ query });
};

const rules = {
    form: {
        maxDistanceFromMKAD: {
            min: onlyPositiveNumber('Некорректная отрицательная удаленность')
        },
        maxElectricity: {
            min: onlyPositiveNumber()
        }
    }
};

const { resetForm, form } = useSearchForm(formTemplate, {
    syncWithQuery: true,
    setQuery: setQueryFields
});

const v$ = useVuelidate(rules, { form });

const gettersForFilters = {
    consultant_ids: value => {
        if (!isArray(value)) return;

        return value
            .map(
                item =>
                    consultantsOptions.value.find(elem => Number(elem.value) === Number(item))
                        ?.label
            )
            .filter(isNotNullish)
            .join(', ');
    },
    dateStart: value => toDateFormat(value, 'DD.MM.YYYY'),
    dateEnd: value => toDateFormat(value, 'DD.MM.YYYY'),
    status: value => {
        if (!value) return null;
        return ActivePassive[value];
    },
    maxElectricity: value => toNumberFormat(value) + 'кВт',
    rangeMinArea: value => toNumberFormat(value) + 'м',
    rangeMaxArea: value => toNumberFormat(value) + 'м',
    rangeMinPricePerFloor: value => toNumberFormat(value) + '₽',
    rangeMaxPricePerFloor: value => toNumberFormat(value) + '₽',
    rangeMinCeilingHeight: value => toNumberFormat(value) + 'м',
    rangeMaxCeilingHeight: value => toNumberFormat(value) + 'м'
};

const { filtersCount, humanizedSelectedFilters, removeQueryFilterByKey } = useSelectedFilters(
    form,
    gettersForFilters
);

// passive consultants

watch(
    () => form.with_passive_consultant,
    value => {
        if (value) {
            form.consultant_ids = [];
            resumeConsultantsWatch();
        } else {
            pauseConsultantsWatch();
        }
    }
);

const { pause: pauseConsultantsWatch, resume: resumeConsultantsWatch } = watch(
    () => form.consultant_ids,
    () => {
        form.with_passive_consultant = null;
    },
    { deep: true }
);
</script>
