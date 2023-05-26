<template>
  <div class="deal-info">
    <deal-info-header :company="company" :consultant="consultant" />
    <div class="deal-info__body">
      <div class="deal-info__content">
        <deal-detailed-info />
      </div>
      <div class="deal-info__aside"></div>
    </div>
  </div>
</template>

<script>
import DealDetailedInfo from "./deal-detailed-info/DealDetailedInfo.vue";
import DealInfoHeader from "./deal-info-header/DealInfoHeader.vue";

export default {
  name: "DealInfo",
  components: {
    DealInfoHeader,
    DealDetailedInfo,
  },
  props: {},
  data() {
    return {
      company: {
        name: "BTS",
        duration: "36 мес.",
        projectAvailability: true,
      },
      consultant: {
        name: "Артур Мандрыка",
        visitType: "Личное посещение",
      },
    };
  },
};
</script>

<style lang="scss" src="./DealInfo.scss"></style>
