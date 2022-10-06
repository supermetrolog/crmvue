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
        <Loader v-if="loader" class="center small" />
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
import OfferMobileItem from "./OfferMobileItem.vue";
import Table from "@/components/common/table/Table";
import Tr from "@/components/common/table/Tr";
import Th from "@/components/common/table/Th";

export default {
  name: "OfferMobileView",
  components: {
    Table,
    Tr,
    Th,
    OfferMobileItem,
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