<template>
  <Table v-if="miniOffers.length">
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
        <Th>*</Th>
      </Tr>
    </template>
    <template #tbody>
      <Tr v-for="offer in miniOffers" :key="offer.id">
        <Td>#</Td><Td>{{ offer.visual_id }}</Td
        ><Td>{{ offer.floor_max / offer.floor_min }}</Td>
        <Td
          >{{ offer.calc_area_general }} <small>м<sup>2</sup></small></Td
        >
        <Td>{{
          `${offer.ceiling_height_min} - ${offer.ceiling_height_max}`
        }}</Td>
        <Td>{{ offer.floor_type }}</Td>
        <Td>{{ `${offer.gate_num} шт/${offer.gate_type}` }}</Td>
        <Td>{{ `${offer.temperature_min}-${offer.temperature_max}` }}</Td>
        <Td
          >{{ offer.calc_price_general }}
          <small>руб за м<sup>2</sup>/г</small></Td
        >
        <Td
          ><div><button>1</button><button>2</button><button>3</button></div></Td
        ></Tr
      ></template
    >
  </Table>
  <span v-else>Объекты не найдены</span>
</template>

<script>
import Table from "@/components/common/table/Table";
import Tr from "@/components/common/table/Tr";
import Th from "@/components/common/table/Th";
import Td from "@/components/common/table/Td";

export default {
  name: "MiniOffers",
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
    miniOffers: {
      type: Array,
      default: () => [],
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