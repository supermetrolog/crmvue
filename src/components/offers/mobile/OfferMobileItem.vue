<template>
  <Tr
    class="OfferMobileItem"
    :class="{
      passive: offer.status != 1,
    }"
  >
    <td colspan="2" class="OfferMobileItem-wrapper">
      <div class="photo">
        <a :href="getOfferUrl(offer)" target="_blank">
          <div class="image-container">
            <img :src="offer.thumb" alt="image" />
            <span class="deal_type" v-if="offer.status == 1">
              {{ offer.deal_type_name }}
            </span>
            <span class="deal_type" v-else>Пассив</span>
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
            <div v-html="priceHandler" />
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
    </td>
  </Tr>
  <DropDown>
    <tr class="OfferMobileItem-dropdown" v-if="dropdownIsOpen">
      <td colspan="2" class="container">
        <!-- <span @click="isVisibleMain = !isVisibleMain">Основное</span> -->
        <div class="column">
          <div class="region">
            <p v-if="offer.district_moscow_name">
              Москва, {{ offer.district_moscow_name }}
            </p>
            <p v-if="offer.direction_name">
              {{ offer.direction_name }}
            </p>
            <p v-if="offer.highway_name">{{ offer.highway_name }} шоссе</p>
            <p v-if="offer.highway_moscow_name">
              {{ offer.highway_moscow_name }} шоссе
            </p>
            <hr />
            <div>
              <strong class="label">Адрес</strong>
              <br />
              <a
                :href="`https://yandex.ru/maps/?pt=${offer.longitude},${offer.latitude}&z=12&l=map`"
                v-if="offer.address"
                >{{ offer.address }}</a
              >
            </div>
          </div>
          <div class="from_mkad" sort="from_mkad">
            <p v-if="offer.from_mkad">
              {{ offer.from_mkad }} <small>км от МКАД</small>
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
              <br />
              <strong class="label">Контакты</strong>
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
          </div>
          <div class="consultant">
            <strong class="label">Консультант</strong>
            <p v-if="offer.consultant">
              {{ offer.consultant.userProfile.full_name }}
            </p>
          </div>

          <div class="add">
            <strong class="label">Реклама</strong>
            <p v-if="offer.ad_realtor">Realtor.ru</p>
            <p v-if="offer.ad_cian">Циан</p>
            <p v-if="offer.ad_yandex">Яндекс</p>
            <p v-if="offer.ad_free">Бесплатные</p>
          </div>
          <strong class="label">Последняя активность</strong>
          <div class="date" sort="last_update">
            {{ offer.last_update_format }}
          </div>
        </div>
      </td>
    </tr>
  </DropDown>
</template>

<script>
import DropDown from "../../common/DropDown.vue";

import Tr from "../../common/table/Tr.vue";
import { MixinOfferItem } from "../mixins";
export default {
  mixins: [MixinOfferItem],
  name: "OfferMobileItem",
  components: {
    Tr,
    DropDown,
  },
  data() {
    return {
      isVisibleMain: false,
    };
  },
  computed: {
    priceHandler() {
      let result;
      if (this.offer.deal_type == 1 || this.offer.deal_type == 4) {
        result = `${this.offer.calc_price_warehouse} <small>руб за м<sup>2</sup>/г</small>`;
      }
      if (this.offer.deal_type == 2) {
        result = `${this.offer.calc_price_sale} <small>руб за м<sup>2</sup></small>`;
      }
      if (this.offer.deal_type == 3) {
        result = `${this.offer.calc_price_safe_pallet} <small>руб за 1 п. м.</small>`;
      }
      if (!this.offer.deal_type) {
        result = "Цена не указана";
      }
      if (this.offer.generalOffersMix?.offer.tax_form) {
        result =
          result +
          " " +
          `<small class="tax-form">${
            this.taxFormList.find(
              (item) => item.value == this.offer.generalOffersMix.offer.tax_form
            ).label
          }</small>`;
      }

      return `<p>${result}</p>`;
    },
  },
  methods: {
    clickOpenMore() {
      if (this.dropdownIsOpen) {
        return (this.dropdownIsOpen = false);
      }
      this.dropdownIsOpen = true;
    },
  },
};
</script>
