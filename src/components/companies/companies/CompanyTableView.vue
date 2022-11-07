<template>
  <div class="company-table-view">
    <Table>
      <template #thead>
        <Tr>
          <Th>#</Th>
          <Th class="text-left" sort="nameRu">название компании</Th>
          <Th>категория</Th>
          <Th>контакт</Th>
          <Th>опросник</Th>
          <Th>консультант</Th>
          <Th>Задачи бд</Th>
          <Th sort="created_at">Дата</Th>
        </Tr>
      </template>
      <template #tbody>
        <Loader v-if="loader" class="center" />
        <CompanyTableItem
          v-for="company in companies"
          :key="company.id"
          :company="company"
        ></CompanyTableItem>
      </template>
    </Table>
  </div>
</template>

<script>
import CompanyTableItem from "./item/CompanyTableItem.vue";
import { MixinCompanyView } from "./mixins";
import Table from "@/components/common/table/Table";
import Tr from "@/components/common/table/Tr";
import Th from "@/components/common/table/Th";
export default {
  mixins: [MixinCompanyView],
  name: "CompanyTableView",
  components: {
    Table,
    Tr,
    Th,
    CompanyTableItem,
  },
};
</script>