<template>
    <div v-if="visible" class="dashboard-task-item-preview pb-2">
        <Loader v-if="isLoading" />
        <Spinner v-if="loading" class="absolute-center" />
        <template v-else>
            <div class="dashboard-task-item-preview__header">
                <div class="dashboard-task-item-preview__actions">
                    <HoverActionsButton
                        v-if="canBeViewed"
                        @click="readTask"
                        label="Отметить прочитанным"
                    >
                        <i class="fa-solid fa-user-check"></i>
                    </HoverActionsButton>
                    <div v-if="draggable && canBeEdit" class="dashboard-card-task__moves">
                        <HoverActionsButton
                            @click.stop="moveSettingsIsVisible = !moveSettingsIsVisible"
                            label="Изменить статус"
                        >
                            <i class="fa-solid fa-arrow-right-arrow-left"></i>
                        </HoverActionsButton>
                    </div>
                    <div v-if="canBeSuspend" class="dashboard-card-task__moves">
                        <HoverActionsButton @click.stop="toImpossible" label="Отложить">
                            <i class="fa-solid fa-eye-slash"></i>
                        </HoverActionsButton>
                    </div>
                    <HoverActionsButton
                        v-if="task.related_by"
                        @click="toChat"
                        label="Перейти в чат"
                    >
                        <i class="fa-solid fa-comment-alt" />
                    </HoverActionsButton>
                    <HoverActionsButton
                        v-if="editable && canBeEdit"
                        @click="editTask"
                        label="Редактировать"
                    >
                        <i class="fa-solid fa-pen" />
                    </HoverActionsButton>
                    <HoverActionsButton
                        v-if="canBeDeleted"
                        @click="deleteTask"
                        :disabled="isDeleted"
                        label="Удалить"
                    >
                        <i class="fa-solid fa-trash" />
                    </HoverActionsButton>
                </div>
                <div class="dashboard-task-item-preview__users">
                    <Avatar
                        v-tippy="`Создана сотрудником ${task.created_by.userProfile.medium_name}`"
                        :src="task.created_by.userProfile.avatar"
                        :size="35"
                    />
                    <i class="dashboard-task-item-preview__arrow fa-solid fa-arrow-right-long"></i>
                    <Tippy>
                        <template #default>
                            <Avatar
                                :src="task.user.userProfile.avatar"
                                :size="35"
                                rectangle
                                class="dashboard-card-task__user"
                                :class="{
                                    'dashboard-card-task__not-viewed':
                                        !task.is_viewed && !isCompleted
                                }"
                            />
                        </template>
                        <template #content>
                            <p>Назначена для {{ task.user.userProfile.medium_name }}</p>
                            <p v-if="task.is_viewed" class="color-light">
                                Просмотрена {{ viewedAt }}
                            </p>
                            <p v-else class="color-light">Не просмотрена</p>
                        </template>
                    </Tippy>
                    <Tippy v-if="observers.length" interactive>
                        <div class="dashboard-task-item-preview__observers">
                            <span>+ {{ observers.length }}</span>
                            <i class="fa-solid fa-eye" />
                        </div>
                        <template #content>
                            <p class="mb-1">Список всех наблюдателей:</p>
                            <div class="d-flex gap-1 flex-wrap">
                                <DashboardTableTasksItemObserver
                                    v-for="observer in observers"
                                    :key="observer.id"
                                    :observer="observer"
                                    :size="30"
                                />
                            </div>
                        </template>
                    </Tippy>
                </div>
            </div>
            <div class="dashboard-task-item-preview__content">
                <div class="dashboard-task-item-preview__column">
                    <div class="dashboard-task-item-preview__description">
                        <div class="dashboard-task-item-preview__chips">
                            <DashboardChip class="dashboard-task-item-preview__chip">
                                Задача #{{ task.id }}
                            </DashboardChip>
                            <DashboardChip
                                class="dashboard-task-item-preview__chip dashboard-task-item-preview__status"
                            >
                                <i :class="statusIcon" />
                                <span>{{ status }}</span>
                                <span v-if="isCanceled">до {{ impossibleDate }}</span>
                            </DashboardChip>
                            <DashboardChip
                                v-if="isAlreadyExpired"
                                class="dashboard-bg-danger text-white"
                            >
                                Просрочено
                            </DashboardChip>
                        </div>
                        <template v-if="task.tags?.length">
                            <p class="dashboard-task-item-preview__label my-1">Теги:</p>
                            <div class="dashboard-task-item-preview__chips">
                                <DashboardChip
                                    v-for="tag in task.tags"
                                    :key="tag.id"
                                    class="dashboard-task-item-preview__tag"
                                    :style="{ backgroundColor: '#' + tag.color }"
                                >
                                    <span>{{ tag.name ?? tag.label }}</span>
                                </DashboardChip>
                            </div>
                        </template>
                        <p class="dashboard-task-item-preview__label my-1">Описание задачи:</p>
                        <div class="dashboard-task-item-preview__message">
                            <p>{{ task.message }}</p>
                        </div>
                    </div>
                    <p class="dashboard-task-item-preview__label my-1">Последний комментарий:</p>
                    <div class="dashboard-task-item-preview__message">
                        <template v-if="task.last_comment">
                            <DashboardTableTasksItemPreviewComment
                                class="mb-1"
                                :comment="task.last_comment"
                            />
                            <button
                                @click.prevent="openComments"
                                class="dashboard-task-item-preview__button"
                            >
                                Открыть комментарии
                            </button>
                        </template>
                        <EmptyLabel v-else>Комментарии отсутствуют</EmptyLabel>
                    </div>
                    <div class="dashboard-task-item-preview__form">
                        <Textarea
                            v-model="newComment"
                            class="mb-1 dashboard-task-item-preview__textarea"
                            label="Новый комментарий"
                        />
                        <button
                            @click.prevent="createComment"
                            :disabled="!newComment?.length"
                            class="dashboard-task-item-preview__button"
                        >
                            Отправить
                        </button>
                    </div>
                    <AccordionSimple>
                        <template #title>
                            <AccordionSimpleTriggerButton label="Дополнительная информация" />
                        </template>
                        <template #body>
                            <div class="dashboard-task-item-preview__info mt-1">
                                <DashboardTableTasksItemPreviewRow label="Создано">
                                    {{ createdDate }}
                                </DashboardTableTasksItemPreviewRow>
                                <DashboardTableTasksItemPreviewRow label="Обновлено">
                                    {{ updatedDate }}
                                </DashboardTableTasksItemPreviewRow>
                                <DashboardTableTasksItemPreviewRow v-if="isDeleted" label="Удалено">
                                    {{ deletedDate }}
                                </DashboardTableTasksItemPreviewRow>
                                <DashboardTableTasksItemPreviewRow
                                    v-if="task.start"
                                    label="Исполнение с"
                                >
                                    <span>{{ startDate }}</span>
                                </DashboardTableTasksItemPreviewRow>
                                <DashboardTableTasksItemPreviewRow label="Срок выполнения">
                                    <span>{{ dayToExpired }} до {{ expiredDate }}</span>
                                    <span v-if="isAlreadyExpired" class="error-message">
                                        (просрочено на {{ dayToExpiredFromNow }})
                                    </span>
                                    <span v-else-if="!isCompleted">
                                        (осталось {{ dayToExpiredFromNow }})</span
                                    >
                                </DashboardTableTasksItemPreviewRow>
                                <DashboardTableTasksItemPreviewRow
                                    v-if="isCanceled"
                                    label="Отложено"
                                >
                                    до {{ impossibleDate }}
                                </DashboardTableTasksItemPreviewRow>
                                <DashboardTableTasksItemPreviewRow label="Автор">
                                    <span v-if="task.is_system">Система</span>
                                    <span v-else>
                                        {{ task.created_by.userProfile.medium_name }}
                                    </span>
                                </DashboardTableTasksItemPreviewRow>
                                <DashboardTableTasksItemPreviewRow label="Исполнитель">
                                    <span v-if="task.user">
                                        {{ task.user.userProfile.medium_name }}
                                    </span>
                                    <span v-else>-</span>
                                </DashboardTableTasksItemPreviewRow>
                                <DashboardTableTasksItemPreviewRow label="Наблюдатели">
                                    <template v-if="task.observers?.length">
                                        {{ viewersText }}
                                    </template>
                                    <span v-else>-</span>
                                </DashboardTableTasksItemPreviewRow>
                            </div>
                        </template>
                    </AccordionSimple>
                    <AnimationTransition :speed="0.3">
                        <DashboardTableTasksItemPreviewStatus
                            v-if="moveSettingsIsVisible"
                            @toggle="changeStatus"
                            @close="moveSettingsIsVisible = false"
                            :loading="statusIsChanging"
                            :status="task.status"
                            :task-id="task.id"
                        />
                    </AnimationTransition>
                </div>
                <div class="dashboard-task-item-preview__column">
                    <div
                        v-if="task.related_by?.chat_member_id"
                        class="dashboard-task-item-preview__relation"
                    >
                        <p class="dashboard-task-item-preview__label mb-1">По чату в задачнике:</p>
                        <component
                            :is="currentDialogComponent"
                            @click="toChat"
                            :model="task.related_by.chat_member.model"
                        />
                        <div class="d-flex mt-1 gap-2">
                            <button
                                @click.prevent="toChat"
                                class="dashboard-task-item-preview__button"
                                :class="objectCompanyId ? 'w-50' : 'w-100'"
                            >
                                <span>Открыть чат</span>
                                <i class="fa-solid fa-arrow-up-right-from-square ml-2"></i>
                            </button>
                            <button
                                v-if="objectCompanyId"
                                @click.prevent="toCompany"
                                class="dashboard-task-item-preview__button w-50"
                            >
                                <span>Открыть компанию</span>
                                <i class="fa-solid fa-arrow-up-right-from-square ml-2"></i>
                            </button>
                        </div>
                        <Tippy
                            v-if="objectCompanyId"
                            interactive
                            max-width="500"
                            :interactive-border="30"
                            :on-show="onTriggerContacts"
                            :on-hide="onUntriggerContacts"
                            :delay="[300, null]"
                        >
                            <template #default>
                                <button class="dashboard-task-item-preview__button w-100 mt-1">
                                    <span>Список контактов</span>
                                    <i class="fa-solid fa-contact-card ml-2"></i>
                                </button>
                            </template>
                            <template #content>
                                <DashboardTableTasksItemPreviewContacts
                                    :visible="contactsIsVisible"
                                    :company-id="objectCompanyId"
                                />
                            </template>
                        </Tippy>
                    </div>
                    <div
                        v-if="task.related_by?.chat_member_message_id"
                        class="dashboard-task-item-preview__relation"
                    >
                        <p class="dashboard-task-item-preview__label mb-1">
                            Прикреплено к сообщению:
                        </p>
                        <MessengerChatShortMessage
                            class="dashboard-task-item-preview__chat-message"
                            :message="chatMemberMessage"
                        />
                    </div>
                    <AnimationTransition :speed="0.3">
                        <DashboardTableTasksItemPreviewComments
                            v-if="commentsIsOpen"
                            @close="commentsIsOpen = false"
                            @added-comment="onCommentCreated"
                            :task-id="task.id"
                        />
                    </AnimationTransition>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardTableTasksItemPreviewStatus from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemPreviewStatus.vue';
