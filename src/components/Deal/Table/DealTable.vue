<template>
    <Table shadow fluid class="company-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th>Запрос</Th>
                <Th>Клиент</Th>
                <Th>Предложение</Th>
                <Th>Площадь</Th>
                <Th>Цена пола</Th>
                <Th>Срок</Th>
                <Th>Консультант</Th>
                <Th>Дата</Th>
            </Tr>
        </template>
        <template #tbody>
            <template v-if="deals.length">
                <Loader v-if="loader" />
                <DealTableItem
                    v-for="(deal, idx) in deals"
                    :key="deal.id"
                    @edit="$emit('edit', deal)"
                    @delete="$emit('delete', deal)"
                    :deal="deal"
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
import DealTableItem from '@/components/Deal/Table/DealTableItem.vue';

defineEmits(['edit', 'delete']);

defineProps({
    deals: {
        type: Array,
        default: () => []
    },
    loader: Boolean
});
</script>
