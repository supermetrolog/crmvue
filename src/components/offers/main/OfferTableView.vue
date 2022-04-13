<template>
  <div class="offer-table-view">
    <Table>
      <template #thead>
        <Tr>
          <Th>#</Th>
          <Th></Th>
          <Th>консультант</Th>
          <Th sort="created_at">Дата</Th>
          <Th sort="status">статус</Th>
        </Tr>
      </template>
      <template #tbody>
        <Loader v-if="loader" class="center" />
        <Tr v-for="offer in offers" :key="offer.id">
          <Td class="text-center p-0"> {{ offer.id }} </Td>
          <Td class="name" sort="nameRu">
            <router-link :to="'/companies/' + offer.id" target="_blank">
              <h4 class="d-inline" :class="{ 'text-warning': !offer.status }">
                {{ offer.id }}
              </h4>
            </router-link>
          </Td>
          <Td class="text-center">
            {{ offer.agent_id }}
          </Td>
          <Td class="text-center date" sort="created_at">
            {{ offer.last_update }}
          </Td>
          <Td class="text-center" sort="status">
            <h4 class="text-success" v-if="offer.status == 1">Актив</h4>
            <span class="badge badge-warning autosize" v-else> Пассив </span>
          </Td>
        </Tr>
      </template>
    </Table>
  </div>
</template>

<script>
import Table from "@/components/common/table/Table";
import Tr from "@/components/common/table/Tr";
import Th from "@/components/common/table/Th";
import Td from "@/components/common/table/Td";
export default {
  name: "OfferTableView",
  components: {
    Table,
    Tr,
    Th,
    Td,
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
  },
  methods: {},
  mounted() {
    console.log(this.offers);
  },
};
</script>

<style>
</style>