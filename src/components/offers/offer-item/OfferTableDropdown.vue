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
            class="OfferTableDropdown-menu-item action"
            :class="{ 'btn-success_alt': selectedMiniOffers == 'active' }"
            @click="this.selectedMiniOffers = 'active'"
          >
            <span>ТП АРЕНДА АКТИВ</span
            ><span>{{ activeMiniOffers.length }}</span>
          </li>
          <li
            class="OfferTableDropdown-menu-item action"
            :class="{ 'btn-success_alt': selectedMiniOffers == 'archive' }"
            @click="this.selectedMiniOffers = 'archive'"
          >
            <span>ТП Аренда архив</span
            ><span>{{ archiveMiniOffers.length }}</span>
          </li>
          <li
            class="OfferTableDropdown-menu-item text-danger action"
            @click="onMakeDeal(offer.id, offer.deal_type)"
          >
            <span>{{ offerDealTypeHandler(offer.deal_type) }}</span>
          </li>
          <li
            class="OfferTableDropdown-menu-item text-success"
            v-if="offer.guard"
          >
            <span>Есть услуги О/Х</span>
          </li>
        </ul>
        <div class="OfferTableDropdown-header-actions">
          <button title="Строение" @click="clickFavoriteOffer(offer)">
            <i class="fas fa-warehouse"></i>
          </button>
          <button title="Компания" @click="clickFavoriteOffer(offer)">
            <i class="fas fa-industry"></i>
          </button>
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
    onMakeDeal(offerId, dealType) {
      switch (dealType) {
        case 1:
          console.log(`Сдаем объект ${offerId}`);
          break;
        case 2:
          console.log(`Продаем объект ${offerId}`);
          break;
        case 3:
          console.log(`Храним объект ${offerId}`);
          break;
        case 4:
          console.log(`Субарендим объект ${offerId}`);
          break;
      }
    },
    offerDealTypeHandler(type) {
      switch (type) {
        case 1:
          return "Объект сдается";
        case 2:
          return "Объект продается";
        case 3:
          return "Ответственное хранение";
        case 4:
          return "Субаренда";
      }
    },
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
</style>