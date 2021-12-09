<template>
  <div class="setting">
    <UserForm
      @closeUserForm="clickCloseUserForm"
      v-if="userFormVisible"
      :formdata="userForUpdate"
    />

    <div class="row">
      <div class="col-12">
        <button class="btn btn-danger" @click="clickLogout">Выйти</button>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12">
        <button class="btn btn-primary" @click="clickOpenUserForm">
          Создать пользователя
        </button>
      </div>
      <div class="col-6">
        <UsersTable @clickEdit="clickOpenUserFormForUpdate" />
      </div>
    </div>
  </div>
</template>

<script>
import UsersTable from "@/components/users/UsersTable";
import UserForm from "@/components/users/forms/UserForm";
export default {
  name: "Setting",
  data() {
    return {
      userFormVisible: false,
      userForUpdate: null,
    };
  },
  components: {
    UsersTable,
    UserForm,
  },
  methods: {
    async clickLogout() {
      await this.$store.dispatch("LOGOUT");
      this.$router.push("/");
    },
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
  },
};
</script>
