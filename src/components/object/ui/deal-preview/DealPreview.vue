<template>
  <div
    class="DealPreviewCard"
    :class="{ active: isCurrent }"
    @click="onChooseDeal"
  >
    <span class="DealPreviewCard-type">{{ dealType }}</span>
    <span class="DealPreviewCard-company">{{
      deal.company?.name || "--"
    }}</span>
    <span class="DealPreviewCard-area">{{ deal.area || "--" }}</span>
    <span class="DealPreviewCard-price"
      >{{ deal.price.count }} {{ deal.price.type }}</span
    >
    <span
      class="DealPreviewCard-status"
      :class="{
        success: deal.status === 1,
        danger: deal.status === 2 || deal.status === 3,
      }"
      >{{ dealStatus }}</span
    >
  </div>
</template>

<script>
import "./styles.scss";
import { DealTypeList } from "@/const/Const.js";

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
