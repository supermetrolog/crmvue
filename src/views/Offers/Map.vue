<template>
  <div class="all" v-if="mounted">
    <div class="row no-gutters search-main-container">
      <OfferSearchModalForm
        v-if="mounted && searchFormModalVisible"
        ref="search"
        @close="toggleSearchFormModalVisible"
      />
      <div class="container mx-0 px-0 py-2" ref="searchContainer">
        <OfferSearchExternalForm
          class="ext-search-form"
          v-if="mounted"
          @openFilters="toggleSearchFormModalVisible"
        />
        <List class="list" :data="selectedFilterList" @remove="removeFilter" />
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
import { mapGetters, mapActions } from "vuex";
import { TableContentMixin } from "@/components/common/mixins.js";
import YmapOffersView from "@/components/offers/map/YmapOffersView.vue";
import List from "@/components/common/list-horizontal/List.vue";
import api from "@/api/api";
import { waitHash } from "@/utils";
import {
  DealTypeList,
  ObjectClassList,
  GateTypeList,
  YesNoFUCK,
  YesNo,
  FloorTypesFUCK,
  ObjectTypeList,
  DirectionList,
  DistrictList,
  ActivePassiveFUCK,
} from "@/const/Const.js";

export default {
  name: "OffersMap",
  mixins: [TableContentMixin],
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
      searchFormModalVisible: false,
      ymapStyles: {
          width: '100%',
          height: '100vh'
      },
      filtersValueGetter: {
        rangeMinElectricity: (value) => value + ' кВт',
        rangeMaxDistanceFromMKAD: (value) => value + ' км',
        deal_type: (value) => DealTypeList.get('param').find(el => el.value == value).label.toUpperCase(),
        agent_id: (value) => this.CONSULTANT_LIST.length ? this.CONSULTANT_LIST.find(elem => elem.value == value).label : null,
        rangeMinArea: (value) => value + ' м<sup>2</sup>',
        rangeMaxArea: (value) => value + ' м<sup>2</sup>',
        rangeMinPricePerFloor: (value) => value + ' р',
        rangeMaxPricePerFloor: (value) => value + ' р',
        rangeMinCeilingHeight: (value) => value + ' м',
        rangeMaxCeilingHeight: (value) => value + ' м',
        class: (value) => {
          if (!value) return null;
          if (!Array.isArray(value)) value = [value]
          return value.map(elem => ObjectClassList.get('param')[elem][1]).join(', ');
        },
        gates: (value) => {
          if (!value) return null;
          if (!Array.isArray(value)) value = [value]
          return value.map(elem => GateTypeList.get('param')[elem][1]).join(', ');
        },
        heated: (value) => {
          if (!value) return null;
          return YesNoFUCK.get('param').find(param => param[0] == value)[1];
        },
        // water: null,
        // gas: null,
        // steam: null,
        // sewage_central: null,
        // racks: null,
        // railway: null,
        // has_cranes: null,
        floor_types: (value) => {
          if (!value) return null;
          if (!Array.isArray(value)) value = [value]
          return value.map(elem => FloorTypesFUCK.get('param').find(param => param[0] == elem)[1]).join(', ');
        },
        purposes: (value) => {
          if (!value) return null;
          if (!Array.isArray(value)) value = [value];
          const options = [
            ...ObjectTypeList.get('warehouse'),
            ...ObjectTypeList.get('production'),
            ...ObjectTypeList.get('plot'),
          ];
          
          return value.map(elem => {
            const param = options.find(el => el[0] == elem)[1];
            return `<i title="${param.name}"" class="' ${param.icon} '"></i>`;
          }).join(', ');
        },
        object_type: (value) => {
          if (!value) return null;
          if (!Array.isArray(value)) value = [value]
          const options = {1: "Склад", 2: "Производство", 3: "Участок"};
          return value.map(elem => options[elem]).join(', ');
        },
        region: (value) => {
          if (!value || !this.REGION_LIST) return null;
          return this.REGION_LIST.find(reg => reg.value == value).label;
        },
        // fakeRegion: null,
        district_moscow: (value) => {
          if (!value) return null;
          if (!Array.isArray(value)) value = [value]
          return value.map(elem => DistrictList.get('param')[elem][1]).join(', ');
        },
        direction: (value) => {
          if (!value) return null;
          if (!Array.isArray(value)) value = [value]
          return value.map(elem => DirectionList.get('param')[elem][1]).join(', ');
        },
        status: (value) => {
          if (!value) return null;
          return ActivePassiveFUCK.get('param').find(param => param[0] == value)[1];
        },
        // firstFloorOnly: null,
        ad_realtor: (value) => {
          if (!value) return null;
          return YesNo.get('param').find(param => param[0] == value)[1];
        },
        ad_cian: (value) => {
          if (!value) return null;
          return YesNo.get('param').find(param => param[0] == value)[1];
        },
        ad_yandex: (value) => {
          if (!value) return null;
          return YesNo.get('param').find(param => param[0] == value)[1];
        },
        ad_free: (value) => {
          if (!value) return null;
          return YesNo.get('param').find(param => param[0] == value)[1];
        },
        // favorites: null,
        // polygon: "Область на карте",
      },
      
    };
  },
  filtersAliases: {
    polygon: "Область на карте",
    rangeMaxArea: 'До:',
    rangeMinArea: 'От:',
    rangeMaxDistanceFromMKAD: 'От МКАД:',
    rangeMinElectricity: 'От:',
    rangeMaxPricePerFloor: 'До:',
    rangeMinPricePerFloor: 'От:',
    rangeMinCeilingHeight: 'Потолки От:',
    rangeMaxCeilingHeight: 'Потолки До:',
    class: 'Класс:',
    // gates: [],
    heated: 'Отопление:',
    water: 'Вода',
    gas: "Газ",
    steam: "Пар",
    sewage_central: "КНС",
    racks: "Стеллажи",
    railway: "Ж/Д ветка",
    has_cranes: "Краны",
    // floor_types: [],
    // purposes: [],
    // object_type: "Тип объекта",
    // region: 'Регион',
    // fakeRegion: null,
    // direction: [],
    // district_moscow: [],
    // status: null,
    firstFloorOnly: "Только 1 этаж",
    ad_realtor: 'Realtor.ru:',
    ad_cian: 'Циан:',
    ad_yandex: 'Яндекс:',
    ad_free: 'Бесплатно:',
    // favorites: null,
    // polygon: "Область на карте",
  },
  inject: ["isMobile"],
  
  computed: {
    ...mapGetters([
      "OFFERS",
      "OFFERS_PAGINATION",
      "THIS_USER",
      "FAVORITES_OFFERS",
      "CONSULTANT_LIST",
      "REGION_LIST"
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
          if (key === 'region'){
            console.log(this.$route.query['fakeRegion']);
            list.push(this.getFilterListOption('region', this.$route.query['fakeRegion']));
            continue;
          }
          if (
            value !== null &&
            value !== "" &&
            key !== "fakeRegion" &&
            key !== "region_neardy" &&
            key !== "all" &&
            key !== "page" &&
            key !== "outside_mkad" &&
            !(Array.isArray(value) && !value.length)
          ) {
            list.push(this.getFilterListOption(key, value));
          }
        }
      }
      return list;
    },
  },

  methods: {
    ...mapActions([
      "SEARCH_OFFERS",
      "SEARCH_FAVORITES_OFFERS",
      "FETCH_CONSULTANT_LIST",
      "FETCH_REGION_LIST"
    ]),
    removeFilter(filter) {
      const query = {...this.$route.query};
      if (filter == 'fakeRegion'){
        delete query['region'];
      }
      if (filter == 'region'){
        delete query['fakeRegion'];
      }
      delete query[filter];
      
      this.$router.replace({query});
    },
    getFilterListOption(key, value) {
      const option = {};
      option.value = key;
      const label = this.$options.filtersAliases[key] ?? null;
      const valueFn = this.filtersValueGetter[key] ? this.filtersValueGetter[key](value) : null;

      if(!label && !valueFn){
        option.label = 'undefined';
      }else{
        option.label = [label, valueFn].filter(el => el !== null).join(' ');
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
        console.warn(hash, this.ymapOffersSearchHash);
        if (hash === this.ymapOffersSearchHash) {
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
  async created() {
    await this.FETCH_CONSULTANT_LIST();
    await this.FETCH_REGION_LIST();
    this.mounted = true;
  },
  watch: {
    mounted(){
      if (!this.mounted) return;
      
      this.$nextTick(() => {
        this.ymapStyles.height = (window.innerHeight -
         this.$refs.searchContainer.getClientRects()[0].height - 60) + "px";
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>