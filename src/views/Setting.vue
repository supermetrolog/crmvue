<template>
  <div class="setting">
    <h1>SETTING</h1>
    <button class="btn btn-danger" @click="clickLogout">Выйти</button>
  </div>
</template>

<script>
export default {
  name: "Setting",
  methods: {
    async clickLogout() {
      await this.$store.dispatch("LOGOUT");
      this.$router.push("/");
    },
  },
};
</script>
