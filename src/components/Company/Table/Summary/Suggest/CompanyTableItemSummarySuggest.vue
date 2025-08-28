<template>
    <div class="company-table-item-summary__suggest">
        <CompanyTableItemSummarySuggestSurvey
            v-if="isActive"
            @open-survey="$emit('open-survey')"
            :company
        />
        <CompanyTableItemSummarySuggestContacts v-if="isWithoutActiveContacts" />
        <template v-if="targetTask">
            <CompanyTableItemSummarySuggestCall
                v-if="targetTaskIsCall"
                @show-task="$emit('show-task', targetTask)"
                :task="targetTask"
            />
            <CompanyTableItemSummarySuggestVisit
                v-else-if="targetTaskIsVisit"
                @show-task="$emit('show-task', targetTask)"
                :task="targetTask"
            />
            <CompanyTableItemSummarySuggestTask
                v-else
                @show-task="$emit('show-task', targetTask)"
                :task="targetTask"
            />
        </template>
    </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth.js';
import { computed } from 'vue';
import { dayjsFromServer, nowInServer } from '@/utils/formatters/date.ts';
import CompanyTableItemSummarySuggestTask from '@/components/Company/Table/Summary/Suggest/CompanyTableItemSummarySuggestTask.vue';
import CompanyTableItemSummarySuggestCall from '@/components/Company/Table/Summary/Suggest/CompanyTableItemSummarySuggestCall.vue';
import { TaskTypeEnum } from '@/types/task.ts';
import CompanyTableItemSummarySuggestVisit from '@/components/Company/Table/Summary/Suggest/CompanyTableItemSummarySuggestVisit.vue';
import CompanyTableItemSummarySuggestSurvey from '@/components/Company/Table/Summary/Suggest/CompanyTableItemSummarySuggestSurvey.vue';
import { CompanyStatusEnum } from '@/types/company';
import CompanyTableItemSummarySuggestContacts from '@/components/Company/Table/Summary/Suggest/CompanyTableItemSummarySuggestContacts.vue';

defineEmits(['show-task', 'open-survey']);

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const { currentUserId } = useAuth();

// tasks

const tasks = computed(() => props.company.tasks);

const currentUserTasks = computed(() => {
    return tasks.value.filter(task => task.user_id === currentUserId.value);
});

const todayTask = computed(() => {
    const today = nowInServer();

    return currentUserTasks.value.find(task => dayjsFromServer(task.start).isSame(today, 'day'));
});

const targetTask = computed(() => {
    if (todayTask.value) {
        return todayTask.value;
    }

    if (currentUserTasks.value.length) {
        return currentUserTasks.value.reduce((prev, task) => {
            if (dayjsFromServer(prev.start).isBefore(dayjsFromServer(task.start))) return prev;
            return task;
        }, currentUserTasks.value[0]);
    }

    return null;
});

const targetTaskIsCall = computed(() => targetTask.value?.type === TaskTypeEnum.SCHEDULED_CALL);
const targetTaskIsVisit = computed(() => targetTask.value?.type === TaskTypeEnum.SCHEDULED_VISIT);

const isActive = computed(() => props.company.status === CompanyStatusEnum.ACTIVE);

const isWithoutActiveContacts = computed(() => props.company.active_contacts_count === 0);
</script>
