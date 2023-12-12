<template>
    <div class="account-main">
        <UserProfile :user="THIS_USER" @logOut="onLogOut"/>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import UserProfile from "@/components/User/UserProfile.vue";

export default {
    name: "AccountMain",
    components: {UserProfile},
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