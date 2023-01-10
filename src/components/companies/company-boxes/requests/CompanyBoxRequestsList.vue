<template>
  <div class="CompanyBoxRequestsList">
    <CompanyBoxRequestsListItem
      v-for="request of requests"
      :key="request.id"
      :request="request"
      @clickUpdateRequest="clickUpdateRequest(request)"
      @clickCloneRequest="clickCloneRequest(request)"
      @clickDeleteRequest="clickDeleteRequest(request)"
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
      default: () => [],
    },
  },
  methods: {
    clickUpdateRequest(request) {
      this.$emit("clickUpdateRequest", request);
    },
    clickCloneRequest(request) {
      this.$emit("clickCloneRequest", request);
    },
    clickDeleteRequest(request) {
      this.$emit("clickDeleteRequest", request);
    },
  },
};
</script>