<template>
    <UiModal
        @close="confirmClose"
        :width="1700"
        :close-on-outside-click="false"
        :close-on-press-esc="false"
        title="Перенос компаний"
        show
        custom-close
        class="form-utility-transfer-companies"
    >
        <AnimationTransition :speed="0.4">
            <div v-if="form.companies.size" class="form-utility-transfer-companies__selected">
                <p class="mb-2 font-weight-semi fs-4">
                    Выбрано компаний: {{ form.companies.size }}
                </p>
                <UiButton @click="clearAll" mini color="white" icon="fa-solid fa-trash">
                    Очистить
                </UiButton>
            </div>
        </AnimationTransition>
        <Loader v-if="isRunning" label="Перенос компаний.." />
        <Stepper
            :steps="steps"
            :v="v$.form"
            :show-actions="false"
            :body-attrs="{ class: 'flex-grow-1' }"
            keep-alive
            class="d-flex flex-column"
        >
            <template #1>
                <Spinner v-if="consultantsIsLoading" label="Загрузка сотрудников.." center />
                <UserPicker v-else v-model="form.consultant_id" single :users="consultants" />
            </template>
            <template #2>
                <div class="row">
                    <UiCol :cols="12">
                        <div class="white-block mb-3">
                            <div class="row">
                                <FormCompanySearch v-if="queryIsInitialized" class="col-12" />
                                <PaginationClassic
                                    ref="firstPagination"
                                    @next="next"
                                    :pagination="pagination"
                                    :loading="!pagination && companiesIsLoading"
                                    class="col-xxl-6 col-lg-8 col-2"
                                />
                                <UiCol :cols="4" :xxl="6">
                                    <div
                                        class="d-flex gap-2 flex-wrap justify-content-end align-items-center"
                                    >
                                        <UiButton
                                            @click="selectAll"
                                            color="light"
                                            :disabled="companiesIsLoading"
                                            icon="fa-solid fa-check"
                                        >
                                            Выбрать все
                                        </UiButton>
                                        <UiButton
                                            @click="clearAll"
                                            :disabled="
                                                form.companies.size === 0 || companiesIsLoading
                                            "
                                            icon="fa-solid fa-trash"
                                            color="light"
                                        >
                                            Очистить
                                        </UiButton>
                                    </div>
                                </UiCol>
                            </div>
                        </div>
                    </UiCol>
                    <UiCol :cols="12">
                        <FormUtilityTransferCompaniesTable
                            @toggle-checked="toggleChecked"
                            :companies
                            :checked-companies="form.companies"
                            :loader="companiesIsLoading"
                        />
                    </UiCol>
                    <UiCol :cols="12">
                        <PaginationClassic v-if="pagination" @next="nextWithScroll" :pagination />
                    </UiCol>
                </div>
            </template>
        </Stepper>
        <template #actions="{ close }">
            <UiButton
                @click="run"
                :disabled="!canBeRun"
                :loading="isRunning"
                icon="fa-solid fa-check"
                color="success-light"
            >
                Выполнить
            </UiButton>
            <UiButton @click="close" :disabled="isRunning" icon="fa-solid fa-ban" color="light">
                Отмена
            </UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import {
    computed,
    onBeforeMount,
    onUnmounted,
    reactive,
    ref,
    shallowRef,
    useTemplateRef,
    watch
} from 'vue';
import api from '@/api/api.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import Stepper from '@/components/common/Stepper/Stepper.vue';
import Spinner from '@/components/common/Spinner.vue';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import { useStore } from 'vuex';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, required } from '@vuelidate/validators';
import FormUtilityTransferCompaniesTable from '@/components/Forms/Utility/FormUtilityTransferCompaniesTable.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import FormCompanySearch from '@/components/Forms/Company/FormCompanySearch.vue';
import { useTableContent } from '@/composables/useTableContent.js';
import { useRoute, useRouter } from 'vue-router';
import Loader from '@/components/common/Loader.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { useDebounceFn } from '@vueuse/core';

const emit = defineEmits(['close']);

const { confirm } = useConfirm();
const notify = useNotify();

const isRunning = ref(false);

const form = reactive({
    consultant_id: null,
    companies: new Set()
});

// consultant

const store = useStore();

const consultants = shallowRef([]);
const consultantsIsLoading = ref(false);

async function fetchConsultants() {
    consultantsIsLoading.value = true;

    consultants.value = await store.dispatch('getConsultants');

    consultantsIsLoading.value = false;
}

function toggleChecked(company) {
    if (form.companies.has(company.id)) {
        form.companies.delete(company.id);
    } else {
        form.companies.add(company.id);
    }
}

// companies

const companies = shallowRef([]);
const pagination = ref(null);

const companiesIsLoading = ref(false);

const route = useRoute();

async function fetchCompanies() {
    companiesIsLoading.value = true;

    const query = { ...route.query, 'per-page': 30, exclude_consultant_ids: [form.consultant_id] };

    const response = await api.companies.searchCompanies(query);

    companies.value = response.data;
    pagination.value = response.pagination;

    companiesIsLoading.value = false;
}

const canBeRun = computed(() => {
    return isNotNullish(form.consultant_id) && form.companies.size > 0;
});

async function run() {
    const isValid = await validate();
    if (!isValid) return;

    const confirmed = await confirm(
        'Перенести компании',
        'Вы действительно хотите перенести компании на выбранного сотрудника?'
    );
    if (!confirmed) return;

    isRunning.value = true;

    try {
        await api.utility.transferCompaniesToConsultant(form.consultant_id, {
            company_ids: Array.from(form.companies)
        });

        notify.success('Компании перенесены на выбранного сотрудника.');

        void fetchCompanies();
        clearAll();
    } finally {
        isRunning.value = false;
    }
}

function initialize() {
    fetchConsultants();
}

onBeforeMount(initialize);

const debouncedFetchCompanies = useDebounceFn(fetchCompanies, 300);

watch(
    () => form.consultant_id,
    value => {
        if (isNotNullish(value)) debouncedFetchCompanies();
    },
    { immediate: true }
);

// actions

function selectAll() {
    companies.value.forEach(company => {
        form.companies.add(company.id);
    });
}

function clearAll() {
    form.companies.clear();
}

// steps

const steps = reactive([
    {
        name: 'consultant_id',
        title: 'Выбор консультанта',
        icon: 'fa-solid fa-user'
    },
    {
        name: 'companies',
        title: 'Выбор компаний',
        icon: 'fa-solid fa-industry',
        disabled: computed(() => isNullish(form.consultant_id))
    }
]);

const { v$, validate } = useValidation(
    {
        form: {
            companies: {
                minLength: helpers.withMessage('Выберите компании!', value => value.size > 0)
            },
            consultant_id: {
                minLength: helpers.withMessage('Выберите сотрудника!', required)
            }
        }
    },
    { form }
);

const router = useRouter();

const { next, nextWithScroll, queryIsInitialized } = useTableContent(fetchCompanies, {
    scrollTo: useTemplateRef('firstPagination'),
    initQuery: async () => {
        const query = { ...route.query };

        const queryIsEmpty = Object.keys(query).length === 0;

        if (queryIsEmpty) {
            query.status = 1;
            query.requests_filter = 'active';
        }

        await router.replace({ query });
    }
});

onUnmounted(() => {
    router.replace({ query: {} });
});

// close

async function confirmClose() {
    const confirmed = await confirm(
        'Завершить перенос компаний',
        'Вы действительно хотите завершить перенос компаний?'
    );
    if (confirmed) emit('close');
}
</script>
