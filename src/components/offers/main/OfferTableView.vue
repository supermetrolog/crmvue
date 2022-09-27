<template>
  <div class="offer-table-view">
    <Table>
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
        <Loader v-if="loader" class="center" />
        <OfferTableItem
          v-for="(offer, idx) in offers"
          :key="offer.id"
          :offer="offer"
          :loader="loader"
          :odd="!(idx % 2)"
          :class="{
            odd_table_row: !(idx % 2),
            even_table_row: !!(idx % 2),
          }"
        />
      </template>
    </Table>
  </div>
</template>

<script>
import OfferTableItem from "../offer-item/OfferTableItem.vue";
import Table from "@/components/common/table/Table";
import Tr from "@/components/common/table/Tr";
import Th from "@/components/common/table/Th";

export default {
  name: "OfferTableView",
  components: {
    Table,
    Tr,
    Th,
    OfferTableItem,
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