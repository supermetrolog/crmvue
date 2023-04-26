<template>
  <div class="all" v-if="mounted">
    <div class="row no-gutters search-main-container">
      <OfferSearchModalForm
        v-if="mounted && searchFormModalVisible"
        ref="search"
        @close="toggleSearchFormModalVisible"
      />
      <div class="container-fluid p-0" ref="searchContainer">
        <OfferSearchExternalForm
          class="ext-search-form"
          v-if="mounted"
          :offersCount="offersCount"
          :objectsCount="objectsCount"
          :isMap="true"
          @openFilters="toggleSearchFormModalVisible"
        />
        <List class="list mb-2" :data="selectedFilterList" @remove="removeFilter" />
      </div>
    </div>
    <div class="row no-gutters map-container">
      <div class="map-loader" v-if="allOffersLoader"></div>
      <div class="col-12">
        <YmapOffersView
          :list="allOffersForYmap"
          :polygonCoordinates="polygonCoordinates"
          :styles="ymapStyles"
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
import { mapActions } from "vuex";
import { TableContentMixin } from "@/components/common/mixins.js";
import YmapOffersView from "@/components/offers/map/YmapOffersView.vue";
import List from "@/components/common/list-horizontal/List.vue";
import api from "@/api/api";
import { waitHash } from "@/utils";
import FilterMixin from "./mixins";

export default {
  name: "OffersMap",
  mixins: [TableContentMixin, FilterMixin],
  components: {
    List,
    OfferSearchModalForm,
    OfferSearchExternalForm,
    YmapOffersView
  },
  data() {
    return {
      mounted: false,
      allOffersForYmap: [],
      ymapOffersSearchHash: null,
      allOffersLoader: false,
      objectsCount: null,
      offersCount: null,
      ymapStyles: {
          width: '100%',
          height: '100vh'
      },
    };
  },
  
  inject: ["isMobile"],
  
  computed: {
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
  },
  
  methods: {
    ...mapActions([
      "SEARCH_OFFERS",
      "SEARCH_FAVORITES_OFFERS",
    ]),
    
    
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
      if (hash === this.ymapOffersSearchHash) {
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
        delete query.objectsOnly;
        const offersCount = await api.offers.searchCount(query);
        console.warn(hash, this.ymapOffersSearchHash);
        if (hash === this.ymapOffersSearchHash) {
          this.allOffersForYmap = data.data;
          this.objectsCount = data.pagination.totalCount;
          this.offersCount = +offersCount;
        } else {
          return false;
        }
      }
      this.allOffersLoader = false;
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
    setYmapSize() {
      this.$nextTick(() => {
        console.log("ASSSSSSSSSSSSSSSSS");
        this.ymapStyles.height = (window.innerHeight -
            this.$refs.searchContainer.getClientRects()[0].height - 60) + "px";
        
      });
    }
  },
  beforeUnmount() {
    this.$refs.searchContainer.removeEventListener('resize', this.setYmapSize);
  },
  watch: {
    mounted(){
      if (!this.mounted) return;
      this.setYmapSize();
      this.$nextTick(() => {
        new ResizeObserver(this.setYmapSize).observe(this.$refs.searchContainer);
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>