<template>
  <tr class="OfferTableDropdown">
    <td colspan="11" class="OfferTableDropdown-wrapper">
      <Loader v-if="loader" />
      <div class="OfferTableDropdown-header-actions">
        <button title="Строение" @click="clickFavoriteOffer(offer)">
          <i class="fas fa-warehouse"></i>
        </button>
        <button title="Компания" @click="clickFavoriteOffer(offer)">
          <i class="fas fa-industry"></i>
        </button>
      </div>
      <Tabs
        v-model="startTab"
        :options="{ useUrlFragment: false, defaultTabHash: 'second-tab' }"
        cache-lifetime="0"
        wrapper-class="OfferTableDropdown-header"
        nav-class="OfferTableDropdown-menu"
        nav-item-class="OfferTableDropdown-menu-item"
        nav-item-active-class="item-active"
        nav-item-link-class="OfferTableDropdown-menu-item-link"
        nav-item-link-active-class="link-active"
        nav-item-link-disabled-class="link-disabled"
        panels-wrapper-class="OfferTableDropdown-offers"
      >
        <Tab
          id="first-tab"
          :name="`S - объекта<br/>${areaBuilding} <small>м<sup>2</sup></small></span
            >`"
          :is-disabled="true"
        ></Tab>
        <Tab
          id="second-tab"
          :name="`ТП АРЕНДА АКТИВ<br/>${activeOffers.length}`"
        >
          <div class="OfferTableDropdown-offers">
            <MiniOffers :miniOffers="activeOffers" />
          </div>
        </Tab>
        <Tab
          id="third-tab"
          :name="`ТП АРЕНДА АРХИВ<br/>${archiveOffers.length}`"
        >
          <div class="OfferTableDropdown-offers">
            <MiniOffers :miniOffers="archiveOffers" />
          </div>
        </Tab>
        <Tab id="fourth-tab" name="Объект продается!" v-if="salesOffers.length">
          <div class="OfferTableDropdown-offers">
            <MiniOffers :miniOffers="salesOffers" />
          </div>
        </Tab>
        <Tab name="Есть услуги О/Х!" v-if="storageOffers.length">
          <div class="OfferTableDropdown-offers">
            <MiniOffers :miniOffers="storageOffers" />
          </div>
        </Tab>
      </Tabs>
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
      picked: "active",
      startTab: "",
    };
  },
  props: {
    offer: {
      type: Object,
      required: true,
    },
    miniOffers: {
      type: Array,
      default: () => [],
    },
    loader: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    selectedOffers() {
      let result;
      switch (this.picked) {
        case "active":
          return this.activeOffers;
        case "archive":
          return this.archiveOffers;
        case "sales":
          return this.salesOffers;
        case "storage":
          return this.storageOffers;
      }
      return result;
    },
    rentOffers() {
      return this.miniOffers.filter(
        (offer) => offer.deal_type === 1 || offer.deal_type === 4
      );
    },
    salesOffers() {
      return this.miniOffers.filter((offer) => offer.deal_type === 2);
    },
    storageOffers() {
      return this.miniOffers.filter((offer) => offer.deal_type === 3);
    },
    activeOffers() {
      return this.rentOffers.filter((offer) => offer.status === 1);
    },
    archiveOffers() {
      return this.rentOffers.filter((offer) => offer.status === 2);
    },
    areaBuilding() {
      return this.offer.area_building.toLocaleString("ru-RU");
    },
  },
  methods: {},
};
</script>