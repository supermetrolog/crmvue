<template>
  <div class="users-all">
    <UserForm
      @closeUserForm="clickCloseUserForm"
      v-if="userFormVisible"
      :formdata="userForUpdate"
      @created="getUsers"
      @updated="getUsers"
    />

    <div class="row box">
      <div class="col-12">
        <button class="btn btn-primary scale" @click="clickOpenUserForm">
          Создать пользователя
        </button>
      </div>
      <div class="col inner inner-default-size">
        <Loader v-if="loader" class="center" />

        <UsersTable
          @clickEdit="clickOpenUserFormForUpdate"
          @deletedUser="getUsers"
          :users="USERS"
          v-if="USERS.length"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UsersTable from "@/components/users/UsersTable";
import UserForm from "@/components/users/forms/UserForm";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "UsersMain",
  data() {
    return {
      userFormVisible: false,
      userForUpdate: null,
      loader: false,
    };
  },
  components: {
    UsersTable,
    UserForm,
  },
  computed: {
    ...mapGetters(["USERS"]),
  },
  methods: {
    ...mapActions(["FETCH_USERS", "DELETE_USER"]),
    clickOpenUserForm() {
      this.userFormVisible = true;
    },
    clickCloseUserForm() {
      this.userForUpdate = null;
      this.userFormVisible = false;
    },
    clickOpenUserFormForUpdate(user) {
      this.userForUpdate = user;
      this.userFormVisible = true;
    },
    async getUsers() {
      this.loader = true;
      await this.FETCH_USERS();
      this.loader = false;
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>
