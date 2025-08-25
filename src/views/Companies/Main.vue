<template>
    <section>
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <div class="white-block mb-3">
                        <div class="row">
                            <FormCompanySearch v-if="queryIsInitialized" class="col-12" />
                            <UserFolders
                                v-model:selected="currentFolder"
                                category="company"
                                class="col-12"
                                movable
                                editable
                                selectable
                            />
                            <PaginationClassic
                                ref="firstPagination"
                                @next="next"
                                :pagination="companiesPagination"
                                :loading="!companiesPagination && isLoading"
                                class="col-xxl-6 col-lg-8 col-2"
                            />
                            <UiCol :cols="4" :xxl="6">
                                <div
                                    class="d-flex gap-2 flex-wrap justify-content-end align-items-center"
                                >
                                    <Switch
                                        v-if="!isMobile"
                                        v-model="viewMode"
                                        false-title="Таблица"
                                        true-title="Карточки"
                                    />
                                    |
                                    <UiButton
                                        @click="companyFormIsVisible = true"
                                        color="light"
                                        :disabled="isLoading"
                                        small
                                        icon="fa-solid fa-plus"
                                    >
                                        Создать компанию
                                    </UiButton>
                                </div>
                            </UiCol>
                        </div>
                    </div>
                </UiCol>
            </div>
            <div class="row">
                <div class="col-12 offers-page__table">
                    <AnimationTransition :speed="0.2">
                        <component
                            :is="currentViewComponentName"
                            @deleted-from-folder="onDeletedFromFolder"
                            @create-task="createCompanyTask"
                            @show-tasks="showTasks"
                            @disable-company="disableCompany"
                            @enable-company="enableCompany"
                            @create-request-task="createRequestTask"
                            @schedule-call="scheduleCall"
                            @schedule-visit="scheduleVisit"
                            @schedule-event="scheduleEvent"
                            @show-company-comments="showCompanyComments"
                            @show-company-notes="showCompanyNotes"
                            :companies
                            :loader="isLoading"
                            :refreshing="isSilentLoading"
                        />
                    </AnimationTransition>
                </div>
                <div class="col-12">
                    <PaginationClassic
                        v-if="companiesPagination"
                        @next="nextWithScroll"
                        :pagination="companiesPagination"
                    />
                </div>
            </div>
        </div>
        <teleport to="body">
            <FormCompany
                v-if="companyFormIsVisible"
                @close="companyFormIsVisible = false"
                @created="getCompanies"
            />
            <UiModal
                v-slot="{ close }"
                v-model:visible="tasksIsVisible"
                :title="tasksModalTitle"
                :width="900"
            >
                <DashboardTableTasks
                    @hide="close"
                    @task-updated="onTaskUpdated"
                    :tasks="currentTasks"
                    :is-loading="tasksIsLoading"
                />
            </UiModal>
            <FormCompanyDisable
                v-if="disableFormIsVisible"
                @close="closeDisableForm"
                @disabled="onDisabledCompany"
                :company="disablingCompany"
            />
            <CallScheduler
                v-if="scheduleCallModalIsVisible"
                @close="closeScheduleCallModal"
                @created="onCreatedScheduledCall"
                :company="scheduleCallCompany"
            />
            <VisitScheduler
                v-if="scheduleVisitModalIsVisible"
                @close="closeScheduleVisitModal"
                @created="onCreatedScheduledVisit"
                :company="scheduleVisitCompany"
            />
            <EventScheduler
                v-if="scheduleEventModalIsVisible"
                @close="closeScheduleEventModal"
                @created="onCreatedScheduledEvent"
                :company="scheduleEventCompany"
            />
            <CompanyTablePreviewComments
                v-if="commentsModalIsVisible"
                @close="closeCompanyComments"
                :company="commentsCompany"
            />
            <CompanyTablePreviewNotes
                v-if="notesModalIsVisible"
                @close="closeCompanyNotes"
                :company="notesCompany"
            />
        </teleport>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import FormCompanySearch from '@/components/Forms/Company/FormCompanySearch.vue';
