<template>
    <div class="object-purposes">
        <div
            v-for="key in count"
            :key="key"
            class="object-purposes__item skeleton skeleton--rect"
        ></div>
    </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    count: {
        type: Number,
        default: 33
    },
    size: {
        type: Number,
        default: 40
    }
});

const purposeSize = computed(() => props.size + 'px');
const purposeFontSize = computed(() => props.size * 0.5 + 'px');
</script>
<style scoped>
.object-purposes {
    --purpose-size: v-bind(purposeSize);
    --purpose-font-size: v-bind(purposeFontSize);
}
</style>
