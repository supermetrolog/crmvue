<template>
  <div class="v-nav">
    <div class="sidebar__navigation">
      <ul class="nav-list vertical">
        <SidebarNavItem
          @click="linkHandler(link)"
          v-for="link of menu"
          :class="{ hasSection: link.hasSection }"
          :key="link.id"
          :data="link"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import SidebarNavItem from "./SidebarNavItem.vue";
export default {
  name: "SidebarNavMobile",
  components: {
    SidebarNavItem,
  },
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    linkHandler(link) {
      if (link.hasSection) {
        this.$emit("onOpenSection");
      } else {
        this.$emit("onCloseSidebar");
      }
    },
  },
};
</script>