import CompanyTable from '@/components/Company/Table/CompanyTable.vue';
import CompanyGrid from '@/components/Company/CompanyGrid.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { useTableContent } from '@/composables/useTableContent.js';
import { useRoute, useRouter } from 'vue-router';
import { useMobile } from '@/composables/useMobile.js';
import UserFolders from '@/components/UserFolder/UserFolders.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { useDebounceFn, useEventBus, useTimeoutFn } from '@vueuse/core';
import UiButton from '@/components/common/UI/UiButton.vue';
import api from '@/api/api.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { useTaskManager } from '@/composables/useTaskManager.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import DashboardTableTasks from '@/components/Dashboard/Table/DashboardTableTasks.vue';
import { taskOptions } from '@/const/options/task.options.js';
import { useAuth } from '@/composables/useAuth.js';
import FormCompanyDisable from '@/components/Forms/Company/FormCompanyDisable.vue';
import { useCompanyDisable } from '@/components/Company/useCompanyDisable.js';
import CallScheduler from '@/components/CallScheduler/CallScheduler.vue';
import VisitScheduler from '@/components/VisitScheduler/VisitScheduler.vue';
import EventScheduler from '@/components/EventScheduler/EventScheduler.vue';
import CompanyTablePreviewComments from '@/components/Company/Table/CompanyTablePreviewComments.vue';
import CompanyTablePreviewNotes from '@/components/Company/Table/CompanyTablePreviewNotes.vue';
import { captureException } from '@sentry/vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

const { currentUserId } = useAuth();

const storeIsInitialized = computed({
    get() {
        return store.state.Companies.companiesIsInitialized;
    },
    set(value) {
        store.state.Companies.companiesIsInitialized = value;
    }
});

onMounted(() => {
    storeIsInitialized.value = true;
});

const companies = computed(() => store.getters.companies);
const companiesPagination = computed(() => store.getters.companiesPagination);

const isMobile = useMobile();

const isLoading = ref(false);
const isSilentLoading = ref(false);

const viewMode = ref(false);
const companyFormIsVisible = ref(false);
const firstPagination = ref(null);

async function getCompanies() {
    if (isInitialLoading.value && storeIsInitialized.value && companies.value.length) {
        isSilentLoading.value = true;
    } else {
        isLoading.value = true;
    }

    const query = { ...route.query, current_user_id: currentUserId.value };

    if (isNotNullish(currentFolder.value)) {
        query.folder_ids = [currentFolder.value];
    }

    await store.dispatch('SEARCH_COMPANIES', { query });

    isSilentLoading.value = false;
    isLoading.value = false;
}

const debouncedFetchCompanies = useDebounceFn(getCompanies, 300);

const { next, nextWithScroll, queryIsInitialized, isInitialLoading } = useTableContent(
    getCompanies,
    {
        scrollTo: firstPagination,
        initQuery: async () => {
            const query = { ...route.query };

            const queryIsEmpty = Object.keys(query).length === 0;

            if (!queryIsEmpty) return;

            if (isNotNullish(store.state.Companies.companyFilters)) {
                await router.replace({ query: store.state.Companies.companyFilters });
                return;
            }

            query.consultant_id = currentUserId.value;
            query.status = 1;
            query.with_active_contacts = 1;
            query.sort = 'activity';

            await router.replace({ query });
        }
    }
);

const currentViewComponentName = computed(() => {
    if (isMobile) return CompanyGrid;
    return viewMode.value ? CompanyGrid : CompanyTable;
});

// disable

const {
    disableCompany,
    disableFormIsVisible,
    enableCompany,
    disablingCompany,
    onDisabledCompany,
    closeDisableForm
} = useCompanyDisable();

// folders

const currentFolder = ref(null);

watch(currentFolder, debouncedFetchCompanies);

function onDeletedFromFolder(companyId, folderId) {
    if (isNotNullish(currentFolder.value) && currentFolder.value === folderId) {
        const companyIndex = store.state.Companies.companies.findIndex(
            offer => offer.id === companyId
        );
        if (companyIndex === -1) return;

        store.state.Companies.companies[companyIndex].isDeleting = true;

        useTimeoutFn(() => {
            store.state.Companies.companies.splice(companyIndex, 1);
        }, 500);
    }
}

// pinned message

const notify = useNotify();

// tasks

function addTaskToCompany(task, company) {
    const companyIndex = companies.value.findIndex(c => c.id === company.id);
    if (companyIndex === -1) return;

    companies.value[companyIndex].tasks.push(task);
}

const { createTaskWithTemplate } = useTaskManager();

async function createCompanyTask(company) {
    let userId;

    if (company.consultant_id) {
        userId = company.consultant_id;
    }

    const taskPayload = await createTaskWithTemplate({
        title: `Компания ${getCompanyShortName(company)}`,
        user_id: userId,
        relations: [createTaskRelation('company', company.id)]
    });

    if (!taskPayload) return;

    try {
        company.isLoading = true;

        await api.task.create(taskPayload);

        notify.success('Задача успешно создана!');
    } finally {
        company.isLoading = false;
    }
}

async function createTask(payload) {
    const task = await api.task.create(payload);
    notify.success('Задача успешно создана!');

    return task;
}

function createTaskRelation(type, id) {
    return { entity_type: type, entity_id: id };
}

