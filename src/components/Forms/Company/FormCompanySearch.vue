<template>
    <UiForm>
        <UiFormGroup>
            <UiCol :cols="12">
                <div class="d-flex align-items-end flex-column flex-md-row">
                    <UiInput
                        v-model="form.all"
                        @keydown.enter="onSubmit"
                        label="Поиск"
                        placeholder="Название компании, ID компании, ФИО брокера, ФИО контакта, телефон.."
                        class="w-100"
                    />
                    <div class="ml-md-2 mt-2 mt-md-0 d-flex gap-2 w-100">
                        <UiButton
                            @click="extraIsVisible = !extraIsVisible"
                            :badge="filtersCount || undefined"
                            icon="fa-solid fa-sliders"
                            color="light"
                        >
                            Фильтры
                        </UiButton>
                        <UiButton
                            @click="resetForm"
                            :disabled="!filtersCount"
                            color="danger-light"
                            icon="fa-solid fa-trash"
                        >
                            Очистить фильтры
                        </UiButton>
                        <AnimationTransition :speed="0.6">
                            <UiButton
                                v-if="hasSort"
                                @click="clearSort"
                                icon="fa-solid fa-trash"
                                color="danger-light"
                            >
                                Очистить сортировку
                            </UiButton>
                        </AnimationTransition>
                    </div>
                </div>
            </UiCol>
        </UiFormGroup>
        <UiFormGroup>
            <UiCol v-if="humanizedSelectedQueryFilters.length" :cols="12" class="mb-3">
                <div class="company-table__filters">
                    <Chip
                        v-for="item in humanizedSelectedQueryFilters"
                        :key="item.value"
                        @delete="removeFilter(item.value)"
                        :value="item.value"
                        :html="item.label"
                    />
                </div>
            </UiCol>
        </UiFormGroup>
        <teleport to="body">
            <Modal
                @close="extraIsVisible = false"
                :show="extraIsVisible"
                title="Фильтры"
                :width="1000"
            >
                <UiForm>
                    <UiFormGroup>
                        <ConsultantPicker
                            v-model="form.consultant_id"
                            :options="getConsultantsOptions"
                            class="col-md-6 col-12"
                            :disabled="form.with_passive_consultant"
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
                        <CheckboxOptions
                            v-model="form.categories"
                            class="col-12"
                            label="Категория"
                            :options="CompanyCategories"
                        />
                    </UiFormGroup>
                    <UiFormGroup>
                        <SearchableOptionsPicker
                            v-model="form.activity_group_ids"
                            :options="ActivityGroupList"
                            :transform="Number"
                            :multiple-label="activityGroupMultipleLabelFn"
                            title="Группа деятельности"
                            label="Группа деятельности"
                            class="col-12 col-md-6"
                            mode="multiple"
                            multiple-property="label"
                            multiple
                        />
                        <SearchableOptionsPicker
                            v-model="form.activity_profile_ids"
                            :options="ActivityProfileList"
                            :transform="Number"
                            :multiple-label="activityProfileMultipleLabelFn"
                            title="Профиль деятельности"
                            label="Профиль деятельности"
                            class="col-12 col-md-6"
                            mode="multiple"
                            multiple-property="label"
                            multiple
                        />
                        <MultiSelect
                            v-model="form.product_ranges"
                            :close-on-select="false"
                            :loading="false"
                            searchable
                            resolve-on-load
                            label="Номенклатура товара"
                            class="col-12"
                            :options="getFlattedProductRangesOptions"
                            mode="multiple"
                            multiple
                            :disabled="form.without_product_ranges"
                        >
                            <template #after>
                                <div class="d-flex gap-2">
                                    <UiCheckbox
                                        v-model="form.without_product_ranges"
                                        :true-value="1"
                                        :false-value="null"
                                        label="Без номенклатуры"
                                    />
                                    <UiCheckbox
                                        v-model="form.show_product_ranges"
                                        :true-value="0"
                                        :false-value="null"
                                    >
                                        Со скрытой номенклатурой
                                    </UiCheckbox>
                                </div>
                            </template>
                            <template #chip="{ option, removeByIndex, index }">
                                <Chip
                                    @delete="removeByIndex(index)"
                                    :value="option"
                                    :html="option"
                                />
                            </template>
                        </MultiSelect>
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <UiCol :cols="12">
                            <p class="font-weight-semi fs-2">
                                <UiTooltipIcon
                                    icon="fa-solid fa-link"
                                    class="text-success"
                                    tooltip="Новый фильтр"
                                />
                                Связь с опросами
                            </p>
                        </UiCol>
                        <UiCol :cols="12">
                            <UiCheckbox
                                v-model="form.without_surveys"
                                :true-value="1"
                                :false-value="null"
                            >
                                Компании без завершенных опросов
                            </UiCheckbox>
                        </UiCol>
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <UiCol :cols="12">
                            <p class="font-weight-semi fs-2">
                                <UiTooltipIcon
                                    icon="fa-solid fa-star"
                                    class="text-success"
                                    tooltip="Новый фильтр"
                                />
                                Связь с задачами
                            </p>
                        </UiCol>
                        <UiCol :cols="12">
                            <UiCheckbox
                                v-model="form.with_current_user_tasks"
                                :true-value="1"
                                :false-value="null"
                            >
                                Компании с активными задачами для меня
                            </UiCheckbox>
                        </UiCol>
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <UiCol :cols="12">
                            <p class="font-weight-semi fs-2">
                                <UiTooltipIcon
                                    icon="fa-solid fa-link"
                                    class="text-success"
                                    tooltip="Новый фильтр"
                                />
                                Связь с контактами
                            </p>
                        </UiCol>
                        <UiCol :cols="12">
                            <UiCheckbox
                                v-model="form.with_active_contacts"
                                :true-value="1"
                                :false-value="null"
                            >
                                Компании с активными контактами
                            </UiCheckbox>
                        </UiCol>
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <UiCol :cols="12">
                            <p class="font-weight-semi fs-2">
                                <UiTooltipIcon
                                    icon="fa-solid fa-star"
                                    class="text-success"
                                    tooltip="Новый фильтр"
                                />
                                Связь с запросами
                            </p>
                        </UiCol>
                        <UiCol :cols="12">
                            <div class="d-flex gap-1 flex-wrap">
                                <RadioChip
                                    v-model="form.requests_filter"
                                    value="active"
                                    unselect
                                    icon="fa-solid fa-up-long text-primary"
                                    :rounded="false"
                                    label="С активными запросами"
                                />
                                <RadioChip
                                    v-model="form.requests_filter"
                                    value="not-active"
                                    unselect
                                    icon="fa-solid fa-up-long text-grey"
                                    :rounded="false"
                                    label="Без активных запросов"
                                />
                                <RadioChip
                                    v-model="form.requests_filter"
                                    value="passive"
                                    unselect
                                    :rounded="false"
                                    icon="fa-solid fa-ban text-danger"
                                    label="С архивными запросами"
                                />
                                <RadioChip
                                    v-model="form.requests_filter"
                                    value="none"
                                    unselect
                                    icon="fa-solid fa-xmark"
                                    :rounded="false"
                                    label="Без запросов когда-либо"
                                />
                            </div>
                        </UiCol>
                        <AnimationTransition :speed="0.5">
                            <UiCol v-if="hasRequestsFilter" :cols="12">
                                <div class="py-1 px-2 dashboard-bg-light br-1">
                                    <DoubleInput
                                        v-model:first="form.requests_area_min"
                                        v-model:second="form.requests_area_max"
                                        :disabled="form.requests_filter === 'none'"
                                        label="S пола в запросе"
                                        type="number"
                                        unit="м<sup>2</sup>"
                                    />
                                </div>
                            </UiCol>
                        </AnimationTransition>
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <SwitchSlider
                            v-model="form.status"
                            class="col-5"
                            label="Статус"
                            unknown-title="Любой"
                            true-title="Только актив"
                            false-title="Только пассив"
                            vertical
                        />
                        <UiDateInput
                            v-model="form.dateStart"
                            placeholder="Дата внесения"
                            label="Внесено после"
                            :max-date="new Date()"
                            class="col-3"
                        />
                        <UiDateInput
                            v-model="form.dateEnd"
                            placeholder="Дата внесения"
                            label="Внесено до"
                            class="col-3"
                            :min-date="form.dateStart"
                        />
                    </UiFormGroup>
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
import {
    ActivePassive,
    ActivityGroupList,
    ActivityProfileList,
    CompanyCategories
} from '@/const/const.js';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import { deleteEmptyFields } from '@/utils/helpers/object/deleteEmptyFields.js';
import Modal from '@/components/common/Modal.vue';
import { computed, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchForm } from '@/composables/useSearchForm.js';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import { singleToArrayByKeys } from '@/utils/helpers/object/singleToArrayByKeys.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import SearchableOptionsPicker from '@/components/common/Forms/SearchableOptionsPicker.vue';
import { useProductRangesOptions } from '@/composables/options/useProductRangesOptions.js';
import Chip from '@/components/common/Chip.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import { plural } from '@/utils/plural.js';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';
import { useSelectedFilters } from '@/composables/useSelectedFilters.js';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import UiButton from '@/components/common/UI/UiButton.vue';
import { isArray } from '@/utils/helpers/array/isArray.ts';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import { companyOptions } from '@/const/options/company.options.js';
import { toDateFormat } from '@/utils/formatters/date.ts';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['search', 'reset']);

