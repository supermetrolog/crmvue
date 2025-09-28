<template>
    <div
        @mousedown="$emit('mousedown', $event)"
        @dblclick.stop="$emit('dbclick', $event)"
        class="th__resizer"
    ></div>
</template>

<script setup lang="ts">
defineEmits<{
    (e: 'mousedown', event: MouseEvent): void;
    (e: 'dbclick', event: MouseEvent): void;
}>();
</script>
