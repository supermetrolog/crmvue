<template>
    <UiForm>
        <UiFormGroup>
            <div class="col-12">
                <div class="d-flex align-items-end flex-column flex-md-row">
                    <UiInput
                        v-model="form.search"
                        label="Поиск"
                        placeholder="ID, адрес, собственник, название, описание"
                        class="w-100"
                    />
                    <div class="ml-md-2 mt-2 mt-md-0 d-flex gap-2 w-100">
                        <UiButton
                            @click="filtersIsVisible = true"
                            icon="fa-solid fa-sliders"
                            color="light"
                        >
                            Фильтры
                        </UiButton>
                        <UiButton
                            @click="resetForm"
                            :disabled="filtersCount === 0"
                            color="danger-light"
                            icon="fa-solid fa-trash"
                        >
                            Очистить
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
            </div>
        </UiFormGroup>
    </UiForm>
    <div class="d-flex gap-2 flex-wrap mt-2">
        <Chip
            v-for="item in humanizedSelectedFilters"
            :key="item.value"
            @delete="removeFilter(item.value)"
            :value="item.value"
            :html="item.label"
        />
    </div>
    <teleport to="body">
        <UiModal v-model:visible="filtersIsVisible" :width="900" title="Фильтры по звонкам">
            <UiForm>
                <UiFormGroup class="mb-4">
                    <ConsultantPicker
                        v-model="form.user_ids"
                        :options="getConsultantsOptions"
                        :close-on-select="false"
                        class="col-7"
                        label="Консультант"
                        mode="multiple"
                        multiple-property="label"
                        multiple
                    >
                        <template #after>
                            <UiButton
                                @click.prevent="assignToSelf"
                                :disabled="assignedToSelf"
                                small
                                color="light"
                                icon="fa-solid fa-user-astronaut"
                            >
                                Указать себя
                            </UiButton>
                        </template>
                    </ConsultantPicker>
                </UiFormGroup>
                <UiFormDivider />
                <UiFormGroup>
                    <UiDateInput
                        v-model="form.date_start"
                        placeholder="Дата фиксации"
                        label="Зафиксировано после"
                        :max-date="new Date()"
                        class="col-6"
                    />
                    <UiDateInput
                        v-model="form.date_end"
                        placeholder="Дата фиксации"
                        label="Зафиксировано до"
                        class="col-6"
                        :min-date="form.date_start"
                    />
                </UiFormGroup>
                <UiFormDivider />
                <UiFormGroup>
                    <MultiSelect
                        v-model="form.statuses"
                        label="Статус звонка"
                        mode="multiple"
                        multiple
                        searchable
                        class="col-7"
                        :options="() => statusOptions"
                        :close-on-select="false"
                        placeholder="Выберите статус.."
                        autocomplete="off"
                    />
                    <MultiSelect
                        v-model="form.type"
                        label="Тип звонка"
                        class="col-5"
                        :options="typeOptions"
                        :close-on-select="false"
                        placeholder="Выберите тип.."
                        autocomplete="off"
                    />
                </UiFormGroup>
            </UiForm>
            <template #actions="{ close }">
                <UiButton
                    @click="close"
                    :disabled="!filtersCount"
                    color="danger"
                    icon="fa-solid fa-trash"
                >
                    Очистить
                </UiButton>
                <UiButton @click="close" color="light" icon="fa-solid fa-ban">Закрыть</UiButton>
            </template>
        </UiModal>
    </teleport>
</template>

<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { computed, ref, watch } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Chip from '@/components/common/Chip.vue';
import { singleToArrayByKeys } from '@/utils/helpers/object/singleToArrayByKeys.js';
import { deleteEmptyFields } from '@/utils/helpers/object/deleteEmptyFields.js';
import { useRoute, useRouter } from 'vue-router';
import { useSearchForm } from '@/composables/useSearchForm.js';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import { useAuth } from '@/composables/useAuth.js';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useSelectedFilters } from '@/composables/useSelectedFilters.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { isArray } from '@/utils/helpers/array/isArray.js';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import dayjs from 'dayjs';

const emit = defineEmits(['search']);

const router = useRouter();
const route = useRoute();

const statusOptions = {
    0: 'Не ответил',
    1: 'Успешно поговорили',
    2: 'Занят',
    3: 'Не доступен',
    4: 'Вызов отклонен',
    5: 'Angry',
    6: 'Номер заблокирован'
};

const typeOptions = {
    0: 'Исходящий',
    1: 'Входящий'
};

// form

const formTemplate = {
    search: null,
    user_ids: [],
    statuses: [],
    type: null,
    date_start: null,
    date_end: null
};

const formKeysOnlyArray = ['statuses', 'user_ids'];

async function setQueryFields() {
    Object.assign(form, route.query);

    singleToArrayByKeys(form, formKeysOnlyArray);

    let query = { ...form };
    deleteEmptyFields(query);

    await router.replace({ query });
}

function onSubmit(query) {
    emit('search', query);
}

function removeFilter(key) {
    form[key] = cloneObject(formTemplate[key]);
}

// filters

const filtersIsVisible = ref(false);

const { getConsultantsOptions, consultantsOptions } = useConsultantsOptions();
const { currentUserId } = useAuth();

function assignToSelf() {
    form.user_ids = [currentUserId.value];
}

const assignedToSelf = computed(
    () => form.user_ids.length === 1 && form.user_ids[0] === currentUserId.value
);

// form

const { resetForm, form } = useSearchForm(formTemplate, {
    submit: onSubmit,
    syncWithQuery: true,
    setQuery: setQueryFields,
    transform: value => {
        if (value.date_start) {
            value.date_start = dayjs(value.date_start).toJSON();
        }

        if (value.date_end) {
            value.date_end = dayjs(value.date_end).toJSON();
        }

        return value;
    }
});

watch(
    () => form.search,
    () => {
        router.replace({ query: { ...route.query, page: 1 } });
    }
);

watch(
    () => route?.query?.page,
    () => {
        emit('search');
    }
);

const { filtersCount, humanizedSelectedFilters } = useSelectedFilters(
    form,
    {
        statuses: value => {
            if (isArray(value)) return value.map(item => statusOptions[item]).join(', ');
            return 'Статусы';
        },
        user_ids: value => {
            return value
                .map(
                    item =>
                        consultantsOptions.value.find(elem => Number(elem.value) === Number(item))
                            ?.label
                )
                .filter(isNotNullish)
                .join(', ');
        },
        type: value => {
            return typeOptions[value];
        }
    },
    { ignore: new Set(['sort']) }
);

const hasSort = computed(() => isNotNullish(route.query?.sort));

function clearSort() {
    router.replace({ query: { ...route.query, sort: null } });
}
</script>
