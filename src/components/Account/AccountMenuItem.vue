<template>
    <router-link class="account-view__link" :to>
        <i :class="icon" class="mr-2" />
        <span>{{ label }}</span>
    </router-link>
</template>
<script setup lang="ts">
defineProps<{
    to: string;
    label: string;
    icon?: string;
}>();
</script>
