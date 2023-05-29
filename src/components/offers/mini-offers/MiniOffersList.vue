<template>
  <Table v-if="miniOffers.length">
    <template #thead>
      <Tr>
        <Th
          ><div class="burger-wrapper"><BurgerMenuButton :size="'small'" /></div
        ></Th>
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
        @toggleAvito="handleToggleAvito"
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
  data() {
    return {};
  },
  props: {
    miniOffers: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleToggleAvito(id) {
      this.$emit("toggleAvito", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.burger-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}
</style>
