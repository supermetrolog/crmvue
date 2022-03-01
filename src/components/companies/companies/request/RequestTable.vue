<template>
  <div class="request-table">
    <Table>
      <template #thead>
        <Tr>
          <Th>#</Th>
          <Th>тип сделки</Th>
          <Th>площадь</Th>
          <Th>цена</Th>
          <Th>регион</Th>
          <Th>компания</Th>
          <Th>консультант</Th>
          <Th>дата обновления</Th>
          <Th>статус</Th>
        </Tr>
      </template>
      <template #tbody>
        <Tr v-for="request in requests" :key="request.id">
          <Td>
            {{ request.id }}
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
// import Progress from "@/components/common/Progress";
export default {
  name: "RequestTable",
  components: {
    Table,
    Tr,
    Th,
    Td,
    // Progress,
  },
  props: {
    requests: {
      type: Array,
    },
    loader: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
</style>