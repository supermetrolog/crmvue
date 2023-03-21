<template>
  <div class="account-main">
    <UserProfile :user="THIS_USER" @logOut="onLogOut" />
  </div>
</template>

<script>
import UserProfile from '../../components/account/user-profile/UserProfile.vue'
import { mapGetters } from "vuex";
export default {
  name: "AccountMain",
  components: { UserProfile },
  computed: {
    ...mapGetters(["THIS_USER"]),
  },
  methods: {
    async onLogOut() {
      await this.$store.dispatch("LOGOUT");
      this.$router.push("/");
    },
  },
};
</script>

<style>
.account-list {
  display: flex;
  flex-direction: column;
}
</style>