<template>
    <div class="task-card">
        <Loader v-if="isLoading || isDeleting || isUpdating || isRestoring" />
        <TaskCardHeader
            @delete="deleteTask"
            @restore="restoreTask"
            @edit="editTask"
            @read="readTask"
            @to-chat="toChat"
            @assign="assignerFormIsVisible = !assignerFormIsVisible"
            @change-status="moveSettingsIsVisible = !moveSettingsIsVisible"
            @change-dates="changeDatesFormIsVisible = !changeDatesFormIsVisible"
            @change-type="changeTypeFormIsVisible = !changeTypeFormIsVisible"
            @postpone="postponeFormIsVisible = !postponeFormIsVisible"
            @complete="completeTask"
            :disabled="moveSettingsIsVisible || assignerFormIsVisible"
            :viewable="canBeViewed"
            :task
            :draggable
            :editable
        />
        <div class="task-card__content">
            <div class="task-card__column">
                <div class="task-card__description mb-1">
                    <p class="task-card__label">Заголовок</p>
                    <div ref="titleElement" class="task-card__title"></div>
                </div>
                <div v-if="task.message" class="task-card__description mb-3">
                    <p class="task-card__label">Описание</p>
                    <div ref="messageElement" class="task-card__message"></div>
                </div>
                <TaskCardChatInfo
                    v-if="task.related_by.chat_member"
                    @to-chat="toChat"
                    @to-company="toCompany(objectCompanyId)"
                    @show-contacts="showContacts(objectCompanyId)"
                    :company-id="objectCompanyId"
                    :task
                />
                <TaskCardProcess v-if="canBeProcessed" :task />
                <EmptyData
                    v-if="!task.related_by.chat_member && !canBeProcessed"
                    class="task-card__empty mt-2"
                >
                    Задача не связана с чатом
                </EmptyData>
            </div>
            <div class="task-card__column">
                <Tabs nav-class="task-card__tabs" nav-item-link-class="task-card__tab-link">
                    <Tab :name="`Комментарии (${task.comments_count ?? 0})`">
                        <TaskCardComments
                            @created="$emit('added-comment', $event)"
                            @deleted="$emit('deleted-comment', $event)"
                            :task
                        />
                    </Tab>
                    <Tab :name="`История (${task.histories_count})`">
                        <TaskCardHistory @created="$emit('history-changed', $event)" :task />
                    </Tab>
                    <Tab :name="`Файлы (${task.files_count ?? 0})`">
                        <TaskCardFiles
                            @count-changed="$emit('files-count-changed', $event)"
                            :task
                        />
                    </Tab>
                    <Tab :name="`Связи (${task.relations_count})`">
                        <TaskCardRelations
                            @count-changed="$emit('relations-count-changed', $event)"
                            @show-contacts="showContacts"
                            @to-company="toCompany"
                            :task
                        />
                    </Tab>
                </Tabs>
                <AnimationTransition :speed="0.3">
                    <TaskCardStatus
                        v-if="moveSettingsIsVisible"
                        @toggle="changeStatus"
                        @close="moveSettingsIsVisible = false"
                        :loading="statusIsChanging"
                        :status="task.status"
                        :task-id="task.id"
                    />
                </AnimationTransition>
                <AnimationTransition :speed="0.3">
                    <TaskCardModalPostpone
                        v-if="postponeFormIsVisible"
                        @confirm="postponeTask"
                        @close="postponeFormIsVisible = false"
                        :loading="isLoadingPostpone"
                        :start-date="task.start"
                    />
                </AnimationTransition>
                <AnimationTransition :speed="0.3">
                    <TaskCardModalChangeDates
                        v-if="changeDatesFormIsVisible"
                        @confirm="changeDates"
                        @close="changeDatesFormIsVisible = false"
                        :loading="datesIsChanging"
                        :start-date="task.start"
                        :end-date="task.end"
                    />
                </AnimationTransition>
                <AnimationTransition :speed="0.3">
                    <TaskCardAssigner
                        v-if="assignerFormIsVisible"
                        @assign="assign"
                        @close="assignerFormIsVisible = false"
                        :loading="assignerIsChanging"
                        :current-assigner="task.user_id"
                    />
                </AnimationTransition>
                <AnimationTransition :speed="0.3">
                    <TaskCardContacts
                        v-if="contactsIsVisible"
                        @close="contactsIsVisible = false"
                        :company-id="currentContactsCompanyId"
                    />
                </AnimationTransition>
                <AnimationTransition v-if="currentUserIsAdmin" :speed="0.3">
                    <TaskCardModalChangeType
                        v-if="changeTypeFormIsVisible"
                        @confirm="changeType"
                        @close="changeTypeFormIsVisible = false"
                        :loading="typeIsChanging"
                        :type="task.type"
                    />
                </AnimationTransition>
            </div>
        </div>
        <TaskCardInfo :task />
    </div>
</template>

