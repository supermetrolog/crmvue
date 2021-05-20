<template>
  <router-link
    class="nav-item"
    tag="li"
    exact-active-class="active"
    :to="data.url"
    :exact="data.exact"
  >
    <a href="#" class="nav-link">
      <div class="nav-link__content">
        <i :class="data.icon"></i>{{ data.name }}
      </div>
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