<template>
    <div class="d-flex align-items-center gap-2">
        <div class="circle" :style="{ backgroundColor: color }"></div>
        <span>{{ tag.name ?? tag.label }}</span>
    </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    tag: {
        type: Object,
        required: true
    }
});

const color = computed(() => {
    if (props.tag.color[0] === '#') return props.tag.color;
    return '#' + props.tag.color;
});
</script>
