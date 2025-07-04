<template>
    <div class="schedule-tooltip__call">
        <span class="schedule-tooltip__icon rounded-icon bg-primary">
            <i :class="icon"> </i>
        </span>
        <span class="font-weight-semi">{{ time }}</span>
        <span class="schedule-tooltip__text">{{ title }}</span>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    title: string;
    icon: string;
    time: string;
}>();
</script>
