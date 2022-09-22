<template>
  <div class="offer-table-view">
    <Table>
      <template #thead>
        <Tr>
          <Th>#</Th>
          <Th></Th>
          <Th>регион</Th>
          <Th :sort="sortable ? 'from_mkad' : null">мкад</Th>
          <Th :sort="sortable ? 'area' : null">площадь</Th>
          <Th :sort="sortable ? 'price' : null">цена</Th>
          <Th>cобственник</Th>
          <Th>консультант</Th>
          <Th>реклама</Th>
          <Th :sort="sortable ? 'last_update' : null">обновление</Th>
          <Th :sort="sortable ? 'status' : null">статус</Th>
        </Tr>
      </template>
      <template #tbody>
        <Loader v-if="loader" class="center" />
        <OfferTableItem
          v-for="offer in offers"
          :key="offer.id"
          :offer="offer"
          :loader="loader"
        />
      </template>
    </Table>
  </div>
</template>

<script>
import OfferTableItem from "../offer-item/OfferTableItem.vue";
import Table from "@/components/common/table/Table";
import Tr from "@/components/common/table/Tr";
import Th from "@/components/common/table/Th";

import {
  DirectionList,
  DistrictList,
  RegionList,
  TaxFormList,
} from "@/const/Const.js";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "OfferTableView",
  components: {
    Table,
    Tr,
    Th,
    OfferTableItem,
  },
  data() {
    return {
      directionList: DirectionList.get("param"),
      districtList: DistrictList.get("param"),
      regionList: RegionList.get("param"),
      taxFormList: TaxFormList,
    };
  },
  props: {
    offers: {
      type: Array,
    },
    loader: {
      type: Boolean,
      default: false,
    },
    sortable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters(["FAVORITES_OFFERS", "THIS_USER"]),
  },
  methods: {
    ...mapActions([
      "ADD_FAVORITES_OFFER",
      "DELETE_FAVORITES_OFFERS",
      "SEARCH_FAVORITES_OFFERS",
    ]),
    imageSrc(offer) {
      const photos = offer.photos;
      const object_photos = offer.object.photo;
      let resultImage = null;
      if (photos && Array.isArray(photos)) {
        photos.forEach((img) => {
          if (resultImage == null && typeof img == "string" && img.length > 2) {
            resultImage = "https://pennylane.pro" + img;
          }
        });
      }

      if (resultImage) {
        return resultImage;
      }
      if (
        object_photos &&
        Array.isArray(object_photos) &&
        typeof object_photos[0] == "string" &&
        object_photos[0].length > 2
      ) {
        return "https://pennylane.pro" + object_photos[0];
      }
      return this.$apiUrlHelper.fileNotFoundUrl();
    },
    getRegion(region) {
      return this.regionList[region].label;
    },
    getDirection(direction) {
      return this.directionList[direction][2];
    },
    getDistrict(district) {
      return this.districtList[district][1];
    },
    getOfferUrl(offer) {
      const baseUrl = "https://pennylane.pro/complex/";
      let url = baseUrl + offer.complex_id;
      if (offer.type_id == 3) {
        return url;
      }
      if (offer.generalOffersMix) {
        url += "?offer_id=[" + offer.generalOffersMix.original_id + "]";
      } else {
        url += "?offer_id=[" + offer.original_id + "]";
      }
      return url;
    },

    async clickFavotiteOffer(offer) {
      if (
        !this.FAVORITES_OFFERS.find(
          (item) => item.original_id == offer.original_id
        )
      ) {
        return this.ADD_FAVORITES_OFFER(offer);
      }
      await this.DELETE_FAVORITES_OFFERS(offer);
      this.$emit("deleteFavoriteOffer", offer);
    },
    clickViewPdf(offer) {
      let url =
        this.$apiUrlHelper.url() +
        `pdf/presentations?type_id=${offer.type_id}&original_id=${offer.original_id}&object_id=${offer.object_id}&consultant=${this.THIS_USER.userProfile.medium_name}`;
      console.error(url);
      window.open(url, "_blank");
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>