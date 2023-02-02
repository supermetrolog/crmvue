<template>
  <router-link
    class="nav-item"
    active-class="active"
    :to="data.url"
    :exact="data.exact"
  >
    <a class="nav-link" @click="clickedLink">
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
  methods: {
    clickedLink(e) {
      if (this.$route.path == this.data.url) {
        e.preventDefault();
      }
    },
  },
};
</script>