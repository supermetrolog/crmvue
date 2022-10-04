<template>
  <div class="v-nav">
    <div class="sidebar__navigation">
      <ul class="nav-list vertical">
        <SidebarNavItem
          @click="linkHandler(link.id)"
          v-for="link of menu"
          :key="link.id"
          :data="link"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import SidebarNavItem from "./SidebarNavItem.vue";
import { Menu } from "@/const/Const";
import { mapGetters } from "vuex";
export default {
  name: "SidebarNavMobile",
  components: {
    SidebarNavItem,
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
  methods: {
    linkHandler(id) {
      if (id == 0) {
        this.$emit("onOpenSection");
      } else {
        this.$emit("onCloseSidebar");
      }
    },
  },
};
</script>