<template>
  <h1>Personal</h1>
</template>

<script>
export default {
  name: "Personal",
  mounted() {
    console.log(this.$route.params.mod);
  },
};
</script>
