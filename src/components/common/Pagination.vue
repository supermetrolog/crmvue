<template>
  <div class="pagination py-4" v-if="paginationVisible">
    <button
      class="btn btn-primary"
      @click.prevent="clickLoadMore"
      v-show="!loader"
    >
      показать еще
      <i class="fas fa-list-ul d-inline ml-1"></i>
    </button>
    <Loader class="center small py-4 no-absolute" v-if="loader" />
  </div>
</template>

<script>
import Loader from "./Loader.vue";
export default {
  name: "Pagination",
  components: {
    Loader,
  },
  data() {
    return {
      loader: false,
    };
  },
  props: {
    pagination: {
      type: Object,
    },
  },
  computed: {
    paginationVisible() {
      if (!this.pagination) {
        return false;
      }
      return this.pagination.pageCount > this.pagination.currentPage
        ? true
        : false;
    },
  },
  methods: {
    clickLoadMore() {
      if (this.pagination.pageCount > this.pagination.currentPage) {
        this.loader = true;
        this.$emit("loadMore");
      }
    },
  },
  watch: {
    pagination() {
      this.loader = false;
    },
  },
  emits: ["loadMore"],
};
</script>

<style>
</style>