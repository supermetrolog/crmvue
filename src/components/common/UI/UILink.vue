<template>
    <component :is="as" class="ui-link" :href>
        <slot />
    </component>
</template>
<script setup>
defineProps({
    href: {
        type: String,
        default: '#'
    },
    as: {
        type: String,
        default: 'a'
    }
});
</script>
