<template>
  <div class="no-data">
    <div class="no-data-container">
      <h1 class="text-center"><span>нет данных</span></h1>
      <img :src="src" alt="нет данных" @mousedown.prevent />
    </div>
  </div>
</template>

<script>
export default {
  name: "NoData",
  computed: {
    randomNumber() {
      return Math.floor(Math.random() * (52 - 1 + 1)) + 1;
    },
    src() {
      return this.$apiUrlHelper.getImageUrl(this.randomNumber + ".jpg");
    },
  },
};
</script>

<style>
</style>