const extraIsVisible = shallowRef(false);

const setQueryFields = async () => {
    Object.assign(form, route.query);

    singleToArrayByKeys(form, [
        'categories',
        'product_ranges',
        'activity_group_ids',
        'activity_profile_ids'
    ]);

    let query = { ...form };
    deleteEmptyFields(query);
    await router.replace({ query });
};

const onSubmit = query => {
    emit('search', query);
};

const { resetForm, form } = useSearchForm(
    {
        all: null,
        consultant_id: null,
        categories: [],
        activityGroup: null,
        activityProfile: null,
        dateStart: null,
        dateEnd: null,
        status: null,
        product_ranges: [],
        without_product_ranges: null,
        show_product_ranges: null,
        activity_profile_ids: [],
        activity_group_ids: [],
        requests_filter: null,
        requests_area_min: null,
        requests_area_max: null,
        with_passive_consultant: null,
        with_current_user_tasks: null,
        with_active_contacts: null,
        without_surveys: null
    },
    {
        submit: onSubmit,
        syncWithQuery: true,
        setQuery: setQueryFields,
        transform: value => {
            if (value.dateStart) {
                value.dateStart = dayjs(value.dateStart).toJSON();
            }

            if (value.dateEnd) {
                value.dateEnd = dayjs(value.dateEnd).toJSON();
            }

            return value;
        }
    }
);

