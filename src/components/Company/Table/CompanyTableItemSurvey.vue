<template>
    <div class="company-table-item-survey">
        <Loader v-if="company.last_survey.isLoading || isUpdating" small />
        <div class="company-table-item-survey__header">
            <div class="company-table-item-survey__title">
                <span class="company-table-item-survey__name d-flex align-items-center">
                    <Avatar
                        :src="company.last_survey.user.userProfile.avatar"
                        :size="24"
                        :label="company.last_survey.user.userProfile.short_name"
                        class="mr-2"
                    />
                    <UiTooltipIcon
                        v-if="isCanceled"
                        tooltip="Не удалось дозвониться до компании"
                        icon="fa-solid fa-phone-slash text-danger"
                    />
                    <UiTooltipIcon v-else icon="fa-solid fa-phone text-success" />
                    <span class="ml-1">Опрос #{{ company.last_survey.id }} от {{ updatedAt }}</span>
                    <span v-if="company.last_survey.contact" class="ml-1">
                        <span>с</span>
                        <Tippy interactive :interactive-border="40">
                            <template #default>
                                <span class="company-table-item-survey__contact mx-1">
                                    {{ contactName }}
                                </span>
                            </template>
                            <template #content>
                                <ContactCard :contact="company.last_survey.contact" />
                            </template>
                        </Tippy>
                        <span>({{ contactPosition }})</span>
                    </span>
                </span>
                <span
                    v-if="company.last_survey.calls?.length > 1"
                    class="company-table-item-survey__calls"
                >
                    {{ callsPluralLabel }}
                </span>
            </div>
            <UiDropdownActions
                v-if="!readOnly"
                label="Действия"
                :title="`Опрос #${company.last_survey.id}`"
                small
            >
                <template #menu>
                    <UiDropdownActionsGroup>
                        <UiDropdownActionsButton
                            @handle="$emit('open-preview')"
                            label="Посмотреть опрос"
                            icon="fa-solid fa-eye"
                        />
                    </UiDropdownActionsGroup>
                    <UiDropdownActionsGroup>
                        <UiDropdownActionsButton
                            @handle="$emit('create-task')"
                            label="Поставить задачу"
                            icon="fa-solid fa-bolt"
                        />
                        <template v-if="surveyCommentCanBeEdit">
                            <UiDropdownActionsButton
                                v-if="company.last_survey.comment"
                                @handle="editComment"
                                label="Изменить комментарий"
                                icon="fa-solid fa-pen"
                            />
                            <UiDropdownActionsButton
                                v-else
                                @handle="editComment"
                                label="Добавить комментарий"
                                icon="fa-solid fa-thumbtack"
                            />
                        </template>
                    </UiDropdownActionsGroup>
                </template>
            </UiDropdownActions>
        </div>
        <div class="company-table-item-survey__content" :class="{ expanded: isExpanded }">
            <div class="company-table-item-survey__tabs">
                <CompanyTableItemSurveyTab
                    v-if="company.last_survey.comment"
                    v-model="currentTab"
                    :name="TABS.COMMENT"
                    icon="fa-solid fa-comment"
                >
                    <div class="d-flex align-items-center gap-2">
                        <span>Важный комментарий</span>
                        <UiButtonIcon
                            v-if="surveyCommentCanBeEdit && !readOnly"
                            @click="editComment"
                            label="Изменить комментарий"
                            icon="fa-solid fa-pen"
                            transparent
                            mini
                        />
                    </div>
                </CompanyTableItemSurveyTab>
                <CompanyTableItemSurveyTab
                    v-if="baseTasks.length"
                    v-model="currentTab"
                    :name="TABS.TASKS"
                    icon="fa-solid fa-bolt"
                >
                    <div class="d-flex gap-2 align-items-center">
                        <span>Задачи</span>
                        <UiButtonIcon mini>
                            {{ baseTasks.length }}
                        </UiButtonIcon>
                    </div>
                </CompanyTableItemSurveyTab>
                <UiButton
                    v-if="scheduledCallTasks.length"
                    @click="showScheduledCallTasks"
                    class="fs-2 company-table-item-survey__tab danger"
                    color="transparent"
                    icon="fa-solid fa-phone"
                    small
                    bolder
                >
                    <span>Звонок {{ lastScheduledCallDate }}</span>
                    <span v-if="scheduledCallTasks.length > 1" class="ml-1">
                        (+{{ scheduledCallTasks.length - 1 }})
                    </span>
                </UiButton>
                <UiButton
                    v-if="scheduledVisitTasks.length"
                    @click="showScheduledVisitTasks"
                    class="fs-2 company-table-item-survey__tab danger"
                    color="transparent"
                    icon="fa-solid fa-phone-volume"
                    small
                    bolder
                >
                    <span>Встреча {{ lastScheduledVisitDate }}</span>
                    <span v-if="scheduledVisitTasks.length > 1" class="ml-1">
                        (+{{ scheduledVisitTasks.length - 1 }})
                    </span>
                </UiButton>
            </div>
            <div class="company-table-item-survey__body">
                <CompanyTableItemSurveyComment
                    v-if="currentTab === TABS.COMMENT"
                    @expanded="isExpanded = true"
                    @hidden="isExpanded = false"
                    @cancel="commentIsEditing = false"
                    @update="updateComment"
                    @delete="deleteComment"
                    :edit-mode="commentIsEditing && !readOnly"
                    :survey="company.last_survey"
                    class="mt-2"
                />
                <CompanyTableItemSurveyTasks
                    v-else-if="currentTab === TABS.TASKS"
                    @show-task="$emit('show-task', $event)"
                    :tasks="baseTasks"
                    class="mt-2"
                />
                <div
                    v-if="
                        !company.last_survey.comment &&
                        baseTasks.length === 0 &&
                        scheduledCallTasks.length === 0 &&
                        scheduledVisitTasks.length === 0 &&
                        !commentIsEditing &&
                        !readOnly
                    "
                    class="d-flex gap-2 justify-content-center"
                >
                    <UiButton
                        @click="editComment"
                        icon="fa-solid fa-plus"
                        color="transparent"
                        small
                        class="company-table-item-survey__button"
                    >
                        Добавить комментарий
                    </UiButton>
                    <UiButton
                        @click="$emit('create-task')"
                        icon="fa-solid fa-bolt"
                        color="transparent"
                        small
                        class="company-table-item-survey__button"
                    >
                        Поставить задачу
                    </UiButton>
                </div>
            </div>
        </div>
        <UiDropdownActionsTrigger
            v-if="baseTasks.length > 2"
            @click="isExpanded = !isExpanded"
            :icon="isExpanded ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'"
            class="ml-1 mr-auto w-auto fs-2 my-1"
            color="light"
            :label="isExpanded ? 'Скрыть' : 'Показать больше'"
        />
        <UiModal
            v-model:visible="scheduledCallTasksIsVisible"
            title="Запланированные звонки"
            :width="800"
        >
            <div class="d-flex flex-column gap-2">
                <DashboardTableTasksItem
                    v-for="task in scheduledCallTasks"
                    :key="task.id"
                    @view="$emit('show-task', task)"
                    :task="task"
                />
            </div>
        </UiModal>
        <UiModal
            v-model:visible="scheduledVisitTasksIsVisible"
            title="Запланированные встречи"
            :width="800"
        >
            <div class="d-flex flex-column gap-2">
                <DashboardTableTasksItem
                    v-for="task in scheduledVisitTasks"
                    :key="task.id"
                    @view="$emit('show-task', task)"
                    :task="task"
                />
            </div>
        </UiModal>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, ref, toRef, watch } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.js';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import { contactOptions } from '@/const/options/contact.options.js';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import { plural } from '@/utils/plural.js';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import CompanyTableItemSurveyComment from '@/components/Company/Table/CompanyTableItemSurveyComment.vue';
