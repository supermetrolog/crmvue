<template>
  <CompanyBoxLayout class="CompanyBoxObjects" :class="'grid-c'">
    <template #header>
      <div class="CompanyBoxObjects-header">
        <span>ОБЪЕКТЫ ({{ objects.length }}), АРЕНДАТОРЫ (ХЗ)</span>
      </div>
    </template>
    <template #content>
      <CompanyBoxObjectsList :objects="objects" />
      <NoData v-if="!objects.length" />
    </template>
  </CompanyBoxLayout>
</template>

<script>
import CompanyBoxObjectsList from "./CompanyBoxObjectsList.vue";
import NoData from "../../../common/NoData.vue";
import CompanyBoxLayout from "../CompanyBoxLayout.vue";
export default {
  name: "CompanyBoxObjects",
  components: { CompanyBoxLayout, NoData, CompanyBoxObjectsList },
  props: {
    objects: {
      type: Array,
      default: () => [{}],
    },
  },
};
</script>