<template>
  <router-link
    class="nav-item"
    active-class="active"
    :to="data.url"
    :exact="data.exact"
  >
    <a class="nav-link" @click="clickedLink">
      <div class="nav-link__content nav-link_mobile">
        <div class="link-name_mobile">{{ data.name }}</div>
        <div class="link-icon_mobile">
          <i :class="data.icon"></i>
        </div>
      </div>
    </a>
  </router-link>
</template>

<script>
export default {
  name: "SidebarNavItem",
  props: {
    data: {
      type: Object,
    },
  },
  methods: {
    clickedLink(e) {
      if (this.$route.path == this.data.url) {
        e.preventDefault();
      }
    },
  },
};
</script>