<template>
    <Table fluid class="offer-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th></Th>
                <Th>регион</Th>
                <Th :sort="sortable ? 'from_mkad' : null">мкад</Th>
                <Th :sort="sortable ? 'area' : null">площадь</Th>
                <Th :sort="sortable ? 'price' : null">цена</Th>
                <Th>cобственник</Th>
                <Th>консультант</Th>
                <Th>реклама</Th>
                <Th :sort="sortable ? 'last_update' : null">обновление</Th>
                <Th :sort="sortable ? 'status' : null">статус</Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loader" class="center"/>
            <OfferTableItem
                v-for="(offer, idx) in offers"
                :key="offer.id"
                :offer="offer"
                :loader="loader"
                :odd="!(idx % 2)"
            />
        </template>
    </Table>
</template>

<script>
import Table from "@/components/Table/Table.vue";
import Tr from "@/components/Table/Tr.vue";
import Th from "@/components/Table/Th.vue";
import OfferTableItem from "@/components/Offer/OfferTableItem.vue";
import Loader from "@/components/common/Loader.vue";

export default {
    name: "OfferTable",
    components: {
        Loader,
        OfferTableItem,
        Table,
        Tr,
        Th
    },
    data() {
        return {};
    },
    props: {
        offers: {
            type: Array,
        },
        loader: {
            type: Boolean,
            default: false,
        },
        sortable: {
            type: Boolean,
            default: true,
        },
    },
};
</script>
