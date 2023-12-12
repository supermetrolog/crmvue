<template>
    <div class="sidebar">
        <div class="sidebar__avatar">
            <router-link to="account">
                <div class="avatar__container" v-if="THIS_USER">
                    <div class="avatar__preview">
                        <img :src="src" class="avatar__image" alt="Аватар" />
                    </div>
                </div>
            </router-link>
            <hr />
        </div>
        <SideBarMenu />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import SideBarMenu from "@/components/SideBar/SideBarMenu.vue";
export default {
    name: "TheSideBar",
    components: {
        SideBarMenu
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
        }
    },
};
</script>