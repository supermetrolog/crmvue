<template>
  <tr class="OfferTableDropdown">
    <td colspan="11" class="OfferTableDropdown-wrapper">
      <div class="OfferTableDropdown-header">
        <ul class="OfferTableDropdown-menu">
          <li class="OfferTableDropdown-menu-item">
            <span>S - объекта</span
            ><span
              >{{ offer.area_building.toLocaleString("ru-RU") }}
              <small>м<sup>2</sup></small></span
            >
          </li>
          <li
            class="OfferTableDropdown-menu-item"
            :class="{ 'btn-success_alt': selectedMiniOffers == 'active' }"
            @click="this.selectedMiniOffers = 'active'"
          >
            <span>ТП АРЕНДА АКТИВ</span
            ><span>{{ activeMiniOffers.length }}</span>
          </li>
          <li
            class="OfferTableDropdown-menu-item"
            :class="{ 'btn-success_alt': selectedMiniOffers == 'archive' }"
            @click="this.selectedMiniOffers = 'archive'"
          >
            <span>ТП Аренда архив</span
            ><span>{{ archiveMiniOffers.length }}</span>
          </li>
          <li class="OfferTableDropdown-menu-item text-danger">
            <span>{{ offerDealType(offer.deal_type) }}</span>
          </li>
          <li
            class="OfferTableDropdown-menu-item text-success"
            v-if="offer.guard"
          >
            <span>Есть услуги О/Х</span>
          </li>
        </ul>
        <div class="OfferTableDropdown-header-actions">
          <button title="Гараж какой-то">1</button>
          <button title="Компания">2</button>
        </div>
      </div>
      <div class="OfferTableDropdown-offers">
        <MiniOffers
          :miniOffers="
            selectedMiniOffers == 'active'
              ? activeMiniOffers
              : archiveMiniOffers
          "
        />
      </div>
    </td>
  </tr>
</template>

<script>
import MiniOffers from "../mini-offers/MiniOffersList.vue";

export default {
  name: "OfferTableDropdown",
  components: {
    MiniOffers,
  },
  data() {
    return {
      selectedMiniOffers: "active",
    };
  },
  props: {
    offer: {
      type: Object,
      required: true,
    },
  },
  computed: {
    activeMiniOffers() {
      return this.offer.miniOffersMix.filter((offer) => offer.status);
    },
    archiveMiniOffers() {
      return this.offer.miniOffersMix.filter((offer) => !offer.status);
    },
  },
  methods: {
    offerDealType(type) {
      switch (type) {
        case 1:
          return "Объект сдается";
        case 2:
          return "Объект продается";
        case 3:
          return "Ответственное хранение";
      }
    },
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
</style>