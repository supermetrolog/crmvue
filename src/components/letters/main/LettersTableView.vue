<template>
  <div class="offer-table-view">
    <Table>
      <template #thead>
        <Tr>
          <Th>#</Th>
          <Th :sort="sortable ? 'created_at' : null">дата</Th>
          <Th :sort="sortable ? 'user_id' : null">отправитель</Th>
          <Th></Th>
          <Th>объекты</Th>
          <Th>кому</Th>
        </Tr>
      </template>
      <template #tbody>
        <Loader v-if="loader" class="center" />
        <LetterTableItem
          v-for="(letter, idx) in letters"
          :key="letter.id"
          :letter="letter"
          :loader="loader"
          :odd="!(idx % 2)"
        />
      </template>
    </Table>
  </div>
</template>

<script>
import LetterTableItem from "../letter-item/LetterTableItem.vue";
import Table from "@/components/common/table/Table";
import Tr from "@/components/common/table/Tr";
import Th from "@/components/common/table/Th";

export default {
  name: "LettersTableView",
  components: {
    Table,
    Tr,
    Th,
    LetterTableItem,
  },
  data() {
    return {};
  },
  props: {
    letters: {
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
