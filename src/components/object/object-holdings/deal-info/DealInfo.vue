<template>
  <div class="deal-info">
    <deal-info-header :company="company" :consultant="consultant" />
  </div>
</template>

<script>
import DealInfoHeader from "./deal-info-header/DealInfoHeader.vue";

export default {
  name: "DealInfo",
  components: {
    DealInfoHeader,
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
