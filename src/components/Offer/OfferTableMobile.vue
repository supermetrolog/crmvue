<template>
    <div class="offer-table-view OffersMobileView">
        <Table>
            <template #thead>
                <Tr class="container">
                    <Th class="col-6" :sort="sortable ? 'area' : null">площадь</Th>
                    <Th class="col-6" :sort="sortable ? 'price' : null">цена</Th>
                </Tr>
            </template>
            <template #tbody>
                <Loader v-if="loader" class="center small"/>
                <OfferMobileItem
                    v-for="offer in offers"
                    :key="offer.id"
                    :offer="offer"
                />
            </template>
        </Table>
    </div>
</template>

<script>
import Table from "@/components/Table/Table.vue";
import Tr from "@/components/Table/Tr.vue";
import Th from "@/components/Table/Th.vue";
import Loader from "@/components/common/Loader.vue";
import OfferMobileItem from "@/components/Offer/OfferTableMobileItem.vue";

export default {
    name: "OfferTableMobile",
    components: {
        OfferMobileItem,
        Loader,
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

<style scoped>
</style>