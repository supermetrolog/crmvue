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
      <span
        v-if="deal.area"
        class="DealPreviewCard-price-unit"
        v-html="unitTypesList.get(1)"
      ></span>
    </p>
    <p class="DealPreviewCard-price">
      {{
        deal.price.value
          ? formatterObject.number(deal.price.value)
          : "нет данных"
      }}
      <span v-if="deal.price.value" v-html="unitTypesList.get(9)"></span>
      <span
        class="DealPreviewCard-price-unit"
        v-if="deal.price.type && deal.price.value"
        v-html="unitTypesList.get(deal.price.type)"
      ></span>
    </p>
    <p
      class="DealPreviewCard-status"
      :class="{
        success: deal.status === 1,
        danger: deal.status === 2 || deal.status === 3,
      }"
    >
      {{ dealStatus }}
    </p>
    <div class="DealPreviewCard-triangle"></div>
  </div>
</template>

<script>
import "./styles.scss";
import { DealTypeList, UnitTypesList } from "@/const/Const.js";
import { formatterObject } from "@/plugins";

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
      formatterObject: formatterObject,
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
        return this.formatterObject.numberRange(this.deal.area);
      }
      return this.formatterObject.number(this.deal.area);
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
