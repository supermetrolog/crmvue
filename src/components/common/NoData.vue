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
      if (process.env.NODE_ENV == "development") {
        return "http://crmka/images/" + this.randomNumber + ".jpg";
      } else {
        return (
          "http://api.billypro.beget.tech/images/" + this.randomNumber + ".jpg"
        );
      }
    },
  },
};
</script>

<style>
</style>