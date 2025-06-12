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
                                :pagination="COMPANIES_PAGINATION"
                                :loading="!COMPANIES_PAGINATION && isLoading"
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
                        <Spinner v-if="isInitialLoading" />
                        <component
                            :is="currentViewComponentName"
                            @show-message="showPinnedMessage"
                            @unpin-message="unpinMessage"
                            @deleted-from-folder="onDeletedFromFolder"
                            @create-pinned-message="createPinnedMessage"
                            @create-task="createTask"
                            @show-tasks="showTasks"
                            @show-created-tasks="showCreatedTasks"
                            @disable-company="disableCompany"
                            @enable-company="enableCompany"
                            :companies="COMPANIES"
                            :loader="isLoading || taskIsCreating"
                        />
                    </AnimationTransition>
                </div>
                <div class="col-12">
                    <PaginationClassic
                        v-if="COMPANIES_PAGINATION"
                        @next="nextWithScroll"
                        :pagination="COMPANIES_PAGINATION"
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
            <FormModalChatMemberMessage
                v-if="messageFormIsVisible"
                @close="closeMessageForm"
                @created="onCreatedMessage"
                :model-id="currentCompany.id"
                model-type="company"
            />
            <UiModal
                v-model:visible="pinnedMessageViewIsVisible"
                title="Просмотр закрепленного сообщения"
                width="800"
            >
                <UiCol :cols="12">
                    <Spinner v-if="pinnedMessageIsLoading" label="Загрузка сообщения.." />
                    <MessengerChatMessage
                        v-else-if="pinnedMessage"
                        :message="pinnedMessage"
                        :editable="false"
                        pinned
                    />
                </UiCol>
            </UiModal>
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
import { computed, ref, shallowRef, watch } from 'vue';
import { useTableContent } from '@/composables/useTableContent.js';
import { useRoute } from 'vue-router';
import Spinner from '@/components/common/Spinner.vue';
import { useMobile } from '@/composables/useMobile.js';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import UserFolders from '@/components/UserFolder/UserFolders.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useDebounceFn } from '@vueuse/core';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useTimeoutFn } from '@vueuse/core';
import FormModalChatMemberMessage from '@/components/Forms/FormModalChatMemberMessage.vue';
import api from '@/api/api.js';
import MessengerChatMessage from '@/components/Messenger/Chat/Message/MessengerChatMessage.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useTaskManager } from '@/composables/useTaskManager.js';
import { getCompanyName, getCompanyShortName } from '@/utils/formatters/models/company.js';
import DashboardTableTasks from '@/components/Dashboard/Table/DashboardTableTasks.vue';
import { taskOptions } from '@/const/options/task.options.js';
import { useAuth } from '@/composables/useAuth.js';
import { captureException } from '@sentry/vue';
import FormCompanyDisable from '@/components/Forms/Company/FormCompanyDisable.vue';
import { useCompanyDisable } from '@/components/Company/useCompanyDisable.js';

const route = useRoute();
const store = useStore();

const COMPANIES = computed(() => store.getters.COMPANIES);
const COMPANIES_PAGINATION = computed(() => store.getters.COMPANIES_PAGINATION);

const isMobile = useMobile();
const isLoading = ref(true);
const viewMode = ref(false);
const companyFormIsVisible = ref(false);
const firstPagination = ref(null);

const getCompanies = async () => {
    isLoading.value = true;

    const query = { ...route.query, current_user_id: currentUserId.value };

    if (isNotNullish(currentFolder.value)) {
        query.folder_ids = [currentFolder.value];
    }

    await store.dispatch('SEARCH_COMPANIES', { query });

    isLoading.value = false;
};

const debouncedFetchCompanies = useDebounceFn(getCompanies, 300);

