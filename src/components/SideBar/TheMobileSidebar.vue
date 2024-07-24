<template>
    <div class="sidebar-mobile">
        <div class="sidebar-mobile__wrapper">
            <div class="sidebar-mobile__top">
                <router-link class="sidebar-mobile__logo" to="/">
                    <img
                        class="sidebar-mobile__image"
                        alt="penny lane logo"
                        src="@/assets/image/pl-logo.png"
                    />
                </router-link>
                <button @click.prevent="$emit('close')" class="sidebar-mobile__close">
                    <i class="fa-regular fa-circle-left"></i>
                </button>
            </div>
        </div>
        <MobileSidebarMenu />
    </div>
</template>
<script setup>
import MobileSidebarMenu from '@/components/SideBar/MobileSidebarMenu.vue';

defineEmits(['close']);
</script>
