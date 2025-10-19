<template>
    <Table
        :refreshing
        shadow
        fluid
        resizable
        :default-widths="{
            id: 80
        }"
        :constraints
        storage-key="companies"
        class="company-table"
    >
        <template #thead>
            <Tr data-tour-id="company-table-filters:header">
                <Th
                    v-model:filters="consultantFilters"
                    @confirm-filter="confirmConsultantFilters"
                    name="id"
                >
                    <template #filter>
                        <CompanyTableFiltersConsultant v-model="consultantFilters" />
                    </template>
                </Th>
                <Th class="text-left" sort="nameRu" name="name">название компании</Th>
                <Th
                    ref="statusThEl"
                    v-model:filters="activityFilters"
                    @confirm-filter="confirmActivityFilters"
                    :sorting-options
                    data-tour-id="company-table-filters:column-activity"
                    class="text-left"
                    name="status"
                >
                    <template #default>работа с компанией</template>
                    <template #filter>
                        <CompanyTableFiltersActivity v-model="activityFilters" />
                    </template>
                </Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loader && companies.length" />
            <template v-else-if="loader">
                <CompanyTableItemSkeleton v-for="item in 5" :key="item" />
            </template>
            <CompanyTableItem
                v-for="(company, idx) in companies"
                :key="company.id"
                @deleted-from-folder="$emit('deleted-from-folder', company.id, $event)"
                @schedule-call="$emit('schedule-call', company)"
                @create-task="$emit('create-task', company)"
                @show-tasks="$emit('show-tasks', company)"
                @disable="$emit('disable-company', company)"
                @enable="$emit('enable-company', company)"
                @create-request-task="$emit('create-request-task', $event, company)"
                @show-survey="showSurvey({ surveyId: company.last_survey.id })"
                @show-task="showTaskPreview"
                @schedule-visit="$emit('schedule-visit', company)"
                @schedule-event="$emit('schedule-event', company)"
                @show-company-comments="$emit('show-company-comments', company)"
                @show-company-notes="$emit('show-company-notes', company)"
                :company="company"
                :odd="!(idx % 2)"
            />
            <Tr v-if="!loader && !companies.length">
                <Td colspan="6" class="p-0">
                    <EmptyData no-rounded>Ничего не найдено...</EmptyData>
                </Td>
            </Tr>
            <TaskPreview
                v-model:visible="taskPreviewIsVisible"
                @closed="currentTask = null"
                @updated="onUpdatedTask"
                :task-id="currentTask?.id"
            />
        </template>
    </Table>
</template>

<script setup>
import CompanyTableItem from '@/components/Company/Table/CompanyTableItem.vue';
import Table from '@/components/common/Table/Table.vue';
import Th from '@/components/common/Table/Th.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Loader from '@/components/common/Loader.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import EmptyData from '@/components/common/EmptyData.vue';
import Td from '@/components/common/Table/Td.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import TaskPreview from '@/components/TaskPreview/TaskPreview.vue';
import { useTableColumnFilters } from '@/composables/useTableColumnFilters';
import CompanyTableFiltersActivity from '@/components/Company/Table/Filters/CompanyTableFiltersActivity.vue';
import CompanyTableFiltersConsultant from '@/components/Company/Table/Filters/CompanyTableFiltersConsultant.vue';
import CompanyTableItemSkeleton from '@/components/Company/Table/CompanyTableItemSkeleton.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { toArray } from '@/utils/helpers/array/toArray';
import { useTour } from '@/composables/useTour/useTour';

defineEmits([
    'deleted-from-folder',
    'create-task',
    'create-request-task',
    'show-tasks',
    'open-filter',
    'disable-company',
    'enable-company',
    'schedule-call',
    'schedule-visit',
    'schedule-event',
    'show-company-comments',
    'show-company-notes'
]);

defineProps({
    companies: {
        type: Array,
        default: () => []
    },
    loader: Boolean,
    refreshing: Boolean
});

