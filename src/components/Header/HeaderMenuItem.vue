<template>
    <router-link class="nav-item" :to="data.url" exact-active-class="active" :exact="data.exact">
        <a @click="clickedLink" href="#" class="nav-link">
            <div class="nav-link__content">{{ data.name }}</div>
        </a>
    </router-link>
</template>

<script>
export default {
    name: 'HeaderMenuItem',
    props: {
        data: {
            type: Object
        }
    },
    methods: {
        clickedLink(e) {
            if (this.$route.path == this.data.url) {
                e.preventDefault();
            }
        }
    }
};
</script>

<style></style>