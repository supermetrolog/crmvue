<template>
  <div class="account-main">
    <div class="row">
      <p v-if="THIS_USER">
        {{ THIS_USER.userProfile.full_name }}
      </p>
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