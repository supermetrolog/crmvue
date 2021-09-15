<template>
  <div class="companies">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "Companies",
  components: {
    // Table,
    // Timeline,
  },
  mounted() {
    // console.log(this.$route.params.mod);
  },
};
</script>
