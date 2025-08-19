<template>
    <div class="survey-form-requests p-2">
        <div>
            <div class="survey-form-object-preview__tabs">
                <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.ACTIVE">
                    <span>Актив ( {{ activeRequests.length }} )</span>
                </SurveyFormObjectsPreviewTab>
                <span>|</span>
                <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.PASSIVE">
                    <span>Пассив ( {{ passiveRequests.length }} )</span>
                </SurveyFormObjectsPreviewTab>
                <template v-if="activeRequests.length && !disabled">
                    <span>|</span>
                    <span @click="addNewRequest" class="survey-form-objects__link">
                        + Добавить запрос
                    </span>
                </template>
                <div v-if="activeRequests.length && !disabled" class="d-flex gap-1 ml-auto">
                    <UiDropdownActions>
                        <template #trigger>
                            <UiButton color="light" class="py-0 px-1 op-7" mini>
                                <div class="d-flex align-items-center">
                                    <span class="fs-2">Отметить все как</span>
                                    <i class="fa-solid fa-ellipsis-h ml-2 fs-3" />
                                </div>
                            </UiButton>
                        </template>
                        <template #menu>
                            <UiDropdownActionsButton
                                @handle="markAll(1)"
                                icon="fa-solid fa-thumbs-up"
                                label="Без изменений"
                            />
                            <UiDropdownActionsButton
                                @handle="markAll(2)"
                                icon="fa-solid fa-thumbs-down"
                                label="Больше не актуально"
                            />
                        </template>
                    </UiDropdownActions>
                </div>
            </div>
            <div v-if="form.current" class="survey-form-object-preview__content">
                <AnimationTransition :speed="0.5">
                    <div v-if="currenTab === TABS.ACTIVE">
                        <div
                            v-if="activeRequests.length || form.created?.length"
                            class="survey-form-object-preview__list"
                        >
                            <SurveyFormRequestsPreviewNewRequest
                                v-for="request in form.created"
                                :key="request.id"
                                v-model="request.description"
                                @edit="editNewRequest(request)"
                                @delete="deleteNewRequest(request)"
                                :request="request"
                                :disabled
                                :survey
                                editable
                            />
                            <hr
                                v-if="activeRequests.length && form.created?.length"
                                class="w-100"
                            />
                            <MessengerQuizFormTemplateRequest
                                v-for="request in activeRequests"
                                :key="request.id"
                                v-model="form.current[request.id]"
                                @edit="editRequest(request)"
                                :request="request"
                                :disabled
                                :survey
                                editable
                                data-tour-id="survey-form:stepper-request-card"
                            />
                        </div>
                        <EmptyData v-else no-rounded class="h-100">
                            <p>Список активных запросов пуст..</p>
                            <template #actions>
                                <UiButton
                                    @click="addNewRequest"
                                    :disabled
                                    color="success-light"
                                    icon="fa-solid fa-plus"
                                    data-tour-id="survey-form:stepper-request-create"
                                >
                                    Добавить запрос
                                </UiButton>
                            </template>
                        </EmptyData>
                    </div>
                    <div v-else-if="currenTab === TABS.PASSIVE">
                        <div v-if="passiveRequests.length" class="survey-form-object-preview__list">
                            <MessengerQuizFormTemplateRequest
                                v-for="request in passiveRequests"
                                :key="request.id"
                                :request="request"
                            />
                        </div>
                        <EmptyData v-else class="mt-2"> Список архивных запросов пуст..</EmptyData>
                    </div>
                </AnimationTransition>
            </div>
        </div>
        <teleport to="body">
            <SurveyFormRequestForm
                v-if="formIsVisible"
                @close="closeForm"
                @created="onCreatedRequest"
                @updated="onUpdatedRequest"
                :form-data="editingNewRequest"
            />
            <FormCompanyRequest
                v-if="requestFormIsVisible"
                @close="closeRequestForm"
                @updated="updateRequest"
                @created="$emit('created', $event)"
                :company-id="company.id"
                :form-data="editedRequest"
            />
            <SurveyFormRequestsSuggestModal
                v-model:visible="newRequestSuggestModalIsVisible"
                @create-task="formIsVisible = true"
                @create-request="requestFormIsVisible = true"
            />
        </teleport>
    </div>
