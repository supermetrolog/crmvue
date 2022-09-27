<template>
  <Tr>
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
      ><div class="MiniOffersItem-actions">
        <div
          class="MiniOffersItem-actions-item"
          @click="clickFavoriteOffer(offer)"
        >
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
            :class="{
              selected: true,
            }"
            @click="clickFavoriteOffer(offer)"
          ></i>
        </div>
        <div class="MiniOffersItem-actions-item">
          <i
            style="color: green"
            class="fas fa-rocket"
            :class="{
              selected: true,
            }"
            @click="clickFavoriteOffer(offer)"
          ></i>
        </div></div
    ></Td>
  </Tr>
</template>

<script>
import Tr from "../../common/table/Tr.vue";
import Td from "@/components/common/table/Td";

export default {
  name: "MiniOffersItem",
  components: {
    Td,
    Tr,
  },
  data() {
    return {};
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
  methods: {},
  mounted() {},
};
</script>