<template>
  <div class="companies">
    <h1>Companies</h1>

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
    console.log(this.$route.params.mod);
  },
};
</script>
