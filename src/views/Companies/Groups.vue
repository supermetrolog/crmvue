<template>
  <div class="company-groups">
    <!-- <UserForm
      @closeUserForm="clickCloseUserForm"
      v-if="userFormVisible"
      :formdata="userForUpdate"
      @created="getUsers"
      @updated="getUsers"
    /> -->
    <div class="row no-gutters box mt-2">
      <div class="col-12">
        <button class="btn btn-primary scale">Создать группу компаний</button>
      </div>
      <div class="col-4 inner inner-default-size mt-2">
        <Loader v-if="loader" class="center" />

        <!-- <CompaniesGroupsTable
          @clickEdit="clickOpenCompaniesGroupsFormForUpdate"
          @deleted="getCompaniesGroups"
          :companiesGroups="COMPANIES_GROUPS"
          v-if="COMPANIES_GROUPS.length"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
// import CompaniesGroupsTable from "@/components/companies/companies/companies-groups/CompaniesGroupsTable.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "CompaniesGroups",
  components: {
    // CompaniesGroupsTable,
  },
  data() {
    return {
      loader: false,
    };
  },
  computed: {
    ...mapGetters(["COMPANIES_GROUPS"]),
  },
  methods: {
    ...mapActions(["FETCH_COMPANY_GROUP_LIST", "DELETE_COMPANIES_GROUP"]),

    // clickOpenUserForm() {
    //   this.userFormVisible = true;
    // },
    // clickCloseUserForm() {
    //   this.userForUpdate = null;
    //   this.userFormVisible = false;
    // },
    clickOpenCompaniesGroupsFormForUpdate() {
      console.log("FUCK");
    },
    async getCompaniesGroups() {
      this.loader = true;
      await this.FETCH_COMPANY_GROUP_LIST();
      this.loader = false;
    },
  },
  mounted() {
    this.getCompaniesGroups();
  },
};
</script>

<style>
</style>