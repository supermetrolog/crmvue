<template>
  <div class="companies-groups-table">
    <h1>fuck</h1>
  </div>
</template>

<script>
import Table from "@/components/table/Table";
import Tr from "@/components/table/Tr";
import Th from "@/components/table/Th";
import Td from "@/components/table/Td";
import PhoneNumber from "@/components/PhoneNumber";
import { mapActions } from "vuex";
export default {
  name: "CompaniesGroupsTable",
  components: {
    Table,
    Tr,
    Th,
    Td,
    PhoneNumber,
  },
  data() {
    return {
      loader: false,
      userForDelete: false,
      deleteLoader: false,
    };
  },
  props: {
    companies: {
      type: Array,
    },
  },
  computed: {
    src() {
      if (process.env.NODE_ENV == "development") {
        return "http://crmka/uploads/";
      } else {
        return "http://api.billypro.beget.tech/uploads/";
      }
    },
  },
  methods: {
    ...mapActions(["DELETE_USER"]),
    clickCloseModal() {
      this.userForDelete = null;
    },
    clickDeleteUser(user) {
      console.log(user);
      this.userForDelete = user;
    },
    async deleteUser(user) {
      this.deleteLoader = true;
      await this.DELETE_USER(user.id);
      this.$emit("deletedUser");
      this.deleteLoader = false;
      this.userForDelete = null;
    },
  },
};
</script>

<style>
</style>