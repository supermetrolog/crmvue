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

            <a href="#" @click.prevent="clickSelectObject">
              <img :src="imageSrc" alt="image" />
            </a>
            <div class="icon-unselect" @click.prevent="clickUnSelectObject">
              <i class="fas fa-check"></i>
            </div>
          </div>
        </div>
        <div class="col-12 desc">
          <div class="item__title">
            <p>ID-{{ offer.object_id }}</p>
            <p>{{ $formatter.number(offer.area_building) }} м<sup>2</sup></p>
            <span class="badge badge-warning" v-if="offer.type_id == 2"
              >Общий</span
            >
            <span class="badge badge-info" v-else>Блок</span>
          </div>
          <div class="address">
            <p>{{ offer.address }}</p>
          </div>
          <div class="params">
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
          <div class="description">
            <p class="title">Ручное описание</p>
            {{ offer.object.description || "—" }}
          </div>
          <div class="description-auto">
            <p class="title">Авто описание</p>
            {{ offer.object.description_auto || "—" }}
          </div>
          <div class="links">
            <p>
              <a :href="offerUrl" target="_blank"> Подробнее </a>
            </p>
          </div>
        </div>
      </div>
      <div class="offer-info">
        <div class="row no-gutters">
          <div class="col-12 text-center">
            <span class="object-offer__visual_id">{{ offer.visual_id }}</span>
          </div>
        </div>

        <div class="row no-gutters">
          <div class="col-6 object-offer__area">
            <div class="row no-gutters">
              <div class="col-12">
                <p class="d-inline">S предложения</p>
                <h5 class="d-inline ml-2 text-info">
                  {{ offer.calc_area_general }} <small>м<sup>2</sup></small>
                </h5>
              </div>
            </div>
            <div class="row no-gutters">
              <div class="col-7"><p>S - складская</p></div>
              <div class="col-5">
                <p>
                  {{ offer.calc_area_warehouse }} <small>м<sup>2</sup></small>
                </p>
              </div>
            </div>
            <div class="row no-gutters">
              <div class="col-7"><p>S - пола</p></div>
              <div class="col-5">
                <p>
                  {{ offer.calc_area_floor }} <small>м<sup>2</sup></small>
                </p>
              </div>
            </div>
            <div class="row no-gutters">
              <div class="col-7"><p>S - мезонина</p></div>
              <div class="col-5">
                <p>
                  {{ offer.calc_area_mezzanine }} <small>м<sup>2</sup></small>
                </p>
              </div>
            </div>
            <div class="row no-gutters">
              <div class="col-7"><p>S - офисов</p></div>
              <div class="col-5">
                <p>
                  {{ offer.calc_area_office }} <small>м<sup>2</sup></small>
                </p>
              </div>
            </div>
            <div class="row no-gutters">
              <div class="col-7"><p>S - тех</p></div>
              <div class="col-5">
                <p>
                  {{ offer.calc_area_tech }} <small>м<sup>2</sup></small>
                </p>
              </div>
            </div>
          </div>
          <div class="col-6 object-offer__price">
            <div class="row no-gutters">
              <div class="col-12">
                <p class="d-inline">E предложения</p>
                <h5 class="d-inline ml-2 text-info">
                  {{ offer.calc_price_general }}
                  <small>руб</small>
                </h5>
              </div>
            </div>
            <div class="row no-gutters">
              <div class="col-7"><p>E - складская</p></div>
              <div class="col-5">
                <p>
                  {{ offer.calc_price_warehouse
                  }}<small> руб/м<sup>2</sup> год</small>
                </p>
              </div>
            </div>
            <div class="row no-gutters">
              <div class="col-7"><p>E - пола</p></div>
              <div class="col-5">
                <p>
                  {{ offer.calc_price_floor }}
                  <small>руб/м<sup>2</sup> год</small>
                </p>
              </div>
            </div>
            <div class="row no-gutters">
              <div class="col-7"><p>E - мезонин 1 ур</p></div>
              <div class="col-5">
                <p>
                  {{ offer.calc_price_mezzanine }}
                  <small>руб/м<sup>2</sup> год</small>
                </p>
              </div>
            </div>
            <div class="row no-gutters">
              <div class="col-7"><p>E - офисов</p></div>
              <div class="col-5">
                <p>
                  {{ offer.calc_price_office }}
                  <small>руб/м<sup>2</sup> год</small>
                </p>
              </div>
            </div>
            <div class="row no-gutters">
              <div class="col-7">
                <p>
                  Цена за м<small><sup>2</sup></small>
                </p>
              </div>
              <div class="col-5">
                <p>
                  {{ offer.calc_price_sale }}
                  <small>руб/м<sup>2</sup></small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyObjectItemOffer",
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