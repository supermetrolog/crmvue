<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import vEmptyLayout from "./components/layout/empty/v-empty-layout";
import vMainLayout from "./components/layout/main/v-main-layout";
export default {
  components: {
    vEmptyLayout,
    vMainLayout,
  },
  computed: {
    layout() {
      return "v-" + this.$route.meta.layout + "-layout";
    },
  },
};
</script>
