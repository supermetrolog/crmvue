<template>
  <div class="SidebarMobile sidebar">
    <main class="SidebarMobile-wrapper">
      <div class="SidebarMobile-user-image" @click="closeSidebar">
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
        <SidebarNavMobile
          @onOpenSection="openSection"
          @onCloseSidebar="closeSidebar"
          v-if="!sectionIsOpen"
        />
        <HeaderNavMobile v-if="sectionIsOpen" @click="closeSidebar" />
      </div>
    </main>
  </div>
</template>

<script>
import SidebarNavMobile from "./SidebarNavMobile.vue";
import HeaderNavMobile from "../header/HeaderNavMobile.vue";
import { mapGetters } from "vuex";
export default {
  name: "SidebarMobile",
  components: {
    HeaderNavMobile,
    SidebarNavMobile,
  },
  data() {
    return {
      sectionIsOpen: false,
    };
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
    openSection() {
      if (this.sectionIsOpen == true) {
        this.sectionIsOpen = false;
      }
      this.sectionIsOpen = true;
    },
  },
};
</script>