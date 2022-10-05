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
          @onCloseSidebar="closeSidebar"
          @onOpenSection="openSection"
          :menu="menuWithSections"
          v-if="!sectionIsOpen"
        />
        <HeaderNavMobile
          @onOpenSidebar="sectionIsOpen"
          @click="closeSidebar"
          v-show="sectionIsOpen"
        />
      </div>
    </main>
  </div>
</template>

<script>
import SidebarNavMobile from "./SidebarNavMobile.vue";
import HeaderNavMobile from "../header/HeaderNavMobile.vue";
import { mapGetters } from "vuex";
import { InternalMenu } from "@/const/Const";
import { Menu } from "@/const/Const";

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
    menu() {
      if (this.THIS_USER && this.THIS_USER.username == "admin") {
        return Menu.get("admin");
      }
      return Menu.get("agent");
    },
    menuWithSections() {
      let result = this.menu.map(function (item) {
        let filter = item.url.slice(1);
        if (InternalMenu.get(filter) != undefined) {
          item.hasSection = true;
          return item;
        } else {
          item.hasSection = false;
          return item;
        }
      });
      return result;
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