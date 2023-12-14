<template>
    <ul class="nav-list horizontal">
        <HeaderMenuItem v-for="link in nav" :key="link.id" :data="link"/>
    </ul>
</template>
<script>
import HeaderMenuItem from "@/components/Header/HeaderMenuItem.vue";
import {InternalMenu} from "@/const/menu.js";

export default {
    name: "HeaderMenu",
    components: {
        HeaderMenuItem
    },
    data() {
        return {
            nav: InternalMenu.get("personal"),
        };
    },
    methods: {
        getInternalMenu() {
            this.nav = InternalMenu.get(this.$route.matched[0].name);
        },
    },
    mounted() {
        this.getInternalMenu();
    },
    watch: {
        $route() {
            this.getInternalMenu();
        },
    },
}
</script>