import { computed, ref, shallowRef, watch } from 'vue';
import DashboardTableTasksItemPreviewRow from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemPreviewRow.vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import dayjs from 'dayjs';
import plural from 'plural-ru';
import { taskOptions } from '@/const/options/task.options.js';
import MessengerDialogObject from '@/components/Messenger/Dialog/Object/MessengerDialogObject.vue';
import MessengerDialogRequest from '@/components/Messenger/Dialog/MessengerDialogRequest.vue';
import DashboardTableTasksItemPreviewComments from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemPreviewComments.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import DashboardTableTasksItemPreviewComment from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemPreviewComment.vue';
import { useStore } from 'vuex';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import Spinner from '@/components/common/Spinner.vue';
import MessengerChatShortMessage from '@/components/Messenger/Chat/Message/MessengerChatShortMessage.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import { debounce } from '@/utils/debounce.js';
import MessengerDialogUser from '@/components/Messenger/Dialog/MessengerDialogUser.vue';
import { dayjsFromMoscow } from '@/utils/index.js';
import { toBeautifulDateFormat, toDateFormat } from '@/utils/formatter.js';
import Loader from '@/components/common/Loader.vue';
import { messenger } from '@/const/messenger.js';
import { getLinkCompany } from '@/utils/url.js';
import { Tippy } from 'vue-tippy';
import DashboardTableTasksItemPreviewContacts from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemPreviewContacts.vue';
import MessengerDialogCompany from '@/components/Messenger/Dialog/Company/MessengerDialogCompany.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';
import Avatar from '@/components/common/Avatar.vue';
import DashboardTableTasksItemObserver from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemObserver.vue';

