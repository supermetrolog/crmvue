<template>
  <notifications position="bottom right" group="app" />
  <component :is="layout"> </component>
</template>

<script>
import vEmptyLayout from "./components/common/layout/empty/v-empty-layout";
import vMainLayout from "./components/common/layout/main/v-main-layout";
import vLoginLayout from "./components/common/layout/login/v-login-layout";

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
    this.$store.dispatch("INIT");
  },
};
</script>