<template>
  <div class="CompanyBoxRequestsList">
    <CompanyBoxRequestsListItem
      v-for="request of requests"
      :key="request.id"
      :request="request"
    />
  </div>
</template>

<script>
import CompanyBoxRequestsListItem from "./CompanyBoxRequestsListItem.vue";
export default {
  name: "CompanyBoxRequestsList",
  components: { CompanyBoxRequestsListItem },
  props: {
    requests: {
      type: Array,
      default: () => [{}],
    },
  },
};
</script>