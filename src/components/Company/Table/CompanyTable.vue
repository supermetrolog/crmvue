<template>
    <Table shadow fluid class="company-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th class="text-left" sort="nameRu">название компании</Th>
                <Th>работа с компанией</Th>
                <Th v-model:filters="consultantFilters" @confirm-filter="confirmConsultantFilters">
                    <template #default>консультант</template>
                    <template #filter>
                        <div class="row">
                            <Spinner v-if="consultantsIsLoading" small />
                            <ConsultantPicker
                                v-else
                                v-model="consultantFilters.consultant_id"
                                :options="getConsultantsOptions"
                                class="col-12"
                                :append-to-body="false"
                            />
                        </div>
                    </template>
                </Th>
                <Th
                    v-model:filters="dateFilters"
                    @confirm-filter="confirmDateFilters"
                    :sorting-options
                >
                    <template #default>статус</template>
                    <template #filter>
                        <div class="row">
                            <UiDateInput
                                v-model="dateFilters.dateStart"
                                placeholder="Дата внесения"
                                label="Внесено после"
                                :max-date="new Date()"
                                class="col-6"
                            />
                            <UiDateInput
                                v-model="dateFilters.dateEnd"
                                placeholder="Дата внесения"
                                label="Внесено до"
                                class="col-6"
                                :min-date="dateFilters.dateStart"
                            />
                        </div>
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
                    @show-message="$emit('show-message', $event)"
                    @create-pinned-message="$emit('create-pinned-message', company)"
                    @unpin-message="$emit('unpin-message', $event, company.id)"
                    @deleted-from-folder="$emit('deleted-from-folder', company.id, $event)"
                    @create-task="$emit('create-task', company)"
                    @show-tasks="$emit('show-tasks', company)"
                    @show-created-tasks="$emit('show-created-tasks', company)"
                    @disable="$emit('disable-company', company)"
                    @enable="$emit('enable-company', company)"
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
        </template>
    </Table>
</template>

<script setup>
import CompanyTableItem from '@/components/Company/Table/CompanyTableItem.vue';
import Table from '@/components/common/Table/Table.vue';
import Th from '@/components/common/Table/Th.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Loader from '@/components/common/Loader.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import { onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import Td from '@/components/common/Table/Td.vue';

defineEmits([
    'deleted-from-folder',
    'create-pinned-message',
    'show-message',
    'unpin-message',
    'create-task',
    'show-tasks',
    'open-filter',
    'disable-company',
    'enable-company'
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

const { getConsultantsOptions, isFetching: consultantsIsLoading } = useConsultantsOptions();

const dateFilters = reactive({
    dateStart: null,
    dateEnd: null
});

const consultantFilters = reactive({
    consultant_id: null
});

function initFilters() {
    dateFilters.dateStart = route.query.dateStart ? dayjs(route.query.dateStart).toDate() : null;
    dateFilters.dateEnd = route.query.dateEnd ? dayjs(route.query.dateEnd).toDate() : null;

    consultantFilters.consultant_id = route.query.consultant_id;
}

onMounted(initFilters);

const router = useRouter();
const route = useRoute();

function confirmDateFilters() {
    const query = { ...route.query };

    if (dateFilters.dateStart) {
        query.dateStart = dayjs(dateFilters.dateStart).toJSON();
    } else {
        delete query.dateStart;
    }

    if (dateFilters.dateEnd) {
        query.dateEnd = dayjs(dateFilters.dateEnd).toJSON();
    } else {
        delete query.dateEnd;
    }

    router.replace({ query });
}

function confirmConsultantFilters() {
    const query = { ...route.query };

    query.consultant_id = consultantFilters.consultant_id;

    router.replace({ query });
}

// date

watch(
    () => route.query.dateStart,
    value => {
        dateFilters.dateStart = value ? dayjs(value).toDate() : null;
    }
);

watch(
    () => route.query.dateEnd,
    value => {
        dateFilters.dateEnd = value ? dayjs(value).toDate() : null;
    }
);

watch(
    () => route.query.consultant_id,
    value => {
        consultantFilters.consultant_id = value;
    }
);

// sort

const sortingOptions = [
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
    { value: 'last_task_created_at', label: 'По дате последней задачи', icon: 'fa-solid fa-bolt' },
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
</script>
