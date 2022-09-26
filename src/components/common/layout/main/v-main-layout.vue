<template>
  <div class="v-main-layout">
    <vSideBar />
    <vHeader />
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
import vHeader from "./header/v-header";
import vSideBar from "./sidebar/v-sidebar";
// import CallerManager from "@/components/common/callermanager/CallerManager";
export default {
  name: "v-main-layout",
  components: {
    vHeader,
    vSideBar,
    // CallerManager
  },
  props: {
    message: {
      type: String,
      default: "FUCK THE POLICE",
    },
  },
};
</script>
