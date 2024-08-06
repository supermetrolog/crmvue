<template>
    <ul class="header__list">
        <HeaderMenuItem v-for="link in nav" :key="link.id" :data="link" />
    </ul>
</template>
<script setup>
import HeaderMenuItem from '@/components/Header/HeaderMenuItem.vue';
import { InternalMenu } from '@/const/menu.js';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const nav = computed(() => InternalMenu[route.matched[0].name] || []);
</script>
