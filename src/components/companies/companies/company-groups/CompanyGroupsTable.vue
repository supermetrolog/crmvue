<template>
  <div class="company-groups-table">
    <div class="row no-gutters">
      <div class="col-12">
        <Table>
          <template #thead>
            <Tr class="text-left">
              <Th> Название </Th>
              <Th> Описание </Th>
              <Th></Th>
            </Tr>
          </template>
          <template #tbody>
            <Tr v-for="item in companyGroups" :key="item.id">
              <Td> {{ item.nameRu }} - {{ item.nameEng }} </Td>
              <Td class="description">
                {{ item.description }}
              </Td>
              <Td class="text-right">
                <button
                  class="btn btn-action text-primary"
                  @click="$emit('clickEdit', item)"
                >
                  <i class="fas fa-edit"></i>
                </button>
              </Td>
            </Tr>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "@/components/table/Table";
import Tr from "@/components/table/Tr";
import Th from "@/components/table/Th";
import Td from "@/components/table/Td";
export default {
  name: "CompanyGroupsTable",
  components: {
    Table,
    Tr,
    Th,
    Td,
  },
  props: {
    companyGroups: {
      type: Array,
    },
  },
};
</script>

<style>
</style>