</template>
<script setup>
import { computed, markRaw, onMounted, ref, shallowRef, watch } from 'vue';
import SurveyFormObjectsPreviewTab from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewTab.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import SurveyFormRequestForm from '@/components/SurveyForm/SurveyFormRequestForm.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';
import api from '@/api/api.js';
import MessengerQuizFormTemplateRequest from '@/components/MessengerQuiz/Form/Template/MessengerQuizFormTemplateRequest.vue';
import SurveyFormRequestsPreviewNewRequest from '@/components/SurveyForm/RequestsPreview/SurveyFormRequestsPreviewNewRequest.vue';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import { dealOptions } from '@/const/options/deal.options.js';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { createTourStepElementGenerator, useTourStep } from '@/composables/useTour/useTourStep';
import SurveyFormRequestsSuggestModal from '@/components/SurveyForm/SurveyFormRequestsSuggestModal.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

defineEmits(['created']);

const props = defineProps({
    requests: {
        type: Array,
        required: true
    },
    company: {
        type: Object,
        required: true
    },
    disabled: Boolean,
    survey: Object
});

// form

const form = defineModel({ type: Object });

function generateForm() {
    if (!('current' in form.value)) {
        form.value.current = {};
    }

    if (!('created' in form.value)) {
        form.value.created = [];
    }

    const requests = props.requests.filter(request => request.status === 1);

    for (const request of requests) {
        if (!(request.id in form.value.current)) {
            form.value.current[request.id] = {
                answer: null,
                description: null,
                snapshot: markRaw({
                    request_id: request.id,
                    express: request.expressRequest,
                    deal_type: dealOptions.type[request.dealType + 1],
                    area: toNumberOrRangeFormat(request.minArea, request.maxArea)
                })
            };
        }
    }
}

watch(() => props.requests.length, generateForm, { immediate: true });

// tabs

const TABS = {
    ACTIVE: 'active',
    PASSIVE: 'passive',
    COMPLETED: 'completed'
};

const currenTab = ref(TABS.ACTIVE);

// requests

const activeRequests = computed(() => props.requests.filter(request => request.status === 1));
const passiveRequests = computed(() => props.requests.filter(request => request.status !== 1));

// form

const formIsVisible = ref(false);
const editingNewRequest = shallowRef(null);

function editNewRequest(request) {
    editingNewRequest.value = request;
    formIsVisible.value = true;
}

function deleteNewRequest(request) {
    spliceById(form.value.created, request.id);
    if (form.value.created.length === 0) {
        currenTab.value = TABS.ACTIVE;
    }
}

const newRequestSuggestModalIsVisible = ref(false);

function addNewRequest() {
    newRequestSuggestModalIsVisible.value = true;
}

function closeForm() {
    formIsVisible.value = false;
    editingNewRequest.value = null;
}

function onCreatedRequest(request) {
    form.value.created.push(request);
    formIsVisible.value = false;
}

function onUpdatedRequest(request) {
    Object.assign(editingNewRequest.value, request);

    editingNewRequest.value = null;
    formIsVisible.value = false;
}

// edit

const editedRequest = shallowRef(null);
const requestFormIsVisible = ref(false);

function editRequest(request) {
    editedRequest.value = request;
    requestFormIsVisible.value = true;
}

function closeRequestForm() {
    requestFormIsVisible.value = false;
    editedRequest.value = null;
}

async function updateRequest() {
    const updatedRequest = await api.request.get(editedRequest.value.id);

    if (updatedRequest) {
        const index = props.requests.findIndex(element => element.id === updatedRequest.id);

        if (index !== -1) {
            Object.assign(props.requests[index], updatedRequest);
        }
    }

    closeRequestForm();
}

const notify = useNotify();

function markAll(value) {
    for (const request of activeRequests.value) {
        form.value.current[request.id].answer = value;
    }

    notify.success('Все запроса обработаны');
}

const createTourStepElement = createTourStepElementGenerator('survey-form');

const { addStep } = useTourStep();

onMounted(() => {
    if (activeRequests.value.length) {
        addStep({
            key: 11,
            element: createTourStepElement('stepper-request-card'),
            popover: {
                title: 'Карточка запроса',
                description:
                    'В карточке запроса можно ознакомиться с запрашиваемой локацией и площадью. При необходимости вы можете редактировать запрос прямо здесь с помощью меню запроса.',
                side: 'top',
                align: 'center'
            }
        });

        addStep({
            key: 12,
            element: createTourStepElement('stepper-request-form'),
            popover: {
                title: 'Положение по запросу',
                description:
                    'Для каждого запроса необходимо указать его текущий статус: актуален, больше не актуален или требуются изменения. Запросы архивируются системой автоматически.',
                side: 'left',
                align: 'center'
            }
        });
    } else {
        addStep({
            key: 11,
            element: createTourStepElement('stepper-request-create'),
            popover: {
                title: 'Результат звонка',
                description:
                    'Добавляйте новые запросы клиента в CRM с помощью формы. Будут созданы задачи для офис-менеджера.',
                side: 'top',
                align: 'center'
            }
        });
    }
});
</script>
