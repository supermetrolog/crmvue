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
            <Loader v-if="loader && offers.length" />
            <template v-else-if="loader">
                <OfferTableItemSkeleton v-for="item in 5" :key="item" />
            </template>
            <OfferTableItem
                v-for="offer in offers"
                :key="offer.id"
                @favorite-deleted="$emit('favorite-deleted')"
                @deleted-from-folder="$emit('deleted-from-folder', offer.id, $event)"
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
import OfferTableItemSkeleton from '@/components/Offer/TableItem/OfferTableItemSkeleton.vue';

defineEmits(['favorite-deleted', 'deleted-from-folder']);
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
