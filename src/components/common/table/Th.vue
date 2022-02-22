<template>
  <th :class="{ sortable: !!sort }">
    <div class="th__content" @click="sortHandle">
      <slot />
      <i
        class="fas fa-sort-amount-down ml-1 sortable__icon"
        v-if="sort && downArrowVisible"
      ></i>
      <i
        class="fas fa-sort-amount-up ml-1 sortable__icon"
        v-if="sort && upArrowVisible"
      ></i>
    </div>
  </th>
</template>

<script>
export default {
  name: "Th",
  props: {
    sort: {
      type: String,
    },
    withRouter: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    downArrowVisible() {
      if (!this.withRouter) return false; // Это временно
      let query = { ...this.$route.query };
      if (!query.sort) return false;
      const words = query.sort.split(",");
      const existThisSortInCurrent = words.find(
        (item) => item == `-${this.sort}`
      );
      return !!existThisSortInCurrent;
    },
    upArrowVisible() {
      if (!this.withRouter) return false; // Это временно
      let query = { ...this.$route.query };
      if (!query.sort) return false;
      const words = query.sort.split(",");
      const existThisSortInCurrent = words.find((item) => item == this.sort);
      return !!existThisSortInCurrent;
    },
  },
  methods: {
    sortHandle() {
      if (!this.sort) return;
      this.$emit("sort", this.sort);
      if (!this.withRouter) return;
      let query = { ...this.$route.query };

      if (!query.sort) {
        query.sort = this.sort;
        return this.$router.push({ query });
      }

      const words = query.sort.split(",");
      const newSortParams = [];
      let existSort = false;
      words.forEach((item) => {
        if (item == this.sort || item == `-${this.sort}`) {
          existSort = true;
          if (item === this.sort) {
            newSortParams.push(`-${this.sort}`);
          }
        } else {
          newSortParams.push(item);
        }
      });
      console.log(newSortParams, existSort);
      if (existSort) {
        query.sort = newSortParams.join();
      } else {
        query.sort += `,${this.sort}`;
      }

      if (!query.sort) {
        delete query.sort;
      }
      return this.$router.push({ query });
    },
  },
};
</script>

<style>
</style>