async function createRequestTask(request, company) {
    const companyName = getCompanyShortName(company);

    const taskPayload = await createTaskWithTemplate({
        title: `Запрос #${request.id} (комп. ${companyName}) `,
        user_id: request.consultant_id ?? currentUserId.value,
        relations: [
            createTaskRelation('company', company.id),
            createTaskRelation('request', request.id)
        ],
        type: 'request_handling'
    });

    if (!taskPayload) return;

    try {
        request.isLoading = true;
        await createTask(taskPayload);
    } finally {
        request.isLoading = false;
    }
}

const scheduleCallModalIsVisible = ref(false);
const scheduleCallCompany = shallowRef(null);

function scheduleCall(company) {
    scheduleCallCompany.value = company;
    scheduleCallModalIsVisible.value = true;
}

function closeScheduleCallModal() {
    scheduleCallModalIsVisible.value = false;
    scheduleCallCompany.value = null;
}

function onCreatedScheduledCall(task) {
    addTaskToCompany(task, scheduleCallCompany.value);
    closeScheduleCallModal();
}

const currentTasks = shallowRef([]);
const currentTasksCompany = shallowRef(null);
const tasksIsVisible = ref(false);
const tasksIsLoading = ref(false);

function showTasks(company) {
    currentTasksCompany.value = company;

    fetchCompanyTasks();

    tasksIsVisible.value = true;
}

async function fetchCompanyTasks() {
    tasksIsLoading.value = true;

    try {
        const response = await api.task.get({
            user_id: currentUserId.value,
            status: [
                taskOptions.clearStatusTypes.NEW,
                taskOptions.clearStatusTypes.IN_PROGRESS,
                taskOptions.clearStatusTypes.CANCELED
            ],
            relation_entity_type: 'company',
            relation_entity_id: currentTasksCompany.value.id
        });

        currentTasks.value = response.data;
    } finally {
        tasksIsLoading.value = false;
    }
}

function onTaskUpdated(task) {
    const taskIndex = currentTasks.value.findIndex(element => element.id === task.id);
    if (taskIndex === -1) return;

    if (task.status === taskOptions.statusTypes.COMPLETED) {
        currentTasks.value.splice(taskIndex, 1);
    } else {
        Object.assign(currentTasks.value[taskIndex], task);
    }
}

const tasksModalTitle = computed(() => {
    if (isNotNullish(currentTasksCompany.value)) {
        return `Задачи | ${getCompanyShortName(currentTasksCompany.value)}`;
    }

    return 'Задачи';
});

// refresh company

async function refreshCompany(company) {
    try {
        company.isLoading = true;

        const response = await api.companies.searchCompanies({ id: company.id });

        if (response.data.length) {
            Object.assign(company, response.data[0]);
        }
    } catch (e) {
        captureException(e);
    } finally {
        company.isLoading = false;
    }
}

// survey bus

const bus = useEventBus('survey');

function onCompleteSurvey(payload) {
    const company = companies.value.find(company => company.id === payload.companyId);

    if (company) refreshCompany(company);
}

bus.on((_, payload) => onCompleteSurvey(payload));

// visit

const scheduleVisitModalIsVisible = ref(false);
const scheduleVisitCompany = shallowRef(null);

function scheduleVisit(company) {
    scheduleVisitCompany.value = company;
    scheduleVisitModalIsVisible.value = true;
}

function closeScheduleVisitModal() {
    scheduleVisitModalIsVisible.value = false;
    scheduleVisitCompany.value = null;
}

function onCreatedScheduledVisit(task) {
    addTaskToCompany(task, scheduleVisitCompany.value);
    closeScheduleVisitModal();
}

// event

const scheduleEventModalIsVisible = ref(false);
const scheduleEventCompany = shallowRef(null);

function scheduleEvent(company) {
    scheduleEventCompany.value = company;
    scheduleEventModalIsVisible.value = true;
}

function closeScheduleEventModal() {
    scheduleEventModalIsVisible.value = false;
    scheduleEventCompany.value = null;
}

function onCreatedScheduledEvent(task) {
    addTaskToCompany(task, scheduleEventCompany.value);
    closeScheduleEventModal();
}

// linked messages preview

const commentsModalIsVisible = ref(false);
const commentsCompany = shallowRef(null);

function showCompanyComments(company) {
    commentsCompany.value = company;
    commentsModalIsVisible.value = true;
}

function closeCompanyComments() {
    commentsModalIsVisible.value = false;
    commentsCompany.value = null;
}

const notesModalIsVisible = ref(false);
const notesCompany = shallowRef(null);

function showCompanyNotes(company) {
    notesCompany.value = company;
    notesModalIsVisible.value = true;
}

function closeCompanyNotes() {
    notesModalIsVisible.value = false;
    notesCompany.value = null;
}
</script>
