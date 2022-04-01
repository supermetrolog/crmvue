<template>
  <div class="company-objects-list row no-gutters">
    <CompanyObjectItem
      class="mb-2"
      v-for="object of objects"
      :key="object.id"
      :object="object"
    />
  </div>
</template>

<script>
import CompanyObjectItem from "./CompanyObjectItem";
export default {
  name: "CompanyObjectsList",
  components: {
    CompanyObjectItem,
  },
  props: {
    objects: {
      type: Array,
    },
  },
};
</script>

<style>
</style>