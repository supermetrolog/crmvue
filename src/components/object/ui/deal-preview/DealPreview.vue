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
      {{ deal.area ? dealArea : "--" }}
      <span v-if="deal.area" class="DealPreviewCard-price-unit"
        >м<sup>2</sup></span
      >
    </p>
    <p class="DealPreviewCard-price">
      {{ dealPrice }}
      <span v-if="deal.price.value">₽</span>
      <span
        class="DealPreviewCard-price-unit"
        v-if="typePresence"
        v-html="unitTypesList.get(deal.price.type)"
      ></span>
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

<script>
import "./styles.scss";
import { DealTypeList, DealStatusType, UnitTypesList } from "@/const/Const.js";

export default {
  name: "DealPreviewCard",
  props: {
    deal: {
      type: Object,
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
      unitTypesList: UnitTypesList,
      DealStatusType,
    };
  },
  computed: {
    dealType() {
      return this.deal.type ? this.dealTypeList[this.deal.type].label : null;
    },

    dealStatus() {
      switch (this.deal.status) {
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
      if (this.deal.area.includes("-")) {
        return this.$formatter.numberRange(this.deal.area);
      }
      return this.$formatter.number(this.deal.area);
    },
    dealPrice() {
      return this.deal.price.value
        ? this.$formatter.number(this.deal.price.value)
        : "нет данных";
    },
    typePresence() {
      return this.deal.price.type && this.deal.price.value;
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
};
</script>

<style lang="scss" scoped></style>
