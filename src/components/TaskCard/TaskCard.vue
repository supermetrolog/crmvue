<template>
    <div class="task-card">
        <Loader v-if="isLoading" />
        <TaskCardHeader
            @delete="deleteTask"
            @restore="restore"
            @edit="editTask"
            @read="readTask"
            @to-chat="toChat"
            @assign="assignerFormIsVisible = !assignerFormIsVisible"
            @change-status="moveSettingsIsVisible = !moveSettingsIsVisible"
            @to-impossible="toImpossible"
            :disabled="moveSettingsIsVisible || assignerFormIsVisible"
            :viewable="canBeViewed"
            :task
            :draggable
            :editable
        />
        <div class="task-card__content">
            <div class="task-card__column">
                <div class="task-card__description mb-3">
                    <p class="task-card__label">Задание</p>
                    <div ref="messageElement" class="task-card__message"></div>
                </div>
                <TaskCardChatInfo
                    v-if="task.related_by.chat_member"
                    @to-chat="toChat"
                    @to-company="toCompany"
                    @show-contacts="contactsIsVisible = true"
                    :company-id="objectCompanyId"
                    :task
                />
                <EmptyData v-else class="task-card__empty">Задача не связана с чатом</EmptyData>
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
                        @close="contactsIsVisible = false"
                        :visible="contactsIsVisible"
                        :company-id="objectCompanyId"
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
import { useConfirm } from '@/composables/useConfirm.js';
import { taskOptions } from '@/const/options/task.options.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useStore } from 'vuex';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { debounce } from '@/utils/common/debounce.js';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
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
import dayjs from 'dayjs';

const DAYS_TO_IMPOSSIBLE = 14;

const emit = defineEmits([
    'updated',
    'to-chat',
    'read',
    'added-comment',
    'deleted-comment',
    'history-changed',
    'files-count-changed'
]);
const props = defineProps({
    task: Object,
    editable: Boolean,
    draggable: Boolean
});

const notify = useNotify();
const { confirm } = useConfirm();
const store = useStore();
const { currentUserId } = useAuth();

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

async function readTask() {
    const response = await api.task.read(props.task.id);

    if (response) {
        taskReadEvent.emit();
        emit('read');
        notify.success('Задача помечена прочитанной');
    }
}

const debouncedReadTask = debounce(readTask, 500);

// EDIT

const { show: showTaskCreator } = useAsyncPopup('taskCreator');

async function editTask() {
    const taskPayload = await showTaskCreator(props.task);
    if (!taskPayload) return;

    const task = await api.task.update(props.task.id, taskPayload);
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

    statusIsChanging.value = false;
}

async function toImpossible() {
    isLoading.value = true;

    const impossibleDate = dayjs
        .max(dayjsFromMoscow(props.task.end), dayjs())
        .add(DAYS_TO_IMPOSSIBLE, 'day')
        .toDate();

    try {
        await changeStatus({
            status: taskOptions.statusTypes.CANCELED,
            impossible_to: impossibleDate
        });
    } finally {
        isLoading.value = false;
    }
}

// STATE CHANGING

async function restore() {
    const confirmed = await confirm('Вы уверены, что хотите восстановить задачу?');
    if (!confirmed) return;

    const restored = await api.task.restore(props.task.id);
    if (restored) {
        emit('updated', { ...props.task, deleted_at: null });
        notify.info('Задача успешно восстановлена', 'Восстановление задачи');
    }
}

async function deleteTask() {
    const confirmed = await confirm('Вы уверены, что хотите безвозвратно удалить задачу?');
    if (!confirmed) return;

    const deleted = await api.task.delete(props.task.id);
    if (deleted) {
        emit('updated', { ...props.task, deleted_at: new Date() });
        notify.info('Задача успешно удалена');
    }
}

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

function toCompany() {
    window.open(getLinkCompany(objectCompanyId.value), '_blank');
}

// ASSIGN

const assignerFormIsVisible = ref(false);
const assignerIsChanging = ref(false);

const reassignEventBus = useEventBus(TASK_EVENTS.REASSIGN);

async function assign(payload) {
    assignerIsChanging.value = true;

    const oldUserId = props.task.user_id;

    const response = await api.task.assign(props.task.id, {
        user_id: payload.assigner,
        comment: payload.comment
    });

    if (response) {
        notify.success(`Задача успешно назначена на ${response.user.userProfile.medium_name}`);

        reassignEventBus.emit({ task: response, oldUserId });

        emit('updated', response);
    }

    assignerIsChanging.value = false;
}

// linkify

const messageElement = useTemplateRef('messageElement');

useLinkify(toRef(props.task, 'message'), messageElement);

// contacts

const contactsIsVisible = ref(false);
</script>
