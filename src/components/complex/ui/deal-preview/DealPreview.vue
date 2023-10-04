<template>
  <div
    class="DealPreviewCard"
    :class="{ active: isCurrent }"
    @click="onChooseDeal"
  >
    <button v-if="isCurrent" class="DealPreviewCard-edit">
      <i class="fas fa-pen"></i>
    </button>
    <span class="DealPreviewCard-type">{{ dealType }}</span>
    <p class="DealPreviewCard-company">{{ deal.company?.name || "--" }}</p>
    <p class="DealPreviewCard-area">
      {{ dealArea }}
      <span v-if="deal.area" class="DealPreviewCard-price-unit"
        >м<sup>2</sup></span
      >
    </p>
    <p class="DealPreviewCard-price">
      <with-unit-type :value="dealPrice" :unit-type="deal.price?.unitType" />
    </p>
    <p
      class="DealPreviewCard-status"
      :class="{
        success: deal.status === DealStatusType.FOR_RENT,
        danger:
          deal.status === DealStatusType.RENTED_OUT ||
          deal.status === DealStatusType.SOLD_OUT,
      }"
    >
      {{ dealStatus }}
    </p>
    <div class="DealPreviewCard-triangle"></div>
  </div>
</template>

<script lang="ts">
import { unitTypes } from "./../../../../const/unitTypes";
import "./styles.scss";
import { DealTypeList, DealStatusType } from "./../../../../const/Const.js";
import { defineComponent, PropType } from "vue";
import WithUnitType from "./../../../../components/common/with-unit-type/WithUnitType.vue";
import { IDeal } from "./../../../../interfaces/deal.interface";

export default defineComponent({
  name: "DealPreviewCard",
  components: {
    WithUnitType,
  },
  props: {
    deal: {
      type: Object as PropType<IDeal>,
      required: true,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dealTypeList: DealTypeList.get("param"),
      DealStatusType,
      unitTypes,
    };
  },
  computed: {
    dealType() {
      return this.deal.type ? this.dealTypeList![this.deal.type].label : null;
    },

    dealStatus() {
      type dealStatus = 1|2|3

      switch (this.deal.status as dealStatus) {
        case 1:
          return "Сдается";
        
        case 2:
          return "Сдано";
        
        case 3:
          return "Продано";
        
        default:
          return "Неизвестно";
          
      }
    },
    dealArea() {
      const area = this.deal.area;
      if (area && area.valueMin !== undefined && area.valueMax !== undefined)
        return this.$formatter.numberOrRangeNew(area.valueMin, area.valueMax);
      return "--";
    },
    dealPrice() {
      const price = this.deal.price;
      if (price && price.valueMin !== undefined && price.valueMax !== undefined)
        return this.$formatter.numberOrRangeNew(price.valueMin, price.valueMax);
      return "нет данных";
    },
    typePresence() {
      return this.deal.price?.type && this.deal.price?.valueMin;
    },
  },
  methods: {
    onChooseDeal() {
      this.$emit("choose", this.deal.id);
    },
    onClickEdit() {
      this.$emit("edit");
    },
  },
  emits: ["choose", "edit"],
});
</script>

<style lang="scss" scoped></style>