<script setup>
import TaskCardStatus from '@/components/TaskCard/TaskCardModalStatus.vue';
import { computed, onMounted, ref, toRef, useTemplateRef } from 'vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { taskOptions } from '@/const/options/task.options.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useStore } from 'vuex';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { debounce } from '@/utils/common/debounce.js';
import Loader from '@/components/common/Loader.vue';
import { messenger } from '@/const/messenger.js';
import { getLinkCompany } from '@/utils/url.js';
import TaskCardHeader from '@/components/TaskCard/TaskCardHeader.vue';
import TaskCardInfo from '@/components/TaskCard/TaskCardInfo.vue';
import TaskCardChatInfo from '@/components/TaskCard/TaskCardChatInfo.vue';
import TaskCardAssigner from '@/components/TaskCard/TaskCardModalAssigner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import TaskCardComments from '@/components/TaskCard/TaskCardComments.vue';
import TaskCardHistory from '@/components/TaskCard/History/TaskCardHistory.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useEventBus } from '@vueuse/core';
import { TASK_EVENTS } from '@/const/events/task.js';
import { useAuth } from '@/composables/useAuth.js';
import { useLinkify } from '@/composables/useLinkify.js';
import TaskCardFiles from '@/components/TaskCard/TaskCardFiles.vue';
import TaskCardContacts from '@/components/TaskCard/TaskCardContactsList.vue';
import TaskCardModalPostpone from '@/components/TaskCard/TaskCardModalPostpone.vue';
import { useAsync } from '@/composables/useAsync.js';
import { dayjsFromServer, toServerDate } from '@/utils/formatters/date.ts';
import dayjs from 'dayjs';
import TaskCardRelations from '@/components/TaskCard/Relations/TaskCardRelations.vue';
import TaskCardProcess from '@/components/TaskCard/Process/TaskCardProcess.vue';
import { TaskTypeEnum } from '@/types/task';
import TaskCardModalChangeDates from '@/components/TaskCard/TaskCardModalChangeDates.vue';
import TaskCardModalChangeType from '@/components/TaskCard/TaskCardModalChangeType.vue';

const emit = defineEmits([
    'updated',
    'to-chat',
    'read',
    'added-comment',
    'deleted-comment',
    'history-changed',
    'files-count-changed',
    'relations-count-changed'
]);
const props = defineProps({
    task: Object,
    editable: Boolean,
    draggable: Boolean
});

const notify = useNotify();
const store = useStore();
const { currentUserId, currentUserIsModeratorOrHigher, currentUserIsAdmin } = useAuth();

const { isLoading } = useDelayedLoader();

const canBeViewed = computed(() => {
    if (props.task?.observers?.length) {
        return props.task.observers.some(
            observer =>
                Number(observer.user_id) === Number(store.getters.THIS_USER.id) &&
                observer.viewed_at === null
        );
    }

    return false;
});

onMounted(() => {
    if (canBeViewed.value) debouncedReadTask();
});

const taskReadEvent = useEventBus(TASK_EVENTS.READ);

const { execute: readTask } = useAsync(api.task.read, {
    onFetchResponse() {
        taskReadEvent.emit();
        emit('read');
        notify.success('Задача помечена прочитанной');
    },
    payload: () => props.task.id
});

const debouncedReadTask = debounce(readTask, 500);

// EDIT

const { show: showTaskCreator } = useAsyncPopup('taskCreator');
const { isLoading: isUpdating, execute: updateTask } = useAsync(api.task.update);

async function editTask() {
    const taskPayload = await showTaskCreator(props.task);
    if (!taskPayload) return;

    const task = await updateTask(props.task.id, taskPayload);
    if (task) {
        emit('updated', task);
        notify.success('Задача успешно обновлена');
    }
}

// CHANGE STATUS

const moveSettingsIsVisible = ref(false);
const statusIsChanging = ref(false);

const taskCompleteEvent = useEventBus(TASK_EVENTS.COMPLETE);

async function changeStatus(payload) {
    statusIsChanging.value = true;

    try {
        const updated = await api.task.changeStatus(props.task.id, payload.status, payload);

        if (updated) {
            notify.success('Статус задачи успешно изменен');

            if (
                (payload.status === taskOptions.statusTypes.COMPLETED ||
                    payload.status === taskOptions.statusTypes.CANCELED) &&
                props.task.user_id === currentUserId.value
            ) {
                taskCompleteEvent.emit();
            }

            const task = await api.task.getOne(props.task.id);
            if (task) emit('updated', task);
        }
    } finally {
        statusIsChanging.value = false;
    }
}

async function completeTask() {
    isUpdating.value = true;

    try {
        await api.task.changeStatus(props.task.id, taskOptions.clearStatusTypes.COMPLETED);

        notify.success('Статус задачи успешно изменен');

        if (props.task.user_id === currentUserId.value) {
            taskCompleteEvent.emit();
        }

        const task = await api.task.getOne(props.task.id);
        if (task) emit('updated', task);
    } finally {
        isUpdating.value = false;
    }
}

// postpone

const { execute: executePostponeTask, isLoading: isLoadingPostpone } = useAsync(api.task.postpone);

const postponeFormIsVisible = ref(false);

