<template>
    <div class="company-logo skeleton"></div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    size: {
        type: Number,
        default: 100
    }
});

const _size = computed(() => props.size + 'px');
</script>
<style scoped>
.company-logo {
    height: v-bind(_size);
    width: v-bind(_size);
}
</style>
