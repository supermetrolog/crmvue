<template>
  <tr class="OfferTableDropdown">
    <td colspan="11" class="OfferTableDropdown-wrapper">
      <div class="OfferTableDropdown-header">
        <ul class="OfferTableDropdown-menu">
          <li>
            <div class="OfferTableDropdown-menu-item">
              <span>S - объекта</span><span>160</span>
            </div>
          </li>
          <li>
            <div class="OfferTableDropdown-menu-item">
              <span>S - объекта</span><span>160</span>
            </div>
          </li>
          <li>
            <div class="OfferTableDropdown-menu-item">
              <span>S - объекта</span><span>160</span>
            </div>
          </li>
          <li>
            <div class="OfferTableDropdown-menu-item">
              <span>S - объекта</span><span>160</span>
            </div>
          </li>
          <li>
            <div class="OfferTableDropdown-menu-item">
              <span>S - объекта</span><span>160</span>
            </div>
          </li>
          <li>
            <div class="OfferTableDropdown-menu-item">
              <span>S - объекта</span><span>160</span>
            </div>
          </li>
        </ul>
        <div class="OfferTableDropdown-header-actions">
          <div>1</div>
          <div>2</div>
        </div>
      </div>
      <div>
        <Table>
          <template #thead>
            <Tr>
              <Th>#</Th>
              <Th>ID блока</Th>
              <Th>Этаж</Th>
              <Th>Площадь</Th>
              <Th>Высота</Th>
              <Th>Тип пола</Th>
              <Th>Тип ворот</Th>
              <Th>Температура</Th>
              <Th>Цена блока</Th>
              <Th><button>*</button></Th>
            </Tr>
          </template>
          <template #tbody>
            <Loader v-if="loader" class="center" /><Tr>
              <Td>#</Td><Td>123</Td><Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td></Tr
          ></template>
        </Table>
      </div>
    </td>
  </tr>
</template>

<script>
import Loader from "../../common/Loader.vue";
import Table from "@/components/common/table/Table";
import Tr from "@/components/common/table/Tr";
import Th from "@/components/common/table/Th";
import Td from "@/components/common/table/Td";

export default {
  name: "OfferTableDropdown",
  components: {
    Table,
    Tr,
    Th,
    Td,
    Loader,
  },
  data() {
    return {};
  },
  props: {
    loader: {
      type: Boolean,
      default: false,
    },
    sortable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {},
  methods: {},
  mounted() {},
};
</script>

<style lang='scss' scoped>
th {
  color: black;
}
</style>