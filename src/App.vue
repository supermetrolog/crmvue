<template>
    <!--    <notifications position="bottom right" group="app"/>-->
    <component :is="layoutName"/>
</template>

<script>
import Default from '@/layouts/default.vue';
import Login from '@/layouts/login.vue';
import Empty from '@/layouts/empty.vue';

export default {
    components: {
        Default, Login, Empty
    },
    provide() {
        return {
            isMobile: this.isMobile,
        };
    },
    computed: {
        layoutName() {
            if (this.isMobile && this.$route.meta.layout === "main") {
                return "Default";
            }
            return this.$route.meta.layout;
        },
        isMobile() {
            let hasTouchScreen = false;

            if ("maxTouchPoints" in navigator) {
                hasTouchScreen = navigator.maxTouchPoints > 0;
            } else if ("msMaxTouchPoints" in navigator) {
                hasTouchScreen = navigator.msMaxTouchPoints > 0;
            } else {
                const mQ = matchMedia?.("(pointer:coarse)");
                if (mQ?.media === "(pointer:coarse)") {
                    hasTouchScreen = !!mQ.matches;
                } else if ("orientation" in window) {
                    hasTouchScreen = true;
                } else {
                    const UA = navigator.userAgent;
                    hasTouchScreen =
                        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
                }
            }

            return hasTouchScreen && window.innerWidth <= 800;
        },
    },
    mounted() {
        this.$store.dispatch("INIT");
    },
};
</script>
<style lang="scss"></style>
