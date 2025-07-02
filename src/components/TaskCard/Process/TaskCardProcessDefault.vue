<template>
    <div class="task-card-process-request">
        <div class="d-flex flex-wrap gap-1">
            <UiButton
                v-if="survey"
                @click="$emit('show-survey', survey.entity_id)"
                small
                color="white"
                icon="fa-solid  fa-square-poll-horizontal"
                data-tour-id="task-process:show-survey"
            >
                Опрос #{{ survey.entity_id }}
            </UiButton>
            <TaskCardProcessEntityRequest
                v-for="request in requests"
                :key="request.id"
                @show="showRequest(request.entity)"
                @edit="editRequest(request.entity)"
                @enable="enableRequest(request.entity_id)"
                @disable="disableRequest(request.entity)"
                @change-consultant="changeRequestConsultant(request.entity)"
                @clone="cloneRequest(request.entity)"
                :request="request.entity"
                data-tour-id="task-process:show-requests"
            />
            <TaskCardProcessEntityCompany
                v-for="company in companies"
                :key="company.id"
                @edit="editCompany(company.entity)"
                @enable="enableCompany(company.entity_id)"
                @disable="disableCompany(company.entity)"
                :company="company.entity"
                data-tour-id="task-process:show-companies"
            />
        </div>
        <UiModal
            v-model:visible="requestModalIsVisible"
            :width="1600"
            :min-height="400"
            title="Просмотр запроса"
        >
            <Spinner v-if="isLoading" class="absolute-center" />
            <RequestCard v-else-if="visibleRequest" :request="visibleRequest" />
        </UiModal>
        <FormCompanyRequest
            v-if="formIsVisible"
            @close="closeEditForm"
            @updated="onUpdatedRequest"
            :form-data="editedRequest"
            :pinned-task="task"
            :company-id="companyId"
        />
        <FormModalCompanyRequestDisable
            @close="disableRequestFormIsVisible = false"
            @disabled="onRequestDisabled"
            :show="disableRequestFormIsVisible"
            :request_id="disablingRequest?.id"
            :pinned-task="task"
        />
        <FormModalCompanyRequestChangeConsultant
            v-if="changeModalIsVisible"
            @close="changeModalIsVisible = false"
            @changed="onRequestConsultantChanged"
            :request="changedRequest"
            :pinned-task="task"
        />
        <FormModalCompanyRequestClone
            v-if="cloneModalIsVisible"
            @close="cloneModalIsVisible = false"
            @cloned="onRequestCloned"
            :request="clonedRequestItem"
            :pinned-task="task"
        />
        <FormCompany
            v-if="companyFormIsVisible"
            @close="companyFormIsVisible = false"
            @updated="onUpdatedCompany"
            :form-data="editedCompany"
        />
        <FormCompanyDisable
            v-if="disableFormIsVisible"
            @close="closeDisableForm"
            @disabled="onDisabledCompany"
            :company="disablingCompany"
        />
    </div>
</template>

<script setup lang="ts">
import { TaskRelationEntity, TaskRelationEntityModelTypeEnum, TaskView } from '@/types/task';
import { computed, ref, shallowRef } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import RequestCard from '@/components/RequestCard/RequestCard.vue';
import api from '@/api/api';
import Spinner from '@/components/common/Spinner.vue';
import TaskCardProcessEntityRequest from '@/components/TaskCard/Process/TaskCardProcessEntityRequest.vue';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';
import FormModalCompanyRequestDisable from '@/components/Forms/Company/FormModalCompanyRequestDisable.vue';
import { useNotify } from '@/utils/use/useNotify';
import FormModalCompanyRequestChangeConsultant from '@/components/Forms/Company/FormModalCompanyRequestChangeConsultant.vue';
import FormModalCompanyRequestClone from '@/components/Forms/Company/FormModalCompanyRequestClone.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAsync } from '@/composables/useAsync';
import { createTourStepElementGenerator, useTourStep } from '@/composables/useTour/useTourStep';
import TaskCardProcessEntityCompany from '@/components/TaskCard/Process/TaskCardProcessEntityCompany.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import { useCompanyDisable } from '@/components/Company/useCompanyDisable';
import FormCompanyDisable from '@/components/Forms/Company/FormCompanyDisable.vue';

defineEmits<{ (e: 'show-survey', surveyId: number): void }>();

const props = defineProps<{
    task: TaskView;
    relations: TaskRelationEntity[];
}>();

const requests = computed(() =>
    props.relations.filter(
        relation => relation.entity_type === TaskRelationEntityModelTypeEnum.REQUEST
    )
);

const companies = computed(() =>
    props.relations.filter(
        relation => relation.entity_type === TaskRelationEntityModelTypeEnum.COMPANY
    )
);

