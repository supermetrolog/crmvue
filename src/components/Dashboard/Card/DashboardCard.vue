<template>
    <div class="dashboard-card">
        <div v-if="title || $slots.header" class="dashboard-card__header">
            <slot name="header">
                <div class="dashboard-card__header-body">
                    <h3 class="dashboard-card__title">{{ title }}</h3>
                    <router-link v-if="viewAllLink" :to="viewAllLink" class="dashboard-card__link">
                        Посмотреть всё
                    </router-link>
                </div>
            </slot>
        </div>
        <div class="dashboard-card__content">
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
defineProps({
    title: {
        type: String,
        default: null
    },
    viewAllLink: {
        type: String,
        default: null
    }
});
</script>
