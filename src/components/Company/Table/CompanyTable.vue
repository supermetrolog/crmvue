<template>
    <div class="company-table-view">
        <Table>
            <template #thead>
                <Tr>
                    <Th class="company-table-view-sharp">#</Th>
                    <Th class="text-left company-table-view-name" sort="nameRu">название компании </Th>
                    <Th class="company-table-view-category">категория</Th>
                    <Th class="company-table-view-contact">контакт</Th>
                    <Th class="company-table-view-qa">опросник</Th>
                    <Th class="company-table-view-consultant">консультант</Th>
                    <Th class="company-table-view-tasks">Задачи бд</Th>
                    <Th class="company-table-view-date" sort="created_at">Дата</Th>
                </Tr>
            </template>
            <template #tbody>
                <Loader v-if="loader" class="center" />
                <CompanyTableItem
                    v-for="(company, idx) in companies"
                    :key="company.id"
                    :company="company"
                    :odd="!(idx % 2)"
                ></CompanyTableItem>
            </template>
        </Table>
    </div>
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