async function postponeTask(date) {
    const dateDiff = dayjsFromServer(props.task.end).diff(
        dayjsFromServer(props.task.start),
        'second'
    );
    const endDate = toServerDate(dayjs(date).add(dateDiff, 'second').toDate());

    const updatedTask = await executePostponeTask(props.task.id, { start: date, end: endDate });

    if (updatedTask) {
        postponeFormIsVisible.value = false;
        emit('updated', updatedTask);
    }
}

// STATE CHANGING

const { execute: restoreTask, isLoading: isRestoring } = useAsync(api.task.restore, {
    onFetchResponse({ response }) {
        if (response) {
            emit('updated', { ...props.task, deleted_at: null });
            notify.info('Задача успешно восстановлена', 'Восстановление задачи');
        }
    },
    confirmation: true,
    confirmationContent: {
        title: 'Восстановить задачу',
        message: 'Вы уверены, что хотите восстановить задачу?',
        okButton: 'Восстановить'
    },
    payload: () => props.task.id
});

const { execute: deleteTask, isLoading: isDeleting } = useAsync(api.task.delete, {
    onFetchResponse() {
        emit('updated', { ...props.task, deleted_at: new Date() });
        notify.info('Задача успешно удалена');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить задачу',
        message: 'Вы уверены, что хотите удалить задачу? Удаленную задачу нельзя восстановить',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    },
    payload: () => props.task.id
});

// CHAT

const objectCompanyId = computed(() => {
    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.OBJECT)
        return props.task.related_by.chat_member.model.object.company?.id;

    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.REQUEST)
        return props.task.related_by.chat_member.model.company?.id;

    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.COMPANY)
        return props.task.related_by.chat_member.model.id;

    return null;
});

function toChat() {
    const modelType = props.task.related_by.chat_member.model_type;

    switch (modelType) {
        case 'request':
            emit('to-chat', {
                companyID: props.task.related_by.chat_member.model.company_id,
                modelType,
                objectID: props.task.related_by.chat_member.model.id
            });
            break;
        case 'object':
            emit('to-chat', {
                companyID: props.task.related_by.chat_member.model.object.company.id,
                modelType,
                objectID: props.task.related_by.chat_member.model.object.id
            });
            break;
        case 'company':
            emit('to-chat', {
                companyID: props.task.related_by.chat_member.model.id,
                modelType,
                objectID: props.task.related_by.chat_member.model.id
            });
            break;
        case 'user':
            emit('to-chat', {
                userID: props.task.related_by.chat_member.model.id,
                modelType
            });
            break;
        default:
            notify.info('Данный тип чата не поддерживается');
            break;
    }
}

function toCompany(companyId) {
    window.open(getLinkCompany(companyId), '_blank');
}

// ASSIGN

const assignerFormIsVisible = ref(false);
const assignerIsChanging = ref(false);

const reassignEventBus = useEventBus(TASK_EVENTS.REASSIGN);

async function assign(payload) {
    assignerIsChanging.value = true;

    const oldUserId = props.task.user_id;

    try {
        const response = await api.task.assign(props.task.id, {
            user_id: payload.assigner,
            comment: payload.comment
        });

        if (response) {
            notify.success(`Задача успешно назначена на ${response.user.userProfile.medium_name}`);

            reassignEventBus.emit({ task: response, oldUserId });

            emit('updated', response);
        }
    } finally {
        assignerIsChanging.value = false;
    }
}

// linkify

const messageElement = useTemplateRef('messageElement');

useLinkify(toRef(props.task, 'message'), messageElement);

const titleElement = useTemplateRef('titleElement');

useLinkify(toRef(props.task, 'title'), titleElement);

// contacts

const contactsIsVisible = ref(false);
const currentContactsCompanyId = ref(null);

function showContacts(companyId) {
    currentContactsCompanyId.value = companyId;

    contactsIsVisible.value = true;
}

const canBeProcessed = computed(() => {
    return (
        (currentUserIsModeratorOrHigher.value || props.task.user_id === currentUserId.value) &&
        (props.task.type === TaskTypeEnum.REQUEST_HANDLING ||
            props.task.type === TaskTypeEnum.CONTACT_HANDLING ||
            props.task.relations_count > 0)
    );
});

const changeDatesEventBus = useEventBus(TASK_EVENTS.CHANGE_DATES);

// change dates

const changeDatesFormIsVisible = ref(false);
const datesIsChanging = ref(false);

async function changeDates(payload) {
    datesIsChanging.value = true;

    try {
        const response = await api.task.changeDates(props.task.id, payload);

        notify.success(`Даты задачи успешно изменены`);

        changeDatesFormIsVisible.value = false;
        changeDatesEventBus.emit({ task: response });

        emit('updated', response);
    } finally {
        datesIsChanging.value = false;
    }
}

// change type

const changeTypeFormIsVisible = ref(false);
const typeIsChanging = ref(false);

async function changeType(payload) {
    typeIsChanging.value = true;

    try {
        const response = await api.task.changeType(props.task.id, payload);

        notify.success(`Тип задачи успешно изменен`);

        changeDatesFormIsVisible.value = false;

        emit('updated', response);
    } finally {
        datesIsChanging.value = false;
    }
}
</script>
