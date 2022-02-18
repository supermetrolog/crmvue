<template>
  <div class="search row no-gutters">
    <div class="col-9 search-input p-3">
      <label for="search">Поиск компаний</label>
      <input
        type="text"
        id="search"
        placeholder="pennylane"
        v-model.trim="param.all"
        @keyup.enter="clickSearch"
      />
      <p>Введите: название компании, ID компании, адрес компании</p>
    </div>
    <div class="col-3 search-button p-3 align-self-center">
      <button class="btn btn-primary" @click="clickSearch">Поиск</button>
    </div>
    <hr />
  </div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      param: {
        all: null,
      },
    };
  },
  methods: {
    clickSearch() {
      // if (this.param.searchText == "") {
      //   return;
      // }
      let query = { ...this.$route.query };
      query.all = this.param.all;
      if (!query.all) {
        delete query.all;
      }
      console.log(query);
      this.$router.push({ query });
      // this.$emit("search", this.param);
    },
  },
};
</script>

<style>
</style>