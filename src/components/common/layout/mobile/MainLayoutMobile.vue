<template>
  <div class="v-main-layout MainLayoutMobile">
    <HeaderMobile
      @menuButtonClicked="menuButtonClicked"
      :sidebarIsOpen="sidebarIsOpen"
    />
    <SidebarMobile v-if="sidebarIsOpen" @onCloseSidebar="menuButtonClicked" />
    <!-- <CallerManager /> -->
    <section class="content">
      <router-view v-slot="{ Component }">
        <transition
          mode="out-in"
          enter-active-class="animate__animated animate__fadeIn for__page"
          leave-active-class="animate__animated animate__fadeOut for__page"
        >
          <component :is="Component" :key="$route.path"></component>
        </transition>
      </router-view>
    </section>
  </div>
</template>

<script>
import HeaderMobile from "./header/HeaderMobile.vue";
import SidebarMobile from "./sidebar/SidebarMobile.vue";

// import CallerManager from "@/components/common/callermanager/CallerManager";
export default {
  name: "MainLayoutMobile",
  components: {
    SidebarMobile,
    HeaderMobile,
    // CallerManager,
  },
  props: {
    message: {
      type: String,
      default: "FUCK THE POLICE",
    },
  },
  data() {
    return {
      sidebarIsOpen: false,
    };
  },
  methods: {
    menuButtonClicked() {
      this.sidebarIsOpen = !this.sidebarIsOpen;
    },
  },
};
</script>
