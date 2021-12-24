<template>
  <div class="account-main">
    <h1>Main</h1>
    <div class="row">
      <div class="col-12">
        <button class="btn btn-danger" @click="clickLogout">Выйти</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountMain",
  methods: {
    async clickLogout() {
      await this.$store.dispatch("LOGOUT");
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>