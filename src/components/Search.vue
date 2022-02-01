<template>
  <div class="search row no-gutters">
    <div class="col-9 search-input p-3">
      <label for="search">Поиск компаний</label>
      <input
        type="text"
        id="search"
        placeholder="pennylane"
        v-model.trim="param.searchText"
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
        searchText: "",
      },
    };
  },
  methods: {
    clickSearch() {
      // if (this.param.searchText == "") {
      //   return;
      // }
      this.$emit("search", { query: this.param });
    },
  },
};
</script>

<style>
</style>