watch(
    () => form.without_product_ranges,
    value => {
        if (value) form.product_ranges = [];
    }
);

watch(
    () => form.with_passive_consultant,
    value => {
        if (value) form.consultant_id = null;
    }
);

const hasRequestsFilter = computed(() => isNotNullish(form.requests_filter));

watch(hasRequestsFilter, value => {
    if (!value) {
        form.requests_area_min = null;
        form.requests_area_max = null;
    }
});

watch(
    () => form.requests_filter,
    value => {
        if (value === 'area') {
            form.requests_area_min = null;
            form.requests_area_max = null;
        }
    }
);

// options

const { getConsultantsOptions } = useConsultantsOptions();
const { getFlattedProductRangesOptions } = useProductRangesOptions();

function activityProfileMultipleLabelFn(elements) {
    return plural(
        elements.length,
        'Выбран %d профиль',
        'Выбраны %d профиля',
        'Выбрано %d профилей'
    );
}

function activityGroupMultipleLabelFn(elements) {
    return plural(elements.length, 'Выбрана %d группа', 'Выбрано %d группы', 'Выбрано %d групп');
}

// filters

const { consultantsOptions } = useConsultantsOptions();

const gettersForFilters = {
    consultant_id: value => {
        if (consultantsOptions.value.length)
            return consultantsOptions.value.find(element => Number(element.value) === Number(value))
                ?.label;
        return null;
    },
    categories: value => {
        if (isArray(value) && !isEmptyArray(value))
            return value.map(category => CompanyCategories[category]).join(', ');
        return null;
    },
    activityGroup: value => companyOptions.activityGroup[value],
    activityProfile: value => companyOptions.activityProfile[value],
    dateStart: value => toDateFormat(value, 'DD.MM.YYYY'),
    dateEnd: value => toDateFormat(value, 'DD.MM.YYYY'),
    status: value => {
        if (!value) return null;
        return ActivePassive[value];
    },
    productRanges: value => {
        return value.join(', ');
    },
    activity_group_ids: value => {
        if (isArray(value) && !isEmptyArray(value))
            return value.map(group => companyOptions.activityGroup[group]).join(', ');
        return null;
    },
    activity_profile_ids: value => {
        if (isArray(value) && !isEmptyArray(value))
            return value.map(profile => companyOptions.activityProfile[profile]).join(', ');
        return null;
    }
};

const { filtersCount, humanizedSelectedQueryFilters } = useSelectedFilters(
    form,
    gettersForFilters,
    { ignore: new Set(['sort']) }
);

function removeFilter(filter) {
    const query = { ...route.query };

    delete query[filter];

    router.replace({ query });
}

const hasSort = computed(() => isNotNullish(route.query?.sort));

function clearSort() {
    router.replace({ query: { ...route.query, sort: null } });
}
</script>
