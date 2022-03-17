<template>
  <div class="v-sidebar">
    <main class="sidebar">
      <div class="sidebar__user-image">
        <router-link class="nav-item" to="account">
          <div class="avatar-container" v-if="THIS_USER">
            <div class="avatar mx-auto">
              <img :src="src" alt="Аватар" />
            </div>
          </div>
        </router-link>
        <hr />
      </div>
      <vNav />
    </main>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import vNav from "./v-nav";
export default {
  name: "v-sidebar",
  components: {
    vNav,
  },
  computed: {
    ...mapGetters(["THIS_USER"]),
    src() {
      if (process.env.NODE_ENV == "development" && this.THIS_USER) {
        return "http://crmka/uploads/" + this.THIS_USER.userProfile.avatar;
      } else {
        return (
          "http://api.billypro.beget.tech/uploads/" +
          this.THIS_USER.userProfile.avatar
        );
      }
    },
  },
};
</script>