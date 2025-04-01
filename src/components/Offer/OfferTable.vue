<template>
    <Table fluid shadow class="offer-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th>Объект</Th>
                <Th>регион</Th>
                <Th :sort="sortable ? 'from_mkad' : null">мкад</Th>
                <Th :sort="sortable ? 'area' : null">площадь</Th>
                <Th :sort="sortable ? 'price' : null">цена</Th>
                <Th>cобственник</Th>
                <Th>консультант</Th>
                <Th>реклама</Th>
                <Th :sort="sortable ? 'last_update' : null">обновление</Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loader" />
            <OfferTableItem
                v-for="offer in offers"
                :key="offer.id"
                @favorite-deleted="$emit('favorite-deleted')"
                :offer="offer"
                :loader="loader"
            />
        </template>
    </Table>
</template>

<script setup>
import Table from '@/components/common/Table/Table.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Th from '@/components/common/Table/Th.vue';
import OfferTableItem from '@/components/Offer/TableItem/OfferTableItem.vue';
import Loader from '@/components/common/Loader.vue';

defineEmits(['favorite-deleted']);
defineProps({
    offers: {
        type: Array
    },
    loader: {
        type: Boolean,
        default: false
    },
    sortable: {
        type: Boolean,
        default: true
    }
});
</script>
