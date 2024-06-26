<template>
    <Table fluid class="company-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th class="text-left" sort="nameRu">название компании</Th>
                <Th>категория</Th>
                <Th>контакт</Th>
                <Th>опросник</Th>
                <Th>консультант</Th>
                <Th>Задачи бд</Th>
                <Th sort="created_at">Дата</Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loader" />
            <CompanyTableItem
                v-for="(company, idx) in companies"
                :key="company.id"
                :company="company"
                :odd="!(idx % 2)"
            ></CompanyTableItem>
        </template>
    </Table>
</template>

<script>
import CompanyTableItem from '@/components/Company/Table/CompanyTableItem.vue';
import { MixinCompanyView } from '@/components/Company/mixins.js';
import Table from '@/components/common/Table/Table.vue';
import Th from '@/components/common/Table/Th.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Loader from '@/components/common/Loader.vue';

export default {
    name: 'CompanyTable',
    components: {
        Loader,
        Table,
        Tr,
        Th,
        CompanyTableItem
    },
    mixins: [MixinCompanyView]
};
</script>
