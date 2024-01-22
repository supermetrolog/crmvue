<template>
    <router-link :to="to" class="button" :class="{ 'button--icon': icon }">
        <slot />
    </router-link>
</template>
<script>
export default {
    name: 'ButtonLink',
    props: {
        to: {
            type: String,
            default: '/'
        },
        icon: {
            type: Boolean,
            default: false
        }
    }
};
</script>
