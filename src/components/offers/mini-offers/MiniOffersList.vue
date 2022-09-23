<template>
  <Table v-if="miniOffers.length">
    <template #thead>
      <Tr>
        <Th><BurgerMenuButton :size="'small'" /></Th>
        <Th>ID блока</Th>
        <Th>Этаж</Th>
        <Th>Площадь</Th>
        <Th>Высота</Th>
        <Th>Тип пола</Th>
        <Th>Тип ворот</Th>
        <Th>Температура</Th>
        <Th>Цена блока</Th>
        <Th></Th>
      </Tr>
    </template>
    <template #tbody>
      <MiniOffersItem
        v-for="offer in miniOffers"
        :key="offer.id"
        :offer="offer"
      />
    </template>
  </Table>
  <span v-else>Объекты не найдены</span>
</template>

<script>
import BurgerMenuButton from "../../common/BurgerMenuButton.vue";
import MiniOffersItem from "./MiniOffersItem.vue";
import Table from "@/components/common/table/Table";
import Tr from "@/components/common/table/Tr";
import Th from "@/components/common/table/Th";

export default {
  name: "MiniOffersList",
  components: {
    Table,
    Tr,
    Th,
    MiniOffersItem,
    BurgerMenuButton,
  },
  data() {},
  props: {
    miniOffers: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
