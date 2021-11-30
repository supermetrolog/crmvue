<template>
  <notifications position="bottom right" group="app" />
  <component :is="layout"> </component>
</template>

<script>
import vEmptyLayout from "./components/layout/empty/v-empty-layout";
import vMainLayout from "./components/layout/main/v-main-layout";
import vLoginLayout from "./components/layout/login/v-login-layout";

export default {
  components: {
    vEmptyLayout,
    vMainLayout,
    vLoginLayout,
  },
  computed: {
    layout() {
      return "v-" + this.$route.meta.layout + "-layout";
    },
  },
  mounted() {
    this.$store.dispatch("SET_USER");
    this.$store.dispatch("WEBSOCKET_RUN");
  },
};
</script>