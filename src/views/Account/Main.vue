<template>
  <div class="account-main">
    <div class="row">
      {{ THIS_USER.userProfile.full_name }}
      <div class="col-12">
        <button class="btn btn-danger" @click="clickLogout">Выйти</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AccountMain",
  computed: {
    ...mapGetters(["THIS_USER"]),
  },
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