<template>
  <div class="DealItem">
    <DealFloors :floors="deal.floors" />
  </div>
</template>

<script>
import DealFloors from "./floors/DealFloors.vue";
import "./styles.scss";

export default {
  name: "DealItem",
  components: { DealFloors },
  props: {
    deal: {
      type: Object,
      required: true,
    },
  },
};
</script>
