<template>
    <div
        v-tippy="label"
        class="avatar dashboard-card-task__system"
        :style="{ '--size': size + 'px' }"
    >
        <i class="fa-solid fa-robot"></i>
    </div>
</template>

<script setup>
defineProps({
    size: {
        type: [String, Number],
        default: 60
    },
    label: {
        type: String,
        default: undefined
    }
});
</script>
