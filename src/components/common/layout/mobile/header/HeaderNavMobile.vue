<template>
  <div
    class="col-lg-7 col-12 align-self-center HeaderNavMobile"
    @click="this.$emit('closeSidebar')"
  >
    <ul class="nav-list vertical">
      <vNavItem v-for="link of nav" :key="link.id" :data="link" />
    </ul>
  </div>
</template>

<script>
import VNavItem from "../../main/header/v-nav-item.vue";
import { InternalMenu } from "@/const/Const";
export default {
  name: "HeaderNavMobile",
  components: {
    VNavItem,
  },
  data() {
    return {
      nav: InternalMenu.get("personal"),
    };
  },
  methods: {
    getInternalMenu() {
      this.nav = InternalMenu.get(this.$route.matched[0].name);

      console.log(this.$route);
    },
  },
  mounted() {
    this.getInternalMenu();
  },
  watch: {
    $route() {
      this.getInternalMenu();
    },
  },
};
</script>

<style>
</style>