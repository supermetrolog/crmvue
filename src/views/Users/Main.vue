<template>
  <div class="users-all">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <UserForm
        @closeUserForm="clickCloseUserForm"
        v-if="userFormVisible"
        :formdata="userForUpdate"
        @created="getUsers"
        @updated="getUsers"
      />
    </transition>
    <div class="row">
      <div class="col-7 mx-auto">
        <div class="row">
          <div class="col-12 mt-2 mb-4">
            <button class="btn btn-primary scale" @click="clickOpenUserForm">
              Создать пользователя
            </button>
          </div>
          <div class="col-12">
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