const survey = computed(() =>
    props.relations.find(
        relation => relation.entity_type === TaskRelationEntityModelTypeEnum.SURVEY
    )
);

const companyId = computed(() => {
    if (companies.value.length) {
        return companies.value[0].entity_id;
    }

    if (requests.value.length) {
        return requests.value[0].entity.company_id;
    }

    return undefined;
});

const requestModalIsVisible = ref(false);
const visibleRequest = ref(null);
const isLoading = ref(false);

async function showRequest(request) {
    isLoading.value = true;
    requestModalIsVisible.value = true;

    visibleRequest.value = await api.request.get(request.id);

    isLoading.value = false;
}

// edit

const editedRequest = ref(null);
const formIsVisible = ref(false);

async function editRequest(request) {
    isLoading.value = true;
    editedRequest.value = await api.request.get(request.id);
    isLoading.value = false;

    formIsVisible.value = true;
}

function closeEditForm() {
    formIsVisible.value = false;
    editedRequest.value = null;
}

function onUpdatedRequest(request) {
    const requestIndex = requests.value.findIndex(r => r.entity_id === request.id);
    if (requestIndex !== -1) {
        Object.assign(requests.value[requestIndex].entity, request);
    }

    editedRequest.value = null;
    formIsVisible.value = false;
}

// disable

const disablingRequest = ref(null);
const disableRequestFormIsVisible = ref(false);

function disableRequest(request) {
    disablingRequest.value = request;
    disableRequestFormIsVisible.value = true;
}

function onRequestDisabled(payload) {
    const requestIndex = requests.value.findIndex(r => r.entity_id === disablingRequest.value.id);
    if (requestIndex !== -1) {
        requests.value[requestIndex].entity.status = 0;
        Object.assign(requests.value[requestIndex].entity, payload);
    }

    disablingRequest.value = null;
    disableRequestFormIsVisible.value = false;
}

// change consultant

const changedRequest = shallowRef(null);
const changeModalIsVisible = ref(false);

function changeRequestConsultant(request) {
    changedRequest.value = request;
    changeModalIsVisible.value = true;
}

const notify = useNotify();

function onRequestConsultantChanged() {
    changeModalIsVisible.value = false;
    changedRequest.value = null;
    notify.success('Консультант компании успешно изменен');
}

// clone

const clonedRequestItem = shallowRef(null);
const cloneModalIsVisible = ref(false);

function cloneRequest(request) {
    clonedRequestItem.value = request;
    cloneModalIsVisible.value = true;
}

function onRequestCloned() {
    cloneModalIsVisible.value = false;
    clonedRequestItem.value = null;
    notify.success('Запрос успешно клонирован');
}

const { execute: enableRequest } = useAsync(api.request.undisable, {
    onFetchResponse: ({ args }) => {
        notify.success('Запрос успешно восстановлен.');

        const requestIndex = requests.value.findIndex(r => r.entity_id === args[0]);
        if (requestIndex !== -1) {
            requests.value[requestIndex].entity.status = 1;
        }
    },
    confirmation: true,
    confirmationContent: {
        title: 'Восстановить запрос',
        message: 'Вы уверены, что хотите восстановить запрос из архива?'
    }
});

const createTourStepElement = createTourStepElementGenerator('task-process');

useTourStep({
    key: 1,
    element: createTourStepElement('show-survey'),
    popover: {
        title: 'Просмотр опроса',
        description:
            'Мгновенно открывайте опрос для просмотра результатов, необходимых для выполнения задачи.',
        side: 'right',
        align: 'start'
    }
});

useTourStep({
    key: 2,
    element: createTourStepElement('show-requests'),
    popover: {
        title: 'Управление запросом',
        description:
            'Редактируйте, архивируйте, восстанавливайте и просматривайте запрос в пару нажатий.',
        side: 'right',
        align: 'start'
    }
});

// company

const companyFormIsVisible = ref(false);
const editedCompany = ref(null);

async function editCompany(company) {
    company.loading = true;
    editedCompany.value = await api.companies.getCompany(company.id);
    company.loading = false;

    companyFormIsVisible.value = true;
}

function onUpdatedCompany(company) {
    const companyIndex = companies.value.findIndex(r => r.entity_id === company.id);
    if (companyIndex !== -1) {
        Object.assign(companies.value[companyIndex].entity, company);
    }

    editedCompany.value = null;
    companyFormIsVisible.value = false;
}

const {
    disableCompany,
    disableFormIsVisible,
    enableCompany,
    disablingCompany,
    onDisabledCompany,
    closeDisableForm
} = useCompanyDisable();
</script>
