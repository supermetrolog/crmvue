<template>
    <div class="request-table">
        <Table>
            <template #thead>
                <Tr>
                    <Th>#</Th>
                    <Th sort="dealType">тип сделки</Th>
                    <Th>площадь</Th>
                    <Th sort="pricePerFloor">цена</Th>
                    <Th>регион</Th>
                    <Th>компания</Th>
                    <Th>консультант</Th>
                    <Th sort="updated_at">дата обновления</Th>
                    <Th sort="status">статус</Th>
                </Tr>
            </template>
            <template #tbody>
                <Loader v-if="loader" />
                <CompanyRequestTableItem
                    v-for="request in requests"
                    :key="request.id"
                    :request="request"
                />
            </template>
        </Table>
    </div>
</template>

<script setup>
import Th from '@/components/common/Table/Th.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Table from '@/components/common/Table/Table.vue';
import Loader from '@/components/common/Loader.vue';
import CompanyRequestTableItem from '@/components/Company/Request/CompanyRequestTableItem.vue';

defineProps({
    requests: {
        type: Array,
        default: () => []
    },
    loader: {
        type: Boolean,
        default: false
    }
});
</script>
