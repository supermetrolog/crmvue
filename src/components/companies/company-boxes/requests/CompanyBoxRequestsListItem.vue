<template>
  <div class="CompanyBoxRequestsListItem">
    {{ request.id }}
  </div>
</template>

<script>
export default {
  name: "CompanyBoxRequestsListItem",
  components: {},
  props: {
    request: {
      type: Object,
      default: () => {},
    },
  },
};
</script>