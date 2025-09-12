<template>
    <UiForm>
        <UiFormGroup>
            <div class="col-12">
                <div class="d-flex align-items-end flex-column flex-md-row">
                    <UiInput
                        v-model="form.search"
                        label="Поиск"
                        placeholder="ID, контакт, компания.."
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
        <UiModal v-model:visible="filtersIsVisible" :width="900" title="Фильтры по опросам">
            <UiForm>
                <UiFormGroup class="mb-4">
                    <ConsultantPicker
                        v-model="form.user_id"
                        class="col-6"
                        label="Консультант"
                        :options="getConsultantsOptions"
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
                        placeholder="Дата создания"
                        label="Создано после"
                        :max-date="new Date()"
                        class="col-6"
                    />
                    <UiDateInput
                        v-model="form.date_end"
                        placeholder="Дата создания"
                        label="Создано до"
                        class="col-6"
                        :min-date="form.date_start"
                    />
                </UiFormGroup>
                <UiFormDivider />
                <UiFormGroup>
                    <MultiSelect
                        v-model="form.status"
                        label="Статус опроса"
                        class="col-7"
                        :options="surveyStatuses"
                        placeholder="Выберите статус.."
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
import { deleteEmptyFields } from '@/utils/helpers/object/deleteEmptyFields.js';
import { useRoute, useRouter } from 'vue-router';
import { useSearchForm } from '@/composables/useSearchForm.js';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import { useAuth } from '@/composables/useAuth';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { useSelectedFilters } from '@/composables/useSelectedFilters.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import dayjs from 'dayjs';

const emit = defineEmits(['search']);

const router = useRouter();
const route = useRoute();

const surveyStatusesEnum = {
    COMPLETED: 'completed',
    DRAFT: 'draft',
    CANCELLED: 'canceled'
};

const surveyStatuses = {
    [surveyStatusesEnum.COMPLETED]: 'Завершен',
    [surveyStatusesEnum.DRAFT]: 'Черновик',
    [surveyStatusesEnum.CANCELLED]: 'Отменен'
};

// form

const formTemplate = {
    search: null,
    user_id: null,
    status: null,
    date_start: null,
    date_end: null
};

async function setQueryFields() {
    Object.assign(form, route.query);

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
    form.user_id = currentUserId.value;
}

const assignedToSelf = computed(() => form.user_id === currentUserId.value);

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
        status: value => {
            return surveyStatuses[value];
        },
        user_id: value => {
            if (consultantsOptions.value.length)
                return consultantsOptions.value.find(
                    element => Number(element.value) === Number(value)
                )?.label;
            return null;
        }
    },
    { ignore: new Set(['sort']) }
);

const hasSort = computed(() => isNotNullish(route.query?.sort));

function clearSort() {
    router.replace({ query: { ...route.query, sort: null } });
}
</script>
