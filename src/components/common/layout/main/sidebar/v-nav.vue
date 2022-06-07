<template>
  <div class="v-nav">
    <div class="sidebar__navigation">
      <ul class="nav-list vertical">
        <vNavItem v-for="link of menu" :key="link.id" :data="link" />
      </ul>
    </div>
  </div>
</template>

<script>
import vNavItem from "./v-nav-item";
import { Menu } from "@/const/Const";
import { mapGetters } from "vuex";
export default {
  name: "v-nav",
  components: {
    vNavItem,
  },

  computed: {
    ...mapGetters(["THIS_USER"]),
    menu() {
      if (this.THIS_USER && this.THIS_USER.username == "admin") {
        return Menu.get("admin");
      }
      return Menu.get("agent");
    },
  },
};
</script>