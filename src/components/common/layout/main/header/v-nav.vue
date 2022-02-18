<template>
  <div class="col-lg-6 align-self-center">
    <ul class="nav-list horizontal">
      <vNavItem v-for="link of nav" :key="link.id" :data="link" />
    </ul>
  </div>
</template>

<script>
import vNavItem from "./v-nav-item";
import { InternalMenu } from "@/const/Const";
export default {
  name: "v-nav",
  components: {
    vNavItem,
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