<template>
    <div class="dashboard-chip" :class="{ 'dashboard-chip--with-icon': withIcon }">
        <slot></slot>
    </div>
</template>
<script setup>
defineProps({
    withIcon: {
        type: Boolean
    }
});
</script>
