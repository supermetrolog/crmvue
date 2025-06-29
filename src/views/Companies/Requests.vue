<template>
    <section class="companies-requests">
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <div class="white-block mb-3">
                        <div class="row">
                            <FormCompanyRequestSearch v-if="queryIsInitialized" class="col-12" />
                            <UserFolders
                                v-model:selected="currentFolder"
                                category="request"
                                class="col-12"
                                movable
                                editable
                                selectable
                            />
                            <PaginationClassic
                                ref="firstPagination"
                                @next="next"
                                :pagination="pagination"
                                :loading="!pagination && isLoading"
                                class="col-xxl-6 col-lg-8 col-2"
                            />
                            <UiCol :cols="4" :xxl="6">
                                <div
                                    class="d-flex gap-2 flex-wrap justify-content-end align-items-center"
                                >
                                    <Switch
                                        v-if="!isMobile"
                                        v-model="isCardView"
                                        false-title="Таблица"
                                        true-title="Карточки"
                                    />
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
                            @edit="editRequest"
                            @view="viewRequest"
                            @to-chat="openInChat"
                            @enable="enableRequest"
                            @disable="disableRequest"
                            @change-consultant="changeRequestConsultant"
                            @show-tasks="showTasks"
                            @show-created-tasks="showCreatedTasks"
                            @deleted-from-folder="onDeletedFromFolder"
                            @create-task="createRequestTask"
                            @clone="cloneRequest"
                            :requests="requests"
                            :loader="isLoading"
                        />
                    </AnimationTransition>
                    <EmptyData v-if="!isLoading && !requests.length">
                        Ничего не найдено...
                    </EmptyData>
                </div>
                <div class="col-12">
                    <PaginationClassic
                        @next="nextWithScroll"
                        :pagination="pagination"
                        :loading="isLoading"
                    />
                </div>
            </div>
        </div>
        <teleport to="body">
            <DashboardCardRequestView
                v-if="requestViewIsVisible"
                @close="requestViewIsVisible = false"
                @edit="editRequest(viewingRequest)"
                @toggle-disable="toggleDisableRequest(viewingRequest)"
                @to-chat="toChatFromView"
                :editable="userCanEdit(viewingRequest)"
                :request="viewingRequest"
            />
            <FormModalCompanyRequestDisable
                @close="formDisableIsVisible = false"
                @disabled="onRequestUpdated(disablingRequest)"
                :show="formDisableIsVisible"
                :request_id="disablingRequest?.id"
            />
            <FormCompanyRequest
                v-if="formRequestIsVisible"
                @close="formRequestIsVisible = false"
                @updated="onRequestUpdated(editableRequest)"
                :form-data="editableRequest"
            />
            <FormModalCompanyRequestClone
                v-if="cloneModalIsVisible"
                @close="cloneModalIsVisible = false"
                @cloned="onRequestCloned"
                :request="clonedRequestItem"
            />
            <FormModalCompanyRequestChangeConsultant
                v-if="changeModalIsVisible"
                @close="changeModalIsVisible = false"
                @changed="onRequestConsultantChanged"
                :request="changedRequest"
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
        </teleport>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import FormCompanyRequestSearch from '@/components/Forms/Company/FormCompanyRequestSearch.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import CompanyRequestTable from '@/components/Company/Request/CompanyRequestTable.vue';
