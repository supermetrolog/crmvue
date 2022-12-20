<template>
  <CompanyBoxLayout class="CompanyBoxServices" :class="'grid-e'">
    <template #header>
      <div class="CompanyBoxServices-header">
        <span>УСЛУГИ ({{ services.length }})</span>
      </div>
    </template>
    <template #content>
      <NoData v-if="!services.length" />
    </template>
  </CompanyBoxLayout>
</template>

<script>
import NoData from "../../../common/NoData.vue";
import CompanyBoxLayout from "../CompanyBoxLayout.vue";
export default {
  name: "CompanyBoxServices",
  components: { CompanyBoxLayout, NoData },
  props: {
    services: {
      type: Array,
      default: () => [],
    },
  },
};
</script>