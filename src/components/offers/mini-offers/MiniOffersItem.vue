<template>
  <Tr :class="{ 'MiniOffersItem-archive': offer.status === 2 }">
    <Td>#</Td>
    <Td>{{ offer.visual_id }}</Td>
    <Td>{{ offer.calc_floors }}</Td>
    <Td><div v-html="offersArea" /></Td>
    <Td>{{ heightHandler }}</Td>
    <Td>{{ offer.floor_type }}</Td>
    <Td>{{ gateHandler }}</Td>
    <Td>{{ tempHandler }}</Td>
    <Td><div v-html="generalPrice" /></Td>
    <Td
      ><div class="MiniOffersItem-actions" v-if="offer.status !== 2">
        <div class="MiniOffersItem-actions-item">
          <i
            class="fas fa-star"
            :class="{
              selected: true,
            }"
          ></i>
        </div>
        <div class="MiniOffersItem-actions-item">
          <i
            style="color: blue"
            class="fas fa-rocket"
            title="Циан"
            v-if="offer.ad_cian"
          ></i>
        </div>
        <div class="MiniOffersItem-actions-item">
          <i
            style="color: green"
            class="fas fa-rocket"
            title="Яндекс"
            v-if="offer.ad_yandex"
          ></i>
        </div>
        <div
          class="MiniOffersItem-actions-item MiniOffersItem-actions-item_avito"
        >
          <button
            class="MiniOffersItem-actions-toggler"
            :class="{
              'MiniOffersItem-actions-toggler__active': offer.ad_avito === 1,
              'MiniOffersItem-actions-toggler__loading': avitoLoading,
            }"
            :disabled="avitoLoading"
            @click="handleClickAvito"
            title="Авито"
          >
            <div class="MiniOffersItem-actions-toggler-circle"></div>
          </button>
        </div></div
    ></Td>
  </Tr>
</template>

<script>
import Tr from "@/components/common/table/Tr.vue";
import Td from "@/components/common/table/Td";
import { mapActions } from "vuex";

export default {
  name: "MiniOffersItem",
  components: {
    Td,
    Tr,
  },
  // emits: ["toggle-avito"],
  data() {
    return {
      avitoLoading: false,
    };
  },
  props: {
    offer: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    offersArea() {
      return `<span>${this.offer.calc_area_general} м<sup>2</sup></span>`;
    },
    gateHandler() {
      return `${this.offer.gate_num} шт/${this.offer.gate_type}`;
    },
    tempHandler() {
      let condition = "Холодный";
      let tempDelta = "";
      if (this.offer.heated) {
        condition = "Теплый";
      }
      if (this.offer.temperature_min && this.offer.temperature_max) {
        tempDelta = `${this.offer.temperature_min} - ${this.offer.temperature_max} град`;
      }
      return `${condition} ${tempDelta}`;
    },
    heightHandler() {
      if (this.offer.ceiling_height_min == this.offer.ceiling_height_max) {
        return `${this.offer.ceiling_height_min} м.`;
      } else {
        return `${this.offer.ceiling_height_min} - ${this.offer.ceiling_height_max} м.`;
      }
    },
    generalPrice() {
      if (this.offer.deal_type === 2) {
        return `<span>${this.offer.calc_price_general} <small>руб</small></span>`;
      } else {
        return `<span>${this.offer.calc_price_general} <small>руб за м<sup>2</sup>/год</small></span>`;
      }
    },
  },
  methods: {
    ...mapActions(["TOGGLE_AVITO_AD"]),
    async handleClickAvito() {
      if (!this.avitoLoading) {
        this.avitoLoading = true;
        const status = await this.TOGGLE_AVITO_AD(this.offer.original_id);
        if (status) {
          this.$emit("toggleAvito");
        }
        this.avitoLoading = false;
      }
    },
  },
  mounted() {},
};
</script>
