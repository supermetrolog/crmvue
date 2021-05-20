<template>
  <div class="v-nav">
    <div class="sidebar__navigation">
      <ul class="nav-list vertical">
        <vNavItem v-for="link of nav" :key="link.id" :data="link" />
      </ul>
    </div>
  </div>
</template>

<script>
import vNavItem from "./v-nav-item";
import { Menu } from "@/const/Const";
export default {
  name: "v-nav",
  components: {
    vNavItem,
  },
  data() {
    return {
      nav: Menu.get("admin"),
    };
  },
  // async created() {
  //   await this.axios.get("http://localhost:3000/sidebar").then((Response) => {
  //     this.nav = Response.data;
  //   });
  // },
};
</script>