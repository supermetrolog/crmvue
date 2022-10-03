<template>
  <notifications position="bottom right" group="app" />
  <component :is="layout"> </component>
</template>

<script>
import MainLayoutMobile from "./components/common/layout/mobile/MainLayoutMobile.vue";
import vEmptyLayout from "./components/common/layout/empty/v-empty-layout";
import vMainLayout from "./components/common/layout/main/v-main-layout";
import vLoginLayout from "./components/common/layout/login/v-login-layout";

export default {
  components: {
    vEmptyLayout,
    vMainLayout,
    vLoginLayout,
    MainLayoutMobile,
  },
  provide() {
    return {
      isMobile: this.isMobile,
    };
  },
  computed: {
    layout() {
      if (this.isMobile && this.$route.meta.layout === "main") {
        return "MainLayoutMobile";
      }
      return "v-" + this.$route.meta.layout + "-layout";
    },
    isMobile() {
      let hasTouchScreen = false;
      if ("maxTouchPoints" in navigator) {
        hasTouchScreen = navigator.maxTouchPoints > 0;
      } else if ("msMaxTouchPoints" in navigator) {
        hasTouchScreen = navigator.msMaxTouchPoints > 0;
      } else {
        const mQ = matchMedia?.("(pointer:coarse)");
        if (mQ?.media === "(pointer:coarse)") {
          hasTouchScreen = !!mQ.matches;
        } else if ("orientation" in window) {
          hasTouchScreen = true; // deprecated, but good fallback
        } else {
          // Only as a last resort, fall back to user agent sniffing
          const UA = navigator.userAgent;
          hasTouchScreen =
            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
        }
      }
      return hasTouchScreen && window.innerWidth <= 800;
    },
  },
  mounted() {
    this.$store.dispatch("INIT");
  },
};
</script>