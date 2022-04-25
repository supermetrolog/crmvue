<template>
  <div class="px-2" :class="col">
    <div
      class="object-offer only"
      :class="[
        {
          passive: offer.status != 1,
          general: offer.type_id == 2,
          selected: isSelected,
        },
        classList,
      ]"
    >
      <div class="row no-gutters object-info">
        <div class="col-12 align-self-center">
          <div class="image-container">
            <div class="params">
              <span>{{ offer.deal_type_name }} </span>
              <span class="object_class">
                {{ offer.class_name }}
              </span>
              <span
                class="duplicate_count"
                title="количество отправлений"
                v-if="offer.duplicate_count > 1"
              >
                {{ offer.duplicate_count }}
              </span>
            </div>
            <span class="visual_id">
              {{ offer.visual_id }}
            </span>
            <span
              class="badge badge-secondary isGeneral"
              v-if="offer.type_id == 2"
              >Общий</span
            >
            <span class="badge badge-info isGeneral" v-else>Блок</span>
            <a href="#" @click.prevent="clickSelectObject">
              <img :src="imageSrc" alt="image" />
            </a>
            <div class="icon-unselect" @click.prevent="clickUnSelectObject">
              <i class="fas fa-check"></i>
            </div>
          </div>
        </div>
        <div class="col-12 main text-center">
          <span class="badge badge-warning" v-if="offer.status != 1"
            >Пассив</span
          >
          <div class="location">
            <p v-if="offer.district_name">
              {{ offer.district_name }}
            </p>
            <p
              class="region_item"
              v-if="offer.region_name && offer.district_moscow_name"
            >
              {{ offer.region_name }}
            </p>
            —
            <p v-if="offer.district_moscow_name">
              {{ offer.district_moscow_name }}
            </p>
            <p v-if="offer.direction_name && offer.district_moscow_name">
              — {{ offer.direction_name }}
            </p>
            <p v-if="offer.direction_name && !offer.district_moscow_name">
              {{ offer.direction_name }}
            </p>
          </div>
          <div class="object_type">
            <p>
              {{ offer.object_type_name }}
            </p>
          </div>
          <div class="price">
            <i class="fas fa-ruble-sign"></i>
            <p class="value" v-if="offer.deal_type == 1">
              {{ offer.calc_price_general }}
              <small>руб за м<sup>2</sup>/г</small>
            </p>
            <p class="value" v-if="offer.deal_type == 2">
              {{ offer.calc_price_sale }} <small>руб за м<sup>2</sup></small>
            </p>
            <p class="value" v-if="offer.deal_type == 3">
              {{ offer.calc_price_safe_pallet }} <small>руб за 1 п. м.</small>
            </p>
            <small class="tax">
              {{ taxForm }}
            </small>
          </div>
          <div class="area">
            <i class="fas fa-square-full"></i>
            <p>
              {{ offer.calc_area_general }}
              <small>м<sup>2</sup></small>
            </p>
          </div>
          <div class="extraVisible" @click="toggleExtraInfoVisible">
            <i
              class="far fa-arrow-alt-circle-down text-center mt-1 extra"
              v-if="!extraInfoVisible"
            ></i>
            <i
              class="far fa-arrow-alt-circle-up text-center mt-1 extra"
              v-if="extraInfoVisible"
            ></i>
          </div>
        </div>
        <div class="col-12 text-center" v-if="extraInfoVisible">
          <div class="params">
            <div class="params__item">
              <p class="title">Площадь объекта:</p>
              <p class="value">
                {{ $formatter.number(offer.area_building) }}
                <small> м<sup>2</sup></small>
              </p>
            </div>
            <div class="params__item">
              <p class="title">Этажи:</p>
              <p class="value">{{ offer.calc_floors }}</p>
            </div>
            <div class="params__item">
              <p class="title">Потолки:</p>
              <p class="value">
                {{ offer.calc_ceilingHeight }} <small>м</small>
              </p>
            </div>
            <div class="params__item">
              <p class="title">Электричество:</p>
              <p class="value">
                {{ $formatter.number(offer.power_value) }} <small>кВт</small>
              </p>
            </div>
            <div class="params__item">
              <p class="title">Тип ворот:</p>
              <p class="value">{{ offer.gate_type }}</p>
            </div>
            <div class="params__item">
              <p class="title">Отапливаемый:</p>
              <p class="value">{{ offer.heated ? "да" : "нет" }}</p>
            </div>
            <div class="params__item">
              <p class="title">Антипыль:</p>
              <p class="value">{{ offer.self_leveling ? "да" : "нет" }}</p>
            </div>
            <div class="params__item">
              <p class="title">Краны:</p>
              <p class="value">{{ offer.has_cranes ? "да" : "нет" }}</p>
            </div>
            <div class="params__item">
              <p class="title">От МКАД:</p>
              <p class="value">{{ offer.from_mkad }} <small>км</small></p>
            </div>
          </div>

          <div class="address">
            <p class="title">Адрес</p>
            <p>{{ offer.address }}</p>
          </div>
          <div class="description">
            <p class="title">Ручное описание</p>
            <p>
              {{ offer.object.description || "—" }}
            </p>
          </div>
          <div class="description-auto">
            <p class="title">Авто описание</p>
            <p>
              {{ offer.object.description_auto || "—" }}
            </p>
          </div>
          <div class="links">
            <p>
              <a :href="offerUrl" target="_blank"> Подробнее </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TaxFormList } from "@/const/Const.js";
export default {
  name: "CompanyObjectItemOffer",
  data() {
    return {
      taxFormList: TaxFormList,
      extraInfoVisible: false,
    };
  },
  props: {
    offer: {
      type: Object,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    classList: {
      type: String,
      default() {
        return "";
      },
    },
    col: {
      type: String,
      default() {
        return "col-4";
      },
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    imageSrc() {
      const photos = this.offer.photos;
      if (photos && Array.isArray(photos) && photos[0].length > 2) {
        return "https://pennylane.pro" + photos[0];
      }
      return "http://crmka/uploads/1.jpg";
    },
    offerUrl() {
      const baseUrl = "https://pennylane.pro/complex/";
      let url = baseUrl + this.offer.complex_id;
      if (this.offer.generalOffersMix) {
        url += "?offer_id=[" + this.offer.generalOffersMix.original_id + "]";
      } else {
        url += "?offer_id=[" + this.offer.original_id + "]";
      }
      return url;
    },

    taxForm() {
      // console.log(!!this.offer.generalOffersMix);
      // if (!this.offer.generalOffersMix) {
      //   console.log(this.offer.visual_id);
      // }
      if (
        this.offer.generalOffersMix &&
        this.offer.generalOffersMix.offer &&
        this.offer.generalOffersMix.offer.tax_form
      ) {
        return TaxFormList.find(
          (item) => item.value == this.offer.generalOffersMix.offer.tax_form
        ).label;
      }

      return null;
    },
  },
  methods: {
    toggleExtraInfoVisible() {
      this.extraInfoVisible = !this.extraInfoVisible;
    },
    clickSelectObject() {
      if (this.disabled) return;
      this.$emit("select", this.offer);
      // setTimeout(() => {
      //   this.$refs.comment.focus();
      // });
    },
    clickUnSelectObject() {
      this.$emit("unSelect", this.offer);
    },
    enterTextarea() {
      this.$refs.comment.blur();
    },
    unfocusTextarea() {
      this.$emit("addComment", this.offer, this.localComment);
    },
  },
  emits: ["select", "unSelect", "addComment"],
};
</script>

<style>
</style>