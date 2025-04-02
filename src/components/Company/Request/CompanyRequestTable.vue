<template>
    <div class="request-table">
        <Table shadow>
            <template #thead>
                <Tr>
                    <Th>#</Th>
                    <Th sort="dealType">тип сделки</Th>
                    <Th>площадь</Th>
                    <Th sort="pricePerFloor">цена</Th>
                    <Th>регион</Th>
                    <Th>компания</Th>
                    <Th>консультант</Th>
                    <Th sort="updated_at">обновление</Th>
                </Tr>
            </template>
            <template #tbody>
                <template v-if="requests.length">
                    <Loader v-if="loader" />
                    <CompanyRequestTableItem
                        v-for="request in requests"
                        :key="request.id"
                        @to-chat="$emit('to-chat', request)"
                        @view="$emit('view', request)"
                        :request="request"
                    />
                </template>
                <template v-else-if="loader">
                    <CompanyRequestTableItemSkeleton v-for="i in 10" :key="i" />
                </template>
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
import CompanyRequestTableItemSkeleton from '@/components/Company/Request/CompanyRequestTableItemSkeleton.vue';

defineEmits(['to-chat', 'view', 'toggle-disable', 'edit']);
defineProps({
    requests: {
        type: Array,
        default: () => []
    },
    loader: Boolean
});
</script>
