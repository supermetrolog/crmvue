<template>
  <div class="SidebarMobile sidebar">
    <main class="SidebarMobile-wrapper">
      <div class="SidebarMobile-user-image">
        <router-link class="nav-item" to="account">
          <div class="avatar-container" v-if="THIS_USER">
            <div class="avatar mx-auto">
              <img :src="src" alt="Аватар" />
            </div>
          </div>
        </router-link>
        <hr />
      </div>
      <div class="SidebarMobile-menu">
        <vNav @click="closeSidebar" />
        <HeaderNavMobile @closeSidebar="closeSidebar" />
      </div>
    </main>
  </div>
</template>

<script>
import HeaderNavMobile from "../header/HeaderNavMobile.vue";
import VNav from "../../main/sidebar/v-nav.vue";
import { mapGetters } from "vuex";
export default {
  name: "SidebarMobile",
  components: {
    VNav,
    HeaderNavMobile,
  },
  computed: {
    ...mapGetters(["THIS_USER"]),
    src() {
      if (this.THIS_USER) {
        return this.$apiUrlHelper.getUserAvatarUrl(
          this.THIS_USER.userProfile.avatar
        );
      }
      return null;
    },
  },
  methods: {
    closeSidebar() {
      this.$emit("onCloseSidebar");
    },
  },
};
</script>