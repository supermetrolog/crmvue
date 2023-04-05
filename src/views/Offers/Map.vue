<template>
  <div class="all">
    <div class="row no-gutters search-main-container">
      <OfferSearchModalForm
        v-if="mounted && searchFormModalVisible"
        ref="search"
        @close="toggleSearchFormModalVisible"
      />
      <div class="container mx-0 px-0 py-2">
        <OfferSearchExternalForm
          v-if="mounted"
          @openFilters="toggleSearchFormModalVisible"
        />
        <List :data="selectedFilterList" @remove="removeFilter" />
      </div>
    </div>
    <div class="row no-gutters map-container">
      <div class="map-loader" v-if="allOffersLoader"></div>
      <div class="col-12">
        <YmapOffersView
          :list="allOffersForYmap"
          :polygonCoordinates="polygonCoordinates"
          @selectionDone="filterByPolygon"
          @removedDone="removedPolygonFromFilters"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OfferSearchModalForm from "@/components/offers/forms/offer-form/OfferSearchModalForm.vue";
import OfferSearchExternalForm from "@/components/offers/forms/offer-form/OfferSearchExternalForm.vue";
import { mapGetters, mapActions } from "vuex";
import { TableContentMixin } from "@/components/common/mixins.js";
import YmapOffersView from "@/components/offers/map/YmapOffersView.vue";
import List from "@/components/common/list-horizontal/List.vue";
import api from "@/api/api";
import { waitHash } from "../../utils";
export default {
  mixins: [TableContentMixin],
  name: "OffersMap",
  data() {
    return {
      allOffersForYmap: [],
      ymapOffersSearchHash: null,
      allOffersLoader: false,
      searchFormModalVisible: false,
    };
  },
  inject: ["isMobile"],
  components: {
    List,
    OfferSearchModalForm,
    OfferSearchExternalForm,
    YmapOffersView,
  },
  computed: {
    ...mapGetters([
      "OFFERS",
      "OFFERS_PAGINATION",
      "THIS_USER",
      "FAVORITES_OFFERS",
    ]),
    polygonCoordinates() {
      if (
        this.$route.query.polygon &&
        Array.isArray(this.$route.query.polygon)
      ) {
        return this.$route.query.polygon.map((coords) => {
          return coords.split(",");
        });
      }
      return [];
    },
    selectedFilterList() {
      let list = [];
      for (const key in this.$route.query) {
        if (Object.hasOwnProperty.call(this.$route.query, key)) {
          const value = this.$route.query[key];
          if (
            value !== null &&
            value !== "" &&
            key != "fakeRegion" &&
            key != "region_neardy" &&
            key != "all" &&
            key != "page" &&
            key != "outside_mkad"
          ) {
            if (Array.isArray(value)) {
              if (value.length) {
                list.push(this.getFilterListOption(key, value));
              }
            } else {
              list.push(this.getFilterListOption(key, value));
            }
          }
        }
      }
      return list;
    },
  },
  filtersAliases: {
    rangeMinElectricity: "Электричество от",
    rangeMaxDistanceFromMKAD: "Удаленность от МКАД",
    deal_type: null,
    agent_id: null,
    rangeMaxArea: "Площадь до",
    rangeMinArea: "Площадь от",
    rangeMaxPricePerFloor: null,
    rangeMinPricePerFloor: null,
    rangeMinCeilingHeight: null,
    rangeMaxCeilingHeight: null,
    class: [],
    gates: [],
    heated: null,
    water: null,
    gas: null,
    steam: null,
    sewage_central: null,
    racks: null,
    railway: null,
    has_cranes: null,
    floor_types: [],
    purposes: [],
    object_type: "Тип объекта",
    region: [],
    fakeRegion: null,
    direction: [],
    district_moscow: [],
    status: null,
    firstFloorOnly: null,
    ad_realtor: null,
    ad_cian: null,
    ad_yandex: null,
    ad_free: null,
    favorites: null,
    polygon: "Область на карте",
  },
  methods: {
    ...mapActions(["SEARCH_OFFERS", "SEARCH_FAVORITES_OFFERS"]),
    removeFilter(filter) {
      console.log(filter);
    },
    getFilterListOption(key, value) {
      const stops = ["polygon"];
      const option = {
        label: this.$options.filtersAliases[key],
        value: key,
      };
      if (!stops.includes(key)) {
        option.label += " - " + value;
      }
      return option;
    },
    async filterByPolygon(coordinates) {
      console.log("QUERY POLYGON", this.polygonCoordinates);
      const query = { ...this.$route.query };
      query.polygon = coordinates;
      await this.$router.replace({ query });
      const search = this.$refs.search;

      if (search) {
        search.form.polygon = coordinates;
      }
    },
    toggleSearchFormModalVisible() {
      this.searchFormModalVisible = !this.searchFormModalVisible;
    },
    removedPolygonFromFilters() {
      const query = { ...this.$route.query };
      if (query.polygon) {
        delete query.polygon;
        this.$router.replace({ query });
      }
      const search = this.$refs.search;

      if (search) {
        search.form.polygon = null;
      }
    },
    getContent(withLoader = true) {
      this.getAllOffersForYmap(withLoader);
    },
    async getAllOffersForYmap(withLoader = true) {
      const routeQuery = { ...this.$route.query };
      delete routeQuery.page;
      delete routeQuery.sort;
      if (routeQuery.favorites) {
        await this.SEARCH_FAVORITES_OFFERS();
      }
      const query = {
        ...routeQuery,
        type_id: [2, 3],
        fields:
          "latitude,longitude,address,complex_id,status,thumb,test_only,id",
        objectsOnly: 1,
        original_id: routeQuery.favorites
          ? this.FAVORITES_OFFERS.map((item) => item.original_id)
          : null,
        page: 1,
        noWith: 1,
        "per-page": 0,
      };
      if (query.original_id == null) {
        delete query.original_id;
      }
      const hash = waitHash(query);
      console.log(hash, this.ymapOffersSearchHash);
      if (hash == this.ymapOffersSearchHash) {
        return;
      }
      if (routeQuery.favorites) {
        if (!this.FAVORITES_OFFERS.length) {
          await this.SEARCH_FAVORITES_OFFERS();
        }
        query.original_id = this.FAVORITES_OFFERS.map(
          (item) => item.original_id
        );
        query.object_id = this.FAVORITES_OFFERS.map((item) => item.object_id);
        query.complex_id = this.FAVORITES_OFFERS.map((item) => item.complex_id);
      }
      this.allOffersLoader = withLoader;

      console.log(hash, this.ymapOffersSearchHash);
      this.ymapOffersSearchHash = hash;
      const data = await api.offers.searchMap(query);
      console.error(Array.isArray(data.data));
      if (Array.isArray(data.data)) {
        console.warn(hash, this.ymapOffersSearchHash);
        if (hash == this.ymapOffersSearchHash) {
          this.allOffersForYmap = data.data;
        } else {
          return false;
        }
      }
      this.allOffersLoader = false;
      console.error(data);
      return data;
    },
    // Переопределено из миксина (судя по всему)
    initialRouteSettings() {},
    async deleteFavoriteOffer() {
      if (this.$route.query.favorites) {
        await this.SEARCH_FAVORITES_OFFERS();
        this.getContent(false);
      }
    },
  },
};
</script>

<style>
</style>