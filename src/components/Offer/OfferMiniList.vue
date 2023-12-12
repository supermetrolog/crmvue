<template>
    <Table v-if="miniOffers.length">
        <template #thead>
            <Tr>
                <Th
                >
                    <div class="burger-wrapper">
                        <BurgerMenuButton :size="'small'"/>
                    </div
                    >
                </Th>
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
            <OfferMiniListItem
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
import Table from "@/components/Table/Table.vue";
import Tr from "@/components/Table/Tr.vue";
import Th from "@/components/Table/Th.vue";
import OfferMiniListItem from "@/components/Offer/OfferMiniListItem.vue";
import BurgerMenuButton from "@/components/common/BurgerMenuButton.vue";

export default {
    name: "OfferMiniList",
    components: {
        BurgerMenuButton,
        OfferMiniListItem,
        Table,
        Tr,
        Th,
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
        handleToggleAvito() {
            this.$emit("toggleAvito");
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
