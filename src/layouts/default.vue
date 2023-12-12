<template>
  <div class="v-main-layout">
    <TheSideBar/>
    <TheHeader/>
    <!-- <CallerManager /> -->
    <main>
        <router-view v-slot="{ Component }">
            <transition
                mode="out-in"
                enter-active-class="animate__animated animate__fadeIn for__page"
                leave-active-class="animate__animated animate__fadeOut for__page"
            >
                <component :is="Component" :key="$route.path"></component>
            </transition>
        </router-view>
    </main>
  </div>
</template>

<script>
import TheSideBar from "@/components/SideBar/TheSideBar.vue";
import TheHeader from "@/components/Header/TheHeader.vue";

export default {
  name: "Default",
  components: {
    TheHeader,
    TheSideBar
  }
};
</script>