const { next, nextWithScroll, queryIsInitialized, isInitialLoading } = useTableContent(
    getCompanies,
    {
        scrollTo: firstPagination
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

const currentCompany = shallowRef(null);
const messageFormIsVisible = ref(false);

function createPinnedMessage(company) {
    currentCompany.value = company;
    messageFormIsVisible.value = true;
}

function closeMessageForm() {
    messageFormIsVisible.value = false;
    currentCompany.value = null;
}

const isPinning = ref(false);

async function onCreatedMessage(message) {
    const companyId = currentCompany.value.id;

    closeMessageForm();

    isPinning.value = true;

    try {
        await api.messenger.pinMessage(message.to_chat_member_id, message.id);

        const companyIndex = COMPANIES.value.findIndex(company => company.id === companyId);
        if (companyIndex !== -1) COMPANIES.value[companyIndex].chat_member_pinned_message = message;
    } finally {
        isPinning.value = false;
    }
}

const pinnedMessage = ref(null);
const pinnedMessageViewIsVisible = ref(false);
const pinnedMessageIsLoading = ref(false);

async function showPinnedMessage(message) {
    pinnedMessageIsLoading.value = true;
    pinnedMessageViewIsVisible.value = true;

    try {
        pinnedMessage.value = await api.messenger.getPinned(message.to_chat_member_id);
        pinnedMessage.value.dayjs_date = dayjsFromMoscow(pinnedMessage.value.created_at);
    } finally {
        pinnedMessageIsLoading.value = false;
    }
}

const { confirm } = useConfirm();
const notify = useNotify();

async function unpinMessage(message, companyId) {
    const confirmed = await confirm(
        'Открепить сообщение',
        'Вы уверены, что хотите открепить сообщение?'
    );
    if (!confirmed) return;

    try {
        const unpinned = await api.messenger.unpinMessage(message.to_chat_member_id);
        if (unpinned) {
            notify.success('Сообщение успешно откреплено');

            const companyIndex = COMPANIES.value.findIndex(company => company.id === companyId);
            if (companyIndex !== -1)
                COMPANIES.value[companyIndex].chat_member_pinned_message = null;
        }
    } catch (error) {
        notify.error('Произошла ошибка. Попробуйте позже');
        captureException(error, { company_id: companyId });
    }
}

// tasks

const { createTaskWithTemplate } = useTaskManager();
const taskIsCreating = ref(false);

async function createTask(company) {
    let message = `Компания ${getCompanyShortName(company)}`;
    let title;
    let userId;

    if (message.length > 255) {
        title = message.slice(0, 253) + '...';
    } else {
        title = message;
        message = null;
    }

    if (company.consultant_id) {
        userId = company.consultant_id;
    }

    const taskPayload = await createTaskWithTemplate({
        title,
        message,
        customDescription: true,
        user_id: userId,
        additionalContent: {
            modelType: 'company',
            companyName: getCompanyName(company)
        },
        relations: [{ entity_type: 'company', entity_id: company.id }]
    });

    if (!taskPayload) return;

    taskIsCreating.value = true;

    try {
        const task = await api.task.create(taskPayload);

        notify.success('Задача успешно создана!');

        if (isArray(company.created_task_ids) && company.created_task_ids.length) {
            company.created_task_ids.push(task.id);
        } else {
            company.created_task_ids = [task.id];
        }
    } finally {
        taskIsCreating.value = false;
    }
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

function showCreatedTasks(company) {
    currentTasksCompany.value = company;

    fetchCompanyCreatedTasks();

    tasksIsVisible.value = true;
}

const { currentUserId } = useAuth();

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

async function fetchCompanyCreatedTasks() {
    tasksIsLoading.value = true;

    try {
        const response = await api.task.get({
            ids: currentTasksCompany.value.created_task_ids ?? []
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

        if (
            isArray(currentTasksCompany.value.created_task_ids) &&
            currentTasksCompany.value.created_task_ids.includes(task.id)
        ) {
            currentTasksCompany.value.created_task_ids.splice(
                currentTasksCompany.value.created_task_ids.indexOf(task.id),
                1
            );
        } else {
            currentTasksCompany.value.tasks_count--;
        }
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
</script>
