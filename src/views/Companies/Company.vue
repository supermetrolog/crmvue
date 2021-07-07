<template>FUCK</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Company",
  data() {
    return {
      loader: true,
    };
  },
  computed: {
    ...mapGetters(["COMPANY"]),
  },
  methods: {
    ...mapActions(["FETCH_COMPANY"]),
    async getCompany() {
      this.loader = true;
      await this.FETCH_COMPANY(this.$route.params.id);
      console.log(this.COMPANY);
      this.loader = false;
    },
  },
  mounted() {
    this.getCompany();
  },
};
</script>

<style>
</style>