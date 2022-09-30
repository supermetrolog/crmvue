<template>
  <div class="HeaderMobile v-header">
    <main class="HeaderMobile-nav navbar">
      <teleport to="#app">
        <BurgerMenuButton
          class="HeaderMobile-burger"
          :isActive="this.sidebarIsOpen"
          @onClick="this.$emit('menuButtonClicked')"
        />
      </teleport>
      <vNavMiddleInfo />
      <vNavNotif />
    </main>
  </div>
</template>

<script>
import BurgerMenuButton from "../../../BurgerMenuButton.vue";
import VNavNotif from "../../main/header/v-nav-notif.vue";
import VNavMiddleInfo from "../../main/header/v-nav-middle-info.vue";

export default {
  name: "HeaderMobile",
  components: {
    VNavMiddleInfo,
    VNavNotif,
    BurgerMenuButton,
  },
  props: {
    sidebarIsOpen: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
</style>