import CompanyRequestTableMobile from '@/components/Company/Request/CompanyRequestTableMobile.vue';
import { computed, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { useTableContent } from '@/composables/useTableContent.js';
import { useRoute, useRouter } from 'vue-router';
import EmptyData from '@/components/common/EmptyData.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useMobile } from '@/composables/useMobile.js';
import Switch from '@/components/common/Forms/Switch.vue';
import api from '@/api/api.js';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';
import FormModalCompanyRequestDisable from '@/components/Forms/Company/FormModalCompanyRequestDisable.vue';
import DashboardCardRequestView from '@/components/Dashboard/Card/Request/DashboardCardRequestView.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { useAuth } from '@/composables/useAuth.js';
import { singleToArrayByKeys } from '@/utils/helpers/object/singleToArrayByKeys.js';
import { useAsync } from '@/composables/useAsync.js';
import { useNotify } from '@/utils/use/useNotify.js';
import FormModalCompanyRequestClone from '@/components/Forms/Company/FormModalCompanyRequestClone.vue';
import FormModalCompanyRequestChangeConsultant from '@/components/Forms/Company/FormModalCompanyRequestChangeConsultant.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import DashboardTableTasks from '@/components/Dashboard/Table/DashboardTableTasks.vue';
import { isArray } from '@/utils/helpers/array/isArray';
import { useTaskManager } from '@/composables/useTaskManager.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import { taskOptions } from '@/const/options/task.options.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { useDebounceFn, useEventBus, useTimeoutFn } from '@vueuse/core';
import UiCol from '@/components/common/UI/UiCol.vue';
import UserFolders from '@/components/UserFolder/UserFolders.vue';

const store = useStore();
const route = useRoute();

const isLoading = ref();
const { openChat } = useMessenger();

const isCardView = ref(false);
const isMobile = useMobile();

const editableRequest = shallowRef(null);
const disablingRequest = shallowRef(null);
const viewingRequest = shallowRef(null);

const formRequestIsVisible = ref(false);
const formDisableIsVisible = ref(false);
const requestViewIsVisible = ref(false);

const firstPagination = useTemplateRef('firstPagination');
const pagination = ref(null);
const requests = ref([]);

const currentViewComponentName = computed(() => {
    if (isMobile) return CompanyRequestTableMobile;
    return isCardView.value ? CompanyRequestTableMobile : CompanyRequestTable;
});

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

async function fetchRequests() {
    isLoading.value = true;

    const payload = { ...route.query };

    singleToArrayByKeys(payload, formKeysOnlyArray);

    if (isNotNullish(currentFolder.value)) {
        payload.folder_ids = [currentFolder.value];
    }

    try {
        const response = await api.request.search(payload);

        if (response) {
            requests.value = response.data;
            pagination.value = response.pagination;
        }
    } finally {
        isLoading.value = false;
    }
}

const debouncedFetchRequests = useDebounceFn(fetchRequests, 300);

const { currentUserId } = useAuth();
const router = useRouter();

const { next, nextWithScroll, queryIsInitialized } = useTableContent(fetchRequests, {
    scrollTo: firstPagination,
    initQuery: async () => {
        const query = { ...route.query };

        const queryIsEmpty = Object.keys(query).length === 0;

        if (queryIsEmpty) {
            await router.replace({ query: { consultant_ids: [currentUserId.value] } });
        }
    }
});

const editRequest = request => {
    editableRequest.value = request;
    formRequestIsVisible.value = true;
};

const viewRequest = request => {
    viewingRequest.value = request;
    requestViewIsVisible.value = true;
};

function toggleDisableRequest(request) {
    if (request.status === 0) enableRequest(request);
    else disableRequest(request);
}

function disableRequest(request) {
    disablingRequest.value = request;
    formDisableIsVisible.value = true;
}

const onRequestUpdated = async request => {
    const requestResponse = await api.request.search({
        id: request.id
    });

    if (requestResponse?.data?.length) {
        Object.assign(request, requestResponse.data[0]);
    }

    formDisableIsVisible.value = false;
    formRequestIsVisible.value = false;
    editableRequest.value = null;
    disablingRequest.value = null;
};

const userCanEdit = request => {
    return (
        Number(request.consultant_id) === Number(store.getters.THIS_USER.id) ||
        store.getters.isModerator
    );
};

const openInChat = request => {
    openChat(request.company_id, request.id, 'request');
};

const toChatFromView = () => {
    openInChat(viewingRequest);
    viewingRequest.value = null;
    requestViewIsVisible.value = false;
};

// enable

const notify = useNotify();

async function enableRequest(request) {
    await handleEnableRequest(request.id);
    void onRequestUpdated(request);
}

const { execute: handleEnableRequest } = useAsync(api.request.undisable, {
    onFetchResponse: () => {
        notify.success('Запрос успешно восстановлен.');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Восстановить запрос',
        message: 'Вы уверены, что хотите восстановить запрос из архива?'
    }
});

// clone

const clonedRequestItem = shallowRef(null);
const cloneModalIsVisible = ref(false);

function cloneRequest(request) {
    clonedRequestItem.value = request;
    cloneModalIsVisible.value = true;
}

function onRequestCloned(request) {
    cloneModalIsVisible.value = false;
    clonedRequestItem.value = null;
    notify.success('Запрос успешно клонирован');

    request.cloned = true;

    requests.value.unshift(request);
    onRequestUpdated(requests.value[0]);
}

// change consultant

const changedRequest = shallowRef(null);
const changeModalIsVisible = ref(false);

function changeRequestConsultant(request) {
    changedRequest.value = request;
    changeModalIsVisible.value = true;
}

function onRequestConsultantChanged(request) {
    changeModalIsVisible.value = false;
    changedRequest.value = null;
    notify.success('Консультант компании успешно изменен');

    onRequestUpdated(request);
}

// tasks

function addCreatedTaskInRequest(request, task) {
    if (isArray(request.created_task_ids) && request.created_task_ids.length) {
        request.created_task_ids.push(task.id);
    } else {
        request.created_task_ids = [task.id];
    }
}

const { createTaskWithTemplate } = useTaskManager();

async function createTask(payload) {
    const task = await api.task.create(payload);
    notify.success('Задача успешно создана!');

    return task;
}

function createTaskRelation(type, id) {
    return { entity_type: type, entity_id: id };
}

async function createRequestTask(request) {
    const companyName = getCompanyShortName(request.company);

    const taskPayload = await createTaskWithTemplate({
        title: `Запрос #${request.id} (комп. ${companyName}) `,
        user_id: request.consultant_id ?? currentUserId.value,
        relations: [
            createTaskRelation('company', request.company_id),
            createTaskRelation('request', request.id)
        ],
        type: 'request_handling'
    });

    if (!taskPayload) return;

    try {
        request.isLoading = true;
        const task = await createTask(taskPayload);

        addCreatedTaskInRequest(request, task);
    } finally {
        request.isLoading = false;
    }
}

// show tasks

const currentTasks = ref([]);
const currentTasksRequest = shallowRef(null);
const tasksIsVisible = ref(false);
const tasksIsLoading = ref(false);

function showTasks(request) {
    currentTasksRequest.value = request;

    fetchRequestTasks();

    tasksIsVisible.value = true;
}

function onTaskUpdated(task) {
    const taskIndex = currentTasks.value.findIndex(element => element.id === task.id);
    if (taskIndex === -1) return;

    if (task.status === taskOptions.statusTypes.COMPLETED) {
        currentTasks.value.splice(taskIndex, 1);

        if (
            isArray(currentTasksRequest.value.created_task_ids) &&
            currentTasksRequest.value.created_task_ids.includes(task.id)
        ) {
            currentTasksRequest.value.created_task_ids.splice(
                currentTasksRequest.value.created_task_ids.indexOf(task.id),
                1
            );
        } else {
            currentTasksRequest.value.tasks_count--;
        }
    } else {
        Object.assign(currentTasks.value[taskIndex], task);
    }
}

const tasksModalTitle = computed(() => {
    if (isNotNullish(currentTasksRequest.value)) {
        return `Задачи | Запрос #${currentTasksRequest.value.id}`;
    }

    return 'Задачи';
});

function showCreatedTasks(request) {
    currentTasksRequest.value = request;

    fetchRequestCreatedTasks();

    tasksIsVisible.value = true;
}

async function fetchRequestTasks() {
    tasksIsLoading.value = true;

    try {
        const response = await api.task.get({
            user_id: currentUserId.value,
            status: [
                taskOptions.clearStatusTypes.NEW,
                taskOptions.clearStatusTypes.IN_PROGRESS,
                taskOptions.clearStatusTypes.CANCELED
            ],
            relation_entity_type: 'request',
            relation_entity_id: currentTasksRequest.value.id
        });

        currentTasks.value = response.data;
    } finally {
        tasksIsLoading.value = false;
    }
}

async function fetchRequestCreatedTasks() {
    tasksIsLoading.value = true;

    try {
        const response = await api.task.get({
            ids: currentTasksRequest.value.created_task_ids ?? []
        });

        currentTasks.value = response.data;
    } finally {
        tasksIsLoading.value = false;
    }
}

// survey bus

const bus = useEventBus('survey');

function onCompleteSurvey(payload) {
    const requestsWithDraft = requests.value.filter(
        request => request.company_id === payload.companyId
    );

    requestsWithDraft.forEach(request => {
        request.has_survey_draft = false;
    });
}

bus.on((_, payload) => onCompleteSurvey(payload));

// folders

const currentFolder = ref(null);

watch(currentFolder, debouncedFetchRequests);

function onDeletedFromFolder(requestId, folderId) {
    if (isNotNullish(currentFolder.value) && currentFolder.value === folderId) {
        const requestIndex = requests.value.findIndex(request => request.id === requestId);
        if (requestIndex === -1) return;

        requests.value[requestIndex].isDeleting = true;

        useTimeoutFn(() => {
            requests.value.splice(requestIndex, 1);
        }, 500);
    }
}
</script>
