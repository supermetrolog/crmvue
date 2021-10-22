<template>
  <notifications position="bottom right" group="app" />

  <component :is="layout"> </component>
  <!-- <router-view>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <component :is="layout">
      </component>
    </transition>
  </router-view> -->
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
  },
};
</script>