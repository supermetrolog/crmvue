<template>
  <Tr
    class="OfferTableRow"
    :class="{
      passive: offer.status != 1,
      'OfferTableRow-odd': odd,
      'OfferTableRow-even': !odd,
    }"
  >
    <Td class="id" :class="{ passive: offer.status != 1 }">
      <p>
        {{ offer.visual_id }}
      </p>
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
          <!-- <button class="actions-more-btn" @click="clickOpenMore">
            Подробнее
          </button> -->
          <i class="fa fa-chevron-down" v-if="!dropdownIsOpen"></i>
          <i class="fa fa-chevron-up" v-if="dropdownIsOpen"></i>
        </div>
      </div>
    </Td>
    <Td class="photo">
      <a :href="getOfferUrl(offer)" target="_blank">
        <div class="image-container">
          <img :src="offer.thumb" alt="image" />
          <span class="deal_type" :class="{ passive: offer.status != 1 }">
            {{ offer.deal_type_name }}
          </span>
          <span class="object_class">
            {{ offer.class_name }}
          </span>
          <span class="test_only" v-if="offer.test_only"> Тестовый лот </span>
        </div>
      </a>
    </Td>
    <Td class="region">
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
    </Td>
    <Td class="from_mkad" sort="from_mkad">
      <!-- {{ offer.gates }} -->
      <p v-if="offer.from_mkad">{{ offer.from_mkad }} <small>км</small></p>
      <p v-else>—</p>
    </Td>
    <Td class="area" sort="area">
      <p>
        {{ offer.calc_area_general }}
        <small>м<sup>2</sup></small>
      </p>
    </Td>
    <Td class="price" sort="price">
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
      <span v-if="offer.offer && offer.offer.tax_form">
        {{
          taxFormList.find((item) => item.value == offer.offer.tax_form).label
        }}
      </span>
    </Td>
    <Td class="company_about">
      <template v-if="offer.company !== null">
        <router-link :to="'/companies/' + offer.company.id" target="_blank">
          {{ offer.company.full_name }}
        </router-link>
        <div class="contact" v-if="this.contact">
          {{ this.contact.full_name }}
          <a
            :href="'mailto:' + email.email"
            v-for="email of this.contact.emails"
            :key="email.email"
            class="d-block"
          >
            {{ email.email }}
          </a>
          <PhoneNumber
            v-for="phone of this.contact.phones"
            :key="phone.id"
            :phone="phone"
            :contact="this.contact"
          />
        </div>
      </template>
    </Td>
    <Td class="consultant">
      <p v-if="offer.consultant">
        {{ offer.consultant.userProfile.full_name }}
      </p>
    </Td>
    <Td class="add">
      <p v-if="offer.ad_realtor">Realtor.ru</p>
      <p v-if="offer.ad_cian">Циан</p>
      <p v-if="offer.ad_yandex">Яндекс</p>
      <p v-if="offer.ad_free">Бесплатные</p>
    </Td>
    <Td class="date" sort="last_update">
      {{ offer.last_update_format }}
    </Td>
    <Td class="status" sort="status">
      <h4 class="text-success" v-if="offer.status == 1">Актив</h4>
      <span class="badge badge-warning autosize" v-else> Пассив </span>
    </Td>
  </Tr>
  <tr v-if="miniOffersLoader">
    <Loader v-if="miniOffersLoader" class="small center" />
  </tr>
  <DropDown>
    <OfferTableDropdown
      :offer="offer"
      :miniOffers="miniOffers"
      v-if="dropdownIsOpen && !miniOffersLoader"
  /></DropDown>
</template>

<script>
import DropDown from "../../common/DropDown.vue";
import OfferTableDropdown from "./OfferTableDropdown.vue";
import Td from "../../common/table/Td.vue";
import Tr from "../../common/table/Tr.vue";
import api from "@/api/api";
import { MixinOfferItem } from "../mixins";

export default {
  mixins: [MixinOfferItem],
  name: "OfferTableItem",
  components: { Tr, Td, OfferTableDropdown, DropDown },
  data() {
    return {
      miniOffers: [],
      miniOffersLoader: false,
    };
  },
  props: {
    offer: {
      type: Object,
    },
    loader: {
      type: Boolean,
      default: false,
    },
    sortable: {
      type: Boolean,
      default: true,
    },
    odd: {
      type: Boolean,
    },
  },

  methods: {
    async clickOpenMore() {
      if (this.dropdownIsOpen) {
        return (this.dropdownIsOpen = false);
      }
      this.dropdownIsOpen = true;
      this.miniOffersLoader = true;
      let response = await api.offers.search({
        type_id: [1],
        status: 3, // Нужно чтобы прилетали и активные и пассивные
        object_id: this.offer.object_id,
      });
      if (response) {
        this.miniOffers = response.data;
      }
      this.miniOffersLoader = false;
    },
  },
};
</script>
