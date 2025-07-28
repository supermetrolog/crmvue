<template>
    <Table shadow fluid class="company-table">
        <template #thead>
            <Tr data-tour-id="company-table-filters:header">
                <Th v-model:filters="consultantFilters" @confirm-filter="confirmConsultantFilters">
                    <template #filter>
                        <CompanyTableFiltersConsultant v-model="consultantFilters" />
                    </template>
                </Th>
                <Th class="text-left" sort="nameRu">название компании</Th>
                <Th
                    ref="statusThEl"
                    v-model:filters="activityFilters"
                    @confirm-filter="confirmActivityFilters"
                    :sorting-options
                    default-sort="activity"
                    name="status"
                    data-tour-id="company-table-filters:column-activity"
                    class="text-left"
                >
                    <template #default>работа с компанией</template>
                    <template #filter>
                        <CompanyTableFiltersActivity v-model="activityFilters" />
                    </template>
                </Th>
            </Tr>
        </template>
        <template #tbody>
            <template v-if="companies.length">
                <Loader v-if="loader" />
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
            </template>
            <Tr v-else>
                <Td colspan="6" class="p-0">
                    <Spinner v-if="loader" class="my-4" />
                    <EmptyData v-else no-rounded>Ничего не найдено...</EmptyData>
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
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import Td from '@/components/common/Table/Td.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import TaskPreview from '@/components/TaskPreview/TaskPreview.vue';
import { useTableColumnFilters } from '@/composables/useTableColumnFilters';
import CompanyTableFiltersActivity from '@/components/Company/Table/Filters/CompanyTableFiltersActivity.vue';
import CompanyTableFiltersConsultant from '@/components/Company/Table/Filters/CompanyTableFiltersConsultant.vue';

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
    loader: {
        type: Boolean,
        default: false
    }
});

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
        status: null
    },
    {
        transform: {
            dateStart: value => dayjs(value).toJSON(),
            dateEnd: value => dayjs(value).toJSON()
        },
        prepare: {
            dateStart: value => dayjs(value).toDate(),
            dateEnd: value => dayjs(value).toDate()
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
    activityFilters.status = route.query.status;

    activityFilters.without_surveys = route.query.without_surveys;
    activityFilters.with_current_user_tasks = route.query.with_current_user_tasks;
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

// // tour
//
// const statusThEl = useTemplateRef('statusThEl');
//
// const createTourStepElement = createTourStepElementGenerator('company-table-filters');
//
// useTour('company-table-filters', {
//     force: true,
//     steps: [
//         {
//             key: 1,
//             element: createTourStepElement('header'),
//             popover: {
//                 title: 'Новые возможности в таблице',
//                 description:
//                     'Сортируйте и фильтруйте компании прямо из таблицы с помощью быстрых фильтров.',
//                 side: 'top',
//                 align: 'center'
//             }
//         },
//         {
//             key: 2,
//             element: createTourStepElement('column-status', '.th__filter'),
//             popover: {
//                 title: 'Сортировка компаний',
//                 description:
//                     'Для выбора сортировки просто нажмите на значок сортировки в заголовке столбца.',
//                 side: 'left',
//                 align: 'center',
//                 onNextClick(element, step, { driver }) {
//                     element?.click();
//
//                     useTimeoutFn(() => driver.moveNext(), 100);
//                 }
//             }
//         },
//         {
//             key: 3,
//             element: '.th-dd-content__sort[data-tr-name="status"] .th-dd-content__sort-select',
//             popover: {
//                 title: 'Возможности сортировки',
//                 description: 'Вы можете выбрать сортировку по актуальности, дате внесения и т.д.',
//                 side: 'left',
//                 align: 'center'
//             }
//         },
//         {
//             key: 4,
//             element: '.th-dd-content__sort[data-tr-name="status"] .th-dd-content__sort-order',
//             popover: {
//                 title: 'Порядок сортировки',
//                 description:
//                     'Для изменения порядка сортировки просто выберите один из вариантов. Например, показывать сначала добавленные давно или сначала добавленные недавно',
//                 side: 'left',
//                 align: 'center',
//                 onNextClick(element, step, { driver }) {
//                     statusThEl.value?.closeFilters();
//
//                     driver.moveNext();
//                 }
//             }
//         },
//         {
//             key: 5,
//             element: createTourStepElement('column-activity', '.th__filter'),
//             popover: {
//                 title: 'Фильтры для удобной работы',
//                 description:
//                     'Теперь есть возможность просмотреть только те компании, с которыми необходимо работать прямо сейчас. Например, просмотреть только компании с активными задачами, или только компании без опросов.',
//                 side: 'top',
//                 align: 'center'
//             },
//             onHighlighted(element) {
//                 element?.click();
//             }
//         }
//     ]
// });
</script>
