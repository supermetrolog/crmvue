<template>
    <UiForm>
        <UiFormGroup>
            <div class="col-12 col-md-6">
                <UiInput
                    v-model="form.all"
                    @keydown.enter="onSubmit"
                    label="Поиск"
                    placeholder="Название компании, ID компании, ФИО брокера, ФИО контакта, телефон"
                />
            </div>
            <div class="col-12 col-md-4 align-self-end">
                <div class="form-search__actions">
                    <Button
                        @click="extraIsVisible = !extraIsVisible"
                        :badge="filtersCount || null"
                        icon
                    >
                        <span>Фильтры</span>
                        <i class="icon fa-solid fa-sliders"></i>
                    </Button>
                </div>
            </div>
            <div class="col-12">
                <Button @click="resetForm" :disabled="!filtersCount" danger small icon>
                    <i class="fa-solid fa-xmark-circle"></i>
                    <span>Сбросить фильтры</span>
                </Button>
            </div>
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
                                        С отключенной номенклатурой
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
                        <SwitchSlider
                            v-model="form.status"
                            class="col-5"
                            label="Статус"
                            unknown-title="Любой"
                            true-title="Только актив"
                            false-title="Только пассив"
                            vertical
                        />
                        <DoubleInput
                            v-model:first="form.dateStart"
                            v-model:second="form.dateEnd"
                            label="Дата внесения"
                            class="col-6"
                            type="date"
                            :validators="formDateValidators"
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
import { ActivityGroupList, ActivityProfileList, CompanyCategories } from '@/const/const.js';
import Button from '@/components/common/Button.vue';
import { maxDate } from '@//validators';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import { deleteEmptyFields } from '@/utils/helpers/object/deleteEmptyFields.js';
import Modal from '@/components/common/Modal.vue';
import { computed, reactive, shallowRef, watch } from 'vue';
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

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['search', 'reset']);

const extraIsVisible = shallowRef(false);

const formDateValidators = computed(() => [
    {
        func: maxDate(form.dateEnd),
        message: 'Дата ОТ не может быть позже ДО',
        property: 'first'
    }
]);

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
        activity_group_ids: []
    },
    {
        submit: onSubmit,
        syncWithQuery: true,
        setQuery: setQueryFields
    }
);

const { filtersCount } = useSelectedFilters(form);

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
</script>
