<template>
  <router-link
    class="nav-item"
    tag="li"
    :to="data.url"
    exact-active-class="active"
    :exact="data.exact"
  >
    <a href="#" class="nav-link">
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
};
</script>

<style>
</style>