<template>
  <Tr class="OfferMobileItem">
    <td colspan="3" class="OfferMobileItem-wrapper">
      <div class="photo">
        <a :href="getOfferUrl(offer)" target="_blank">
          <div class="image-container">
            <img :src="offer.thumb" alt="image" />
            <span class="deal_type" :class="{ passive: offer.status != 1 }">
              {{ offer.deal_type_name }}
            </span>
            <span class="deal_type visual_id">
              {{ offer.visual_id }}
            </span>
            <span class="object_class">
              {{ offer.class_name }}
            </span>
            <span class="test_only" v-if="offer.test_only"> Тестовый лот </span>
          </div>
        </a>
      </div>
      <div class="info">
        <div class="description">
          <div class="price" sort="price">
            <p v-if="offer.deal_type == 1 || offer.deal_type == 4">
              {{ offer.calc_price_warehouse }}
              <small>руб за м<sup>2</sup>/г</small>
            </p>
            <p v-if="offer.deal_type == 2">
              {{ offer.calc_price_sale }} <small>руб за м<sup>2</sup></small>
            </p>
            <p v-if="offer.deal_type == 3">
              {{ offer.calc_price_safe_pallet }} <small>руб за 1 п. м.</small>
            </p>
            <p v-if="!offer.deal_type">Цена не указана</p>
            <p class="tax-form">
              <small
                v-if="
                  offer.generalOffersMix &&
                  offer.generalOffersMix.offer.tax_form
                "
              >
                {{
                  taxFormList.find(
                    (item) =>
                      item.value == offer.generalOffersMix.offer.tax_form
                  ).label
                }}
              </small>
            </p>
          </div>
          <div class="area" sort="area">
            <p>
              {{ offer.calc_area_general }}
              <small>м<sup>2</sup></small>
            </p>
          </div>
          <div class="region">
            <p class="region_item" v-if="offer.region_name">
              {{ offer.region_name
              }}<span v-if="offer.district_name">
                {{ `, ${offer.district_name}` }}
              </span>
            </p>
          </div>
          <div class="company">
            <template v-if="offer.company !== null">
              <router-link
                :to="'/companies/' + offer.company.id"
                target="_blank"
              >
                {{ offer.company.full_name }}
              </router-link>
              <div class="contact" v-if="offer.company.mainContact">
                {{ offer.company.mainContact.full_name }}
                <a
                  :href="'mailto:' + email.email"
                  v-for="email of offer.company.mainContact.emails"
                  :key="email.email"
                  class="d-block"
                >
                  {{ email.email }}
                </a>
                <PhoneNumber
                  v-for="phone of offer.company.mainContact.phones"
                  :key="phone.id"
                  :phone="phone"
                  :contact="offer.company.mainContact"
                />
              </div>
            </template>
          </div>
        </div>
        <div class="id" :class="{ passive: offer.status != 1 }">
          <div class="actions" v-if="offer.type_id != 3">
            <i
              class="fas fa-star"
              :class="{
                selected: FAVORITES_OFFERS.find(
                  (item) => item.original_id == offer.original_id
                ),
              }"
              @click="clickFavoriteOffer(offer)"
            ></i>
            <i class="fas fa-file-pdf" @click="clickViewPdf(offer)"></i>
            <div class="actions-more" @click="clickOpenMore">
              <i class="fa fa-chevron-down" v-if="!dropdownIsOpen"></i>
              <i class="fa fa-chevron-up" v-if="dropdownIsOpen"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="region">
        <p class="region_item" v-if="offer.region_name">
          {{ offer.region_name }}
        </p>
        <p v-if="offer.district_name">
          {{ offer.district_name }}
        </p>
        <p v-if="offer.district_moscow_name">
          {{ offer.district_moscow_name }}
        </p>
        <p v-if="offer.direction_name">
          {{ offer.direction_name }}
        </p>
        <p v-if="offer.town_name">
          {{ offer.town_name }}
        </p>
        <p v-if="offer.highway_name">
          {{ offer.highway_name }} <small>шоссе</small>
        </p>
        <p v-if="offer.highway_moscow_name">
          {{ offer.highway_moscow_name }} <small>шоссе</small>
        </p>
        <hr />
        <p v-if="offer.address">
          {{ offer.address }}
        </p>
      </div>
      <div class="from_mkad" sort="from_mkad">
        <!-- {{ offer.gates }} -->
        <p v-if="offer.from_mkad">{{ offer.from_mkad }} <small>км</small></p>
        <p v-else>—</p>
      </div>
      <div class="company">
        <template v-if="offer.company !== null">
          <router-link :to="'/companies/' + offer.company.id" target="_blank">
            {{ offer.company.full_name }}
          </router-link>
          <div class="contact" v-if="offer.company.mainContact">
            {{ offer.company.mainContact.full_name }}
            <a
              :href="'mailto:' + email.email"
              v-for="email of offer.company.mainContact.emails"
              :key="email.email"
              class="d-block"
            >
              {{ email.email }}
            </a>
            <PhoneNumber
              v-for="phone of offer.company.mainContact.phones"
              :key="phone.id"
              :phone="phone"
              :contact="offer.company.mainContact"
            />
          </div>
        </template>
      </div>
      <div class="consultant">
        <p v-if="offer.consultant">
          {{ offer.consultant.userProfile.full_name }}
        </p>
      </div>
      <div class="add">
        <p v-if="offer.ad_realtor">Realtor.ru</p>
        <p v-if="offer.ad_cian">Циан</p>
        <p v-if="offer.ad_yandex">Яндекс</p>
        <p v-if="offer.ad_free">Бесплатные</p>
      </div>
      <div class="date" sort="last_update">
        {{ offer.last_update_format }}
      </div>
      <div class="status" sort="status">
        <h4 class="text-success" v-if="offer.status == 1">Актив</h4>
        <span class="badge badge-warning autosize" v-else> Пассив </span>
      </div>
    </td>
  </Tr>
  <!-- <tr v-if="miniOffersLoader">
    <Loader v-if="miniOffersLoader" class="small center" />
  </tr>
  <DropDown>
    <OfferTableDropdown
      :offer="offer"
      :miniOffers="miniOffers"
      v-if="dropdownIsOpen && !miniOffersLoader"
  /></DropDown> -->
</template>

<script>
// import DropDown from "../../common/DropDown.vue";
// import OfferTableDropdown from "./OfferTableDropdown.vue";
import Tr from "../../common/table/Tr.vue";
import {
  DirectionList,
  DistrictList,
  RegionList,
  TaxFormList,
} from "@/const/Const.js";
import { mapGetters, mapActions } from "vuex";
// import api from "@/api/api";
export default {
  name: "OfferMobileItem",
  components: {
    Tr,
    //   OfferTableDropdown, DropDown
  },
  data() {
    return {
      dropdownIsOpen: false,
      directionList: DirectionList.get("param"),
      districtList: DistrictList.get("param"),
      regionList: RegionList.get("param"),
      taxFormList: TaxFormList,
    };
  },
  props: {
    offer: {
      type: Object,
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

    async clickFavoriteOffer(offer) {
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
    clickOpenMore() {
      if (this.dropdownIsOpen) {
        return (this.dropdownIsOpen = false);
      }
      this.dropdownIsOpen = true;
    },
  },
};
</script>
