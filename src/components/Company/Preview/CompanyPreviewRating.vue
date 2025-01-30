<template>
    <div
        class="company-preview-rating"
        :class="{
            danger: currentPercent < 40,
            normal: currentPercent >= 40 && currentPercent < 75,
            good: currentPercent >= 75
        }"
    >
        <i
            v-for="value in max"
            :key="value"
            class="fa-regular fa-star"
            :class="{
                'fa-solid fill': value <= rating
            }"
        />
    </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    rating: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
        default: 5
    }
});

const currentPercent = computed(() => (props.rating / props.max) * 100);
</script>