const DAYS_TO_IMPOSSIBLE = 30;

const emit = defineEmits(['updated', 'to-chat', 'read']);
const props = defineProps({
    task: {
        type: [Object, null],
        required: true
    },
    editable: {
        type: Boolean,
        default: false
    },
    draggable: {
        type: Boolean,
        default: false
    },
    visible: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const notify = useNotify();
const { confirm } = useConfirm();
const { show: showTaskCreator } = useAsyncPopup('taskCreator');
const store = useStore();

const newComment = shallowRef(null);
const moveSettingsIsVisible = shallowRef(false);
const commentsIsOpen = shallowRef(false);
const statusIsChanging = shallowRef(false);
const isLoading = shallowRef(false);
const contactsIsVisible = ref(false);

const isCompleted = computed(() => props.task.status === taskOptions.statusTypes.COMPLETED);
const isDeleted = computed(() => props.task.deleted_at !== null);
const isAlreadyExpired = computed(() => expiredDayjs.value.isBefore(dayjs()) && !isCompleted.value);
const isCanceled = computed(() => props.task.status === taskOptions.statusTypes.CANCELED);

const expiredDayjs = computed(() => dayjsFromMoscow(props.task.end));
const deletedDate = computed(() => toDateFormat(props.task.deleted_at, 'D MMMM YYYY, HH:mm'));
const createdDate = computed(() => toDateFormat(props.task.created_at, 'D MMMM YYYY, HH:mm'));
const updatedDate = computed(() => toDateFormat(props.task.updated_at, 'D MMMM YYYY, HH:mm'));
const expiredDate = computed(() => {
    if (expiredDayjs.value.isSame(dayjs(), 'year')) expiredDayjs.value.format('D MMMM');
    return expiredDayjs.value.format('D MMMM YYYY');
});
const startDate = computed(() => toDateFormat(props.task.start, 'D MMMM YYYY'));
const impossibleDate = computed(() => toDateFormat(props.task.impossible_to, 'D.MM.YY'));
const dayToExpired = computed(() => {
    const diff = Math.abs(
        expiredDayjs.value.diff(props.task.start ?? props.task.created_at, 'days')
    );

    if (diff === 0) return 'В течение дня';
    return plural(diff, '%d день', '%d дня', '%d дней');
});
const dayToExpiredFromNow = computed(() =>
    plural(Math.abs(expiredDayjs.value.diff(dayjs(), 'days')), '%d день', '%d дня', '%d дней')
);
const status = computed(() => taskOptions.status[props.task.status]);
const statusIcon = computed(() => taskOptions.statusIcon[props.task.status]);
const canBeDeleted = computed(() => store.getters.isAdmin || store.getters.isDirector);
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

const canBeEdit = computed(() => {
    return store.getters.isAdmin || store.getters.isDirector || !isCompleted.value;
});

const viewersText = computed(() =>
    props.task.observers.map(element => element.user.userProfile.medium_name).join(', ')
);

const chatMemberMessage = computed(() => {
    const message = props.task.related_by.chat_member_message;
    message.dayjs_date = dayjsFromMoscow(message.created_at);
    return message;
});

const canBeSuspend = computed(() => {
    return (
        dayjsFromMoscow(props.task.end).subtract(DAYS_TO_IMPOSSIBLE, 'day').isAfter(dayjs()) &&
        !isCanceled.value &&
        !isCompleted.value
    );
});

const observers = computed(() =>
    props.task.observers.filter(observer => observer.user.id !== props.task.user.id)
);

const clearState = () => {
    newComment.value = null;
    moveSettingsIsVisible.value = false;
    commentsIsOpen.value = false;
};

const editTask = async () => {
    const taskPayload = await showTaskCreator(props.task);
    if (!taskPayload) return;

    const task = await api.task.update(props.task.id, taskPayload);
    if (task) {
        emit('updated', task);
        notify.success('Задача успешно обновлена');
    }
};

const deleteTask = async () => {
    const confirmed = await confirm('Вы уверены, что хотите безвозвратно удалить задачу?');
    if (!confirmed) return;

    const deleted = await api.task.delete(props.task.id);
    if (deleted) {
        emit('updated', { ...props.task, deleted_at: new Date() });
        notify.info('Задача успешно удалена');
    }
};

const readTask = async () => {
    const response = await api.task.read(props.task.id);
    if (response) {
        emit('read');
        notify.success('Задача помечена прочитанной');
    }
};

const currentDialogComponent = computed(() => {
    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.REQUEST)
        return MessengerDialogRequest;
    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.USER)
        return MessengerDialogUser;
    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.COMPANY)
        return MessengerDialogCompany;
    return MessengerDialogObject;
});

const objectCompanyId = computed(() => {
    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.OBJECT)
        return props.task.related_by.chat_member.model.object.company?.id;

    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.REQUEST)
        return props.task.related_by.chat_member.model.company?.id;

    if (props.task.related_by.chat_member.model_type === messenger.dialogTypes.COMPANY)
        return props.task.related_by.chat_member.model.id;

    return null;
});

const viewedAt = computed(() => {
    return toBeautifulDateFormat(props.task.viewed_at);
});

watch(
    () => props.visible,
    newValue => {
        if (newValue && canBeViewed.value) debouncedReadTask();
    }
);

watch(
    () => props.task?.id,
    () => {
        clearState();
        if (props.visible && canBeViewed.value) {
            debouncedReadTask();
        }
    }
);

const openComments = () => {
    commentsIsOpen.value = true;
};

const createComment = async () => {
    const created = await api.task.createComment(props.task.id, {
        message: newComment.value
    });

    if (created) {
        emit('updated', { ...props.task, last_comment: created });
        newComment.value = null;
        notify.success('Комментарий успешно добавлен');
    }
};

const onCommentCreated = comment => {
    newComment.value = null;
    emit('updated', { ...props.task, last_comment: comment });
};

const changeStatus = async payload => {
    statusIsChanging.value = true;
    const updated = await api.task.changeStatus(props.task.id, payload.status, payload);

    if (updated) {
        notify.success('Статус задачи успешно изменен');
        const task = await api.task.getOne(props.task.id);
        if (task) emit('updated', task);
    }

    statusIsChanging.value = false;
};

const toImpossible = async () => {
    isLoading.value = true;

    await changeStatus({
        status: taskOptions.statusTypes.CANCELED,
        impossible_to: dayjs(props.task.end).subtract(DAYS_TO_IMPOSSIBLE, 'day').toDate()
    });

    isLoading.value = false;
};

const toChat = () => {
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
};

const toCompany = () => {
    window.open(getLinkCompany(objectCompanyId.value), '_blank');
};

const debouncedReadTask = debounce(readTask, 500);

const onTriggerContacts = () => {
    contactsIsVisible.value = true;
};

const onUntriggerContacts = () => {
    contactsIsVisible.value = false;
};
</script>
