<template>
  <router-link
    class="nav-item"
    tag="li"
    :to="data.url"
    exact-active-class="active"
    :exact="data.exact"
  >
    <a href="#" class="nav-link" @click="clickedLink">
      <div class="nav-link__content">{{ data.name }}</div>
    </a>
  </router-link>
</template>

<script>
export default {
  name: "v-nav-item",
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

<style>
</style>