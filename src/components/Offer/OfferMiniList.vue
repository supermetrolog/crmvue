<template>
    <Table v-if="miniOffers.length" class="offer-mini-list">
        <template #thead>
            <Tr>
                <Th>ID блока</Th>
                <Th>Этаж</Th>
                <Th>Площадь</Th>
                <Th>Высота</Th>
                <Th>Тип пола</Th>
                <Th>Ворота</Th>
                <Th>Температура</Th>
                <Th>Цена блока</Th>
                <Th>Реклама</Th>
            </Tr>
        </template>
        <template #tbody>
            <OfferMiniListItem
                v-for="offer in miniOffers"
                :key="offer.id"
                @toggle-avito="$emit('toggle-avito')"
                :offer="offer"
            />
        </template>
    </Table>
    <EmptyLabel v-else class="offer-mini-list-empty my-3">Объекты не найдены</EmptyLabel>
</template>

<script>
import Table from '@/components/common/Table/Table.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Th from '@/components/common/Table/Th.vue';
import OfferMiniListItem from '@/components/Offer/OfferMiniListItem.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';

export default {
    name: 'OfferMiniList',
    components: {
        EmptyLabel,
        OfferMiniListItem,
        Table,
        Tr,
        Th
    },
    emits: ['toggle-avito'],
    props: {
        miniOffers: {
            type: Array,
            default: () => []
        }
    }
};
</script>
