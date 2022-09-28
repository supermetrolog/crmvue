<template>
  <tr class="OfferTableDropdown">
    <td colspan="11" class="OfferTableDropdown-wrapper">
      <Loader v-if="loader" class="small" />
      <div class="OfferTableDropdown-header-actions">
        <button title="Строение">
          <router-link :to="'/companies/' + offer.company.id" target="_blank">
            <i class="fas fa-warehouse"></i>
          </router-link>
        </button>
        <button title="Компания">
          <router-link :to="'/companies/' + offer.company.id" target="_blank">
            <i class="fas fa-industry"></i>
          </router-link>
        </button>
      </div>
      <Tabs
        v-model="startTab"
        :options="{ useUrlFragment: false, defaultTabHash: 'second-tab' }"
        :cache-lifetime="0"
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
          name="ТП АРЕНДА АКТИВ"
          :suffix="`<span class='${
            activeRentOffers.length ? 'suffix' : 'suffix suffix-none'
          }'>${activeRentOffers.length}</span>`"
        >
          <MiniOffers :miniOffers="activeRentOffers" />
        </Tab>
        <Tab
          id="third-tab"
          name="ТП АРЕНДА АРХИВ"
          :suffix="`<span class='${
            archiveRentOffers.length ? 'suffix' : 'suffix suffix-none'
          }'>${archiveRentOffers.length}</span>`"
          v-if="archiveRentOffers.length"
        >
          <MiniOffers :miniOffers="archiveRentOffers" />
        </Tab>
        <Tab
          id="fourth-tab"
          name="<span class='sales-link'>Объект продается!</span>"
          :suffix="`<span class='suffix'>${salesOffers.length}</span>`"
          v-if="salesOffers.length"
        >
          <MiniOffers :miniOffers="salesOffers" />
        </Tab>
        <Tab
          id="fifth-tab"
          name="<span class='storage-link'>Есть услуги О/Х!</span>"
          v-if="storageOffers.length"
          :suffix="`<span class='suffix'>${storageOffers.length}</span>`"
        >
          <MiniOffers :miniOffers="storageOffers" />
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
          return this.activeRentOffers;
        case "archive":
          return this.archiveRentOffers;
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
      return this.miniOffers
        .filter((offer) => offer.deal_type === 2)
        .sort((a, b) => a.status - b.status);
    },
    storageOffers() {
      return this.miniOffers
        .filter((offer) => offer.deal_type === 3)
        .sort((a, b) => a.status - b.status);
    },
    activeRentOffers() {
      return this.rentOffers.filter((offer) => offer.status === 1);
    },
    archiveRentOffers() {
      return this.rentOffers.filter((offer) => offer.status === 2);
    },
    areaBuilding() {
      return this.offer.area_building.toLocaleString("ru-RU");
    },
  },
  methods: {},
};
</script>