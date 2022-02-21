<template>
  <div class="pagination-classic">
    <div class="d-inline-block">
      <button
        class="btn btn-primary navigate"
        @click.prevent="next(1)"
        :disabled="pagination.currentPage == 1"
      >
        <i class="fas fa-angle-double-left"></i>
      </button>
      <button
        class="btn btn-primary navigate"
        @click.prevent="next(currentPage - 1)"
        :disabled="currentPage == 1"
      >
        <i class="fas fa-angle-left"></i>
      </button>

      <button
        class="btn btn-primary"
        @click.prevent="next(number)"
        v-for="number of pageList"
        :key="number"
        :class="{ active: number == currentPage }"
        :disabled="number == currentPage"
      >
        {{ number }}
      </button>
      <button
        class="btn btn-primary navigate"
        @click.prevent="next(currentPage + 1)"
        :disabled="pagination.pageCount == currentPage"
      >
        <i class="fas fa-angle-right"></i>
      </button>
      <button
        class="btn btn-primary navigate"
        @click.prevent="next(pagination.pageCount)"
        :disabled="pagination.pageCount == currentPage"
      >
        <i class="fas fa-angle-double-right"></i>
      </button>
    </div>
    <div class="parameters d-inline-block" v-if="withDescription">
      <p>
        <b>{{ currentPage }}</b> страница из <b>{{ pagination.pageCount }};</b>
      </p>
      <p>
        отображение строк <b>{{ countVisibleRows }}</b> (всего
        <b>{{ pagination.totalCount }}</b
        >)
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaginationClassic",
  data() {
    return {
      currentPage: 1,
    };
  },
  props: {
    pagination: {
      type: Object,
    },
    offset: {
      type: Number,
      default: 2,
    },
    withDescription: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    countVisibleRows() {
      const from = this.pagination.perPage * (this.currentPage - 1);
      let to = this.pagination.perPage * this.currentPage;
      if (to > this.pagination.totalCount) {
        to = this.pagination.totalCount;
      }
      return from + " - " + to;
    },
    pageList() {
      let array = [];
      if (!this.pagination) {
        return array;
      }
      for (let index = 1; index <= this.pagination.pageCount; index++) {
        const offset = this.offset;
        if (
          this.currentPage + offset >= index &&
          this.currentPage - offset <= index
        ) {
          array.push(index);
        }
      }
      return array;
    },
  },
  methods: {
    next(number) {
      this.currentPage = number;
      this.$emit("next", number);
    },
  },
  mounted() {
    this.currentPage = +this.pagination.currentPage;
  },
  watch: {
    pagination: {
      deep: true,
      handler() {
        this.currentPage = +this.pagination.currentPage;
      },
    },
  },
  emits: ["next"],
};
</script>

<style>
</style>