const constraints = {
    id: {
        min: 40,
        max: 160
    },
    name: {
        min: 300
    },
    status: {
        min: 300
    }
};

// query filters

const { filters: consultantFilters, confirmFilters: confirmConsultantFilters } =
    useTableColumnFilters({
        consultant_id: null
    });

const { filters: activityFilters, confirmFilters: confirmActivityFilters } = useTableColumnFilters(
    {
        without_surveys: null,
        with_current_user_tasks: null,
        requests_filter: null,
        with_active_contacts: null,
        dateStart: null,
        dateEnd: null,
        statuses: []
    },
    {
        transform: {
            dateStart: value => dayjs(value).toJSON(),
            dateEnd: value => dayjs(value).toJSON()
        },
        prepare: {
            dateStart: value => dayjs(value).toDate(),
            dateEnd: value => dayjs(value).toDate(),
            statuses: value => (isNotNullish(value) ? toArray(value) : value)
        }
    }
);

const route = useRoute();

function initFilters() {
    consultantFilters.consultant_id = route.query.consultant_id;

    activityFilters.dateStart = route.query.dateStart
        ? dayjs(route.query.dateStart).toDate()
        : null;
    activityFilters.dateEnd = route.query.dateEnd ? dayjs(route.query.dateEnd).toDate() : null;
    activityFilters.statuses = isNotNullish(route.query.statuses)
        ? toArray(route.query.statuses)
        : [];

    activityFilters.without_surveys = route.query.without_surveys;
    activityFilters.with_current_user_tasks = route.query.with_current_user_tasks;
    activityFilters.with_active_contacts = route.query.with_active_contacts;
    activityFilters.requests_filter = route.query.requests_filter;
}

onMounted(initFilters);

// sort

const sortingOptions = [
    { value: 'activity', label: 'По актуальности', icon: 'fa-solid fa-fire', onlyAsc: true },
    {
        value: 'relevant_tasks',
        label: 'По выполнению задач',
        icon: 'fa-solid fa-bolt',
        asc: 'Сначала актуальные',
        desc: 'Сначала неактуальные'
    },
    { value: 'updated_at', label: 'По дате модерации', icon: 'fa-solid fa-pen' },
    { value: 'created_at', label: 'По дате внесения', icon: 'fa-solid fa-calendar-plus' },
    {
        value: 'last_survey_created_at',
        label: 'По дате последнего опроса',
        icon: 'fa-solid fa-square-poll-horizontal'
    },
    {
        value: 'last_message_created_at',
        label: 'По дате последнего сообщения',
        icon: 'fa-solid fa-comment'
    },
    {
        value: 'last_request_created_at',
        label: 'По дате последнего запроса',
        icon: 'fa-solid fa-user-clock'
    },
    {
        value: 'last_offer_updated_at',
        label: 'По дате внесения предложения',
        icon: 'fa-solid fa-industry'
    },
    {
        value: 'last_object_created_at',
        label: 'По дате внесения строения',
        icon: 'fa-solid fa-warehouse'
    }
];

// show survey

const { show: showSurvey } = useAsyncPopup('surveyPreview');

// tasks

const currentTask = ref(null);
const taskPreviewIsVisible = ref(false);

function showTaskPreview(task) {
    currentTask.value = task;
    taskPreviewIsVisible.value = true;
}

function onUpdatedTask(payload) {
    Object.assign(currentTask.value, payload);
    currentTask.value = null;
}

useTour('company-resize', {
    autorun: true,
    steps: [
        {
            key: 0,
            element: '[data-tour-id="company-table-filters:header"]',
            popover: {
                title: 'Изменение ширины колонок',
                description:
                    'Теперь ширину колонок можно изменять! Для этого наведите мышкой на край нужной колонки и потяните его..'
            }
        },
        {
            key: 1,
            popover: {
                title: 'Сохранение настроек',
                description: 'Настройки ширины сохраняются на вашем компьютере автоматически'
            }
        }
    ]
});
</script>
