<template>
  <div class="v-sidebar">
    <main class="sidebar">
      <div class="sidebar__user-image">
        <a href="#" class="link">
          <div class="image-circle">
            <img
              v-if="THIS_USER"
              :src="src"
              alt="USER IMAGE"
              class="img-center"
            />
          </div>
          <hr />
        </a>
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