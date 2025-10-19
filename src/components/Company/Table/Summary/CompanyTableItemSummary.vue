<template>
    <div class="company-table-item-summary">
        <Loader v-if="isUpdating" />
        <div class="company-table-item-summary__content">
            <div class="company-table-item-summary__header mb-1">
                <CompanyTableItemSummaryTabSurvey
                    v-model="currentTab"
                    @to-survey="$emit('open-survey')"
                    :company
                    :name="TABS.SURVEY"
                />
                <CompanyTableItemSummaryTabTasks
                    v-model="currentTab"
                    :tasks="baseTasks"
                    :name="TABS.TASKS"
                />
                <UiButton
                    v-if="scheduledCallTasks.length"
                    @click="showScheduledCallTasks"
                    class="fs-2 company-table-item-summary-survey__tab"
                    color="white"
                    small
                    :class="{
                        danger: lastScheduledCallDateExpired,
                        primary: !lastScheduledCallDateExpired,
                        'op-5': !hasCurrentUserScheduledCall
                    }"
                >
                    <span>Звонок {{ nearestScheduledCallDate }}</span>
                    <span v-if="scheduledCallTasks.length > 1" class="ml-1">
                        (+ еще {{ scheduledCallTasks.length - 1 }})
                    </span>
                </UiButton>
                <UiButton
                    v-if="scheduledVisitTasks.length"
                    @click="showScheduledVisitTasks"
                    class="fs-2 company-table-item-summary-survey__tab"
                    color="white"
                    small
                    :class="{
                        danger: lastScheduledVisitDateExpired,
                        primary: !lastScheduledVisitDateExpired,
                        'op-5': !hasCurrentUserScheduledVisit
                    }"
                >
                    <span>Встреча {{ nearestScheduledVisitDate }}</span>
                    <span v-if="scheduledVisitTasks.length > 1" class="ml-1">
                        (+ еще {{ scheduledVisitTasks.length - 1 }})
                    </span>
                </UiButton>
            </div>
            <CompanyTableItemSummarySurvey
                v-if="currentTab === TABS.SURVEY"
                @edit-comment="$emit('edit-survey-comment')"
                @open-preview="$emit('show-survey')"
                @show-comments="$emit('show-comments')"
                @show-notes="$emit('show-notes')"
                @create-note="createCompanyNote"
                @update-note="updateCompanyNote"
                @delete-note="deleteCompanyNote"
                @unpin-message="unpinCompanyMessage"
                :company
            />
            <CompanyTableItemSummaryTasks
                v-if="currentTab === TABS.TASKS"
                @show-task="$emit('show-task', $event)"
                :tasks="baseTasks"
            />
            <CompanyTableItemSummarySuggest
                v-if="!isDeleted"
                @show-task="$emit('show-task', $event)"
                @open-survey="$emit('open-survey')"
                :company
                class="mt-2"
            />
        </div>
        <CompanyTableItemActions
            @create-task="$emit('create-task')"
            @schedule-call="$emit('schedule-call')"
            @schedule-visit="$emit('schedule-visit')"
            @schedule-event="$emit('schedule-event')"
            @disable="$emit('disable')"
            @enable="$emit('enable')"
            @open-chat="$emit('open-chat')"
            @deleted-from-folder="$emit('deleted-from-folder', $event)"
            :company
            class="mt-2"
        />
        <UiModal
            v-model:visible="scheduledCallTasksIsVisible"
            :title="`Запланированные звонки (${scheduledCallTasks.length})`"
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
            :title="`Запланированные встречи (${scheduledVisitTasks.length})`"
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
import CompanyTableItemActions from '@/components/Company/Table/CompanyTableItemActions.vue';
import CompanyTableItemSummaryTabSurvey from '@/components/Company/Table/Summary/CompanyTableItemSummaryTabSurvey.vue';
import { computed, ref, toRef } from 'vue';
import { useTypedTasks } from '@/composables/task/useTypedTasks';
import CompanyTableItemSummaryTabTasks from '@/components/Company/Table/Summary/CompanyTableItemSummaryTabTasks.vue';
import CompanyTableItemSummaryTasks from '@/components/Company/Table/Summary/CompanyTableItemSummaryTasks.vue';
import CompanyTableItemSummarySurvey from '@/components/Company/Table/Summary/CompanyTableItemSummarySurvey.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { dayjsFromServer } from '@/utils/formatters/date.ts';
import { now } from '@vueuse/core';
import { useAuth } from '@/composables/useAuth';
import CompanyTableItemSummarySuggest from '@/components/Company/Table/Summary/Suggest/CompanyTableItemSummarySuggest.vue';
import api from '@/api/api.js';
import { captureException } from '@sentry/vue';
import { useNotify } from '@/utils/use/useNotify.js';
import Loader from '@/components/common/Loader.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { CompanyStatusEnum } from '@/types/company';

const emit = defineEmits([
    'deleted-from-folder',
    'create-task',
    'show-created-tasks',
    'disable',
    'enable',
    'show-survey',
    'show-task',
    'edit-survey-comment',
    'schedule-call',
    'schedule-visit',
    'schedule-event',
    'open-chat',
    'open-survey',
    'show-notes',
    'show-comments'
]);

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const isDeleted = computed(() => props.company.status === CompanyStatusEnum.DELETED);

const TABS = {
    SURVEY: 'survey',
    TASKS: 'tasks'
};

const currentTab = ref(TABS.SURVEY);

const {
    scheduledCallTasks,
    scheduledVisitTasks,
    nearestScheduledCall,
    nearestScheduledCallDate,
    nearestScheduledVisit,
    nearestScheduledVisitDate,
    baseTasks
} = useTypedTasks(toRef(() => props.company.tasks ?? []));

const lastScheduledCallDateExpired = computed(
    () =>
        nearestScheduledCall.value &&
        dayjsFromServer(nearestScheduledCall.value.start).isBefore(now(), 'day')
);

const lastScheduledVisitDateExpired = computed(
    () =>
        nearestScheduledVisit.value &&
        dayjsFromServer(nearestScheduledVisit.value.start).isBefore(now(), 'day')
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

const { currentUserId } = useAuth();

const hasCurrentUserScheduledCall = computed(() => {
    return nearestScheduledCall.value && nearestScheduledCall.value.user_id === currentUserId.value;
});

const hasCurrentUserScheduledVisit = computed(() => {
    return (
        nearestScheduledVisit.value && nearestScheduledVisit.value.user_id === currentUserId.value
    );
});

// notes

const isUpdating = ref(false);
const notify = useNotify();

async function createCompanyNote(payload) {
    isUpdating.value = true;

    try {
        const note = await api.companies.createNote(props.company.id, payload);

        Object.assign(props.company, { note, notes_count: props.company.notes_count + 1 });

        notify.success('Заметка успешно добавлена');
    } catch (e) {
        captureException(e);
    } finally {
        isUpdating.value = false;
    }
}

async function updateCompanyNote(payload) {
    isUpdating.value = true;

    try {
        await api.messenger.updateMessage({ id: props.company.note.message.id, ...payload });

        notify.success('Заметка успешно изменена');
    } catch (e) {
        captureException(e);
    } finally {
        isUpdating.value = false;
    }
}

const { confirm } = useConfirm();

async function deleteCompanyNote() {
    const confirmed = await confirm(
        'Удалить заметку',
        'Вы действительно хотите безвозвратно удалить заметку?'
    );

    if (!confirmed) return;

    try {
        isUpdating.value = true;

        await api.entityMessageLink.delete(props.company.note.id);

        Object.assign(props.company, { note: null, notes_count: props.company.notes_count - 1 });

        notify.success('Заметка успешно удалена');
    } finally {
        isUpdating.value = false;
    }
}

async function unpinCompanyMessage() {
    const confirmed = await confirm(
        'Открепить сообщение',
        'Вы действительно хотите открепить сообщение от компании?'
    );

    if (!confirmed) return;

    try {
        isUpdating.value = true;

        await api.entityMessageLink.delete(props.company.pinned_message.id);

        Object.assign(props.company, { pinned_message: null });

        notify.success('Сообщение успешно откреплено');
    } finally {
        isUpdating.value = false;
    }
}
</script>
