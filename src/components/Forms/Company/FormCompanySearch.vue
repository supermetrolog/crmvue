<template>
    <Form @submit="onSubmit">
        <FormGroup>
            <div class="col-12 col-md-6">
                <Input
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
                        :badge="filtersCount || false"
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
        </FormGroup>
        <teleport to="body">
            <Modal
                @close="extraIsVisible = false"
                :show="extraIsVisible"
                title="Фильтры"
                :width="1000"
            >
                <Form>
                    <FormGroup>
                        <ConsultantPicker
                            v-model="form.consultant_id"
                            :options="getConsultantsOptions"
                            class="col-md-6 col-12"
                            :disabled="form.with_passive_consultant"
                        >
                            <template #after>
                                <Checkbox
                                    v-model="form.with_passive_consultant"
                                    :true-value="1"
                                    :false-value="null"
                                >
                                    С неактивными консультантами
                                </Checkbox>
                            </template>
                        </ConsultantPicker>
                    </FormGroup>
                    <FormDivider />
                    <FormGroup>
                        <CheckboxOptions
                            v-model="form.categories"
                            class="col-12"
                            label="Категория"
                            :options="CompanyCategories"
                        />
                    </FormGroup>
                    <FormGroup>
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
                            v-model="form.productRanges"
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
                                <Checkbox
                                    v-model="form.without_product_ranges"
                                    :true-value="1"
                                    :false-value="null"
                                >
                                    Без номенклатуры
                                </Checkbox>
                            </template>
                            <template #chip="{ option, removeByIndex, index }">
                                <Chip
                                    @delete="removeByIndex(index)"
                                    :value="option"
                                    :html="option"
                                />
                            </template>
                        </MultiSelect>
                    </FormGroup>
                    <FormDivider />
                    <FormGroup>
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
                    </FormGroup>
                </Form>
            </Modal>
        </teleport>
    </Form>
</template>

<script setup>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
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
import Checkbox from '@/components/common/Forms/Checkbox.vue';
import plural from 'plural-ru';
import FormDivider from '@/components/common/Forms/FormDivider.vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['search', 'reset']);

const formTemplate = {
    all: null,
    consultant_id: null,
    categories: [],
    activityGroup: null,
    activityProfile: null,
    dateStart: null,
    dateEnd: null,
    status: null,
    productRanges: [],
    without_product_ranges: null,

    activity_profile_ids: [],
    activity_group_ids: []
};

const form = reactive({});
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
        'productRanges',
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

const { filtersCount, resetForm } = useSearchForm(form, {
    template: formTemplate,
    submit: onSubmit,
    syncWithQuery: true,
    setQuery: setQueryFields
});

watch(
    () => form.without_product_ranges,
    value => {
        if (value) form.productRanges = [];
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
