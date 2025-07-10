<template>
    <Table shadow fluid class="company-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th class="text-left">название компании</Th>
                <Th>работа с компанией</Th>
                <Th v-model:filters="consultantFilters" @confirm-filter="confirmConsultantFilters">
                    <template #default>консультант</template>
                    <template #filter>
                        <CompanyTableFiltersConsultant v-model="consultantFilters" />
                    </template>
                </Th>
                <Th
                    ref="statusThEl"
                    v-model:filters="dateFilters"
                    @confirm-filter="confirmDateFilters"
                    :sorting-options
                    name="status"
                    data-tour-id="company-table-filters:column-status"
                >
                    <template #default>статус</template>
                    <template #filter>
                        <CompanyTableFiltersStatus v-model="dateFilters" />
                    </template>
                </Th>
            </Tr>
        </template>
        <template #tbody>
            <template v-if="companies.length">
                <Loader v-if="loader" />
                <FormUtilityTransferCompaniesTableItem
                    v-for="(company, idx) in companies"
                    :key="company.id"
                    @toggle-checked="$emit('toggle-checked', company)"
                    :checked="checkedCompanies.has(company.id)"
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
import Table from '@/components/common/Table/Table.vue';
import Th from '@/components/common/Table/Th.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Loader from '@/components/common/Loader.vue';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import Td from '@/components/common/Table/Td.vue';
import FormUtilityTransferCompaniesTableItem from '@/components/Forms/Utility/FormUtilityTransferCompaniesTableItem.vue';
import CompanyTableFiltersStatus from '@/components/Company/Table/Filters/CompanyTableFiltersStatus.vue';
import CompanyTableFiltersConsultant from '@/components/Company/Table/Filters/CompanyTableFiltersConsultant.vue';
import { useTableColumnFilters } from '@/composables/useTableColumnFilters';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

defineEmits(['toggle-checked']);

defineProps({
    companies: {
        type: Array,
        default: () => []
    },
    checkedCompanies: {
        type: Set,
        required: true
    },
    loader: Boolean
});

const { filters: dateFilters, confirmFilters: confirmDateFilters } = useTableColumnFilters(
    {
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

const { filters: consultantFilters, confirmFilters: confirmConsultantFilters } =
    useTableColumnFilters({
        consultant_id: null
    });

const route = useRoute();

function initFilters() {
    dateFilters.dateStart = route.query.dateStart ? dayjs(route.query.dateStart).toDate() : null;
    dateFilters.dateEnd = route.query.dateEnd ? dayjs(route.query.dateEnd).toDate() : null;
    dateFilters.status = route.query.status;

    consultantFilters.consultant_id = route.query.consultant_id;
}

onMounted(initFilters);

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
</script>
