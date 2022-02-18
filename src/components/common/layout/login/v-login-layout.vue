<template>
  <div class="login-layout">
    <div class="layout-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "v-login-layout",
  computed: mapGetters(["ERRORS"]),
  mounted() {},
};
</script>

<style>
</style>