import CompanyTableItemSurveyTab from '@/components/Company/Table/CompanyTableItemSurveyTab.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import CompanyTableItemSurveyTasks from '@/components/Company/Table/CompanyTableItemSurveyTasks.vue';
import UiDropdownActionsTrigger from '@/components/common/UI/DropdownActions/UiDropdownActionsTrigger.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import { useAuth } from '@/composables/useAuth.js';
import Loader from '@/components/common/Loader.vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import { useTypedTasks } from '@/composables/task/useTypedTasks.ts';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import Avatar from '@/components/common/Avatar.vue';

const emit = defineEmits(['create-task', 'open-preview', 'edit-comment', 'show-task']);

const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    readOnly: Boolean
});

const {
    scheduledCallTasks,
    scheduledVisitTasks,
    lastScheduledCallDate,
    lastScheduledVisitDate,
    baseTasks
} = useTypedTasks(toRef(() => props.company.last_survey?.tasks));

const updatedAt = computed(() => {
    if (props.company.last_survey.completed_at) {
        return toDateFormat(props.company.last_survey.completed_at);
    }

    return toDateFormat(props.company.last_survey.created_at);
});

const contactName = computed(() => {
    return getContactFullName(props.company.last_survey.contact);
});

const contactPosition = computed(() => {
    if (props.company.last_survey.contact.position_unknown) return 'Должность неизвестна';
    return contactOptions.position[props.company.last_survey.contact.position];
});

const callsPluralLabel = computed(() =>
    plural(
        props.company.last_survey.calls.length - 1,
        '+ %d контакт',
        '%d контакта',
        '%d контактов'
    )
);

const isCanceled = computed(() => props.company.last_survey.status === 'canceled');

const { currentUserId } = useAuth();

const surveyCommentCanBeEdit = computed(
    () => props.company.last_survey.user_id === currentUserId.value
);

// tabs

const TABS = {
    COMMENT: 'comment',
    TASKS: 'tasks'
};

const currentTab = ref(null);

function initCurrentTab() {
    if (isNotNullish(props.company.last_survey.comment)) {
        return (currentTab.value = TABS.COMMENT);
    }

    if (baseTasks.value.length) {
        return (currentTab.value = TABS.TASKS);
    }
}

onBeforeMount(initCurrentTab);

// expand

const isExpanded = ref(false);

// edit comment

const commentIsEditing = ref(false);

function editComment() {
    commentIsEditing.value = true;
    currentTab.value = TABS.COMMENT;
}

watch(currentTab, (_, oldValue) => {
    if (oldValue === TABS.COMMENT) commentIsEditing.value = false;
});

const isUpdating = ref(false);
const notify = useNotify();

async function updateComment(comment) {
    try {
        isUpdating.value = true;
        await api.survey.update(props.company.last_survey.id, {
            comment,
            contact_id: props.company.last_survey.contact_id
        });

        Object.assign(props.company.last_survey, { comment });
        commentIsEditing.value = false;

        notify.success('Комментарий успешно изменен');
    } finally {
        isUpdating.value = false;
    }
}

const { confirm } = useConfirm();

async function deleteComment() {
    const confirmed = await confirm(
        'Удалить комментарии',
        'Вы действительно хотите безвозвратно удалить комментарии?'
    );

    if (!confirmed) return;

    try {
        isUpdating.value = true;
        await api.survey.update(props.company.last_survey.id, { comment: null });

        Object.assign(props.company.last_survey, { comment: null });

        commentIsEditing.value = false;
        currentTab.value = null;

        notify.success('Комментарий успешно удален');
    } finally {
        isUpdating.value = false;
    }
}

// tasks

watch(
    () => baseTasks.value.length,
    (value, oldValue) => {
        if (oldValue === 0) currentTab.value = TABS.TASKS;
    }
);

const scheduledCallTasksIsVisible = ref(false);

function showScheduledCallTasks() {
    if (scheduledCallTasks.value.length > 1) {
        scheduledCallTasksIsVisible.value = true;
    } else {
        emit('show-task', scheduledCallTasks.value[0]);
    }
}

const scheduledVisitTasksIsVisible = ref(false);

function showScheduledVisitTasks() {
    if (scheduledVisitTasks.value.length > 1) {
        scheduledVisitTasksIsVisible.value = true;
    } else {
        emit('show-task', scheduledVisitTasks.value[0]);
    }
}
</script>
