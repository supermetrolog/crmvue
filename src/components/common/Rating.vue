<template>
    <div
        class="rating"
        :class="{
            danger: currentPercent < 40,
            normal: currentPercent >= 40 && currentPercent < 75,
            good: currentPercent >= 75
        }"
    >
        <i
            v-for="value in max"
            :key="value"
            class="far fa-star"
            :class="{
                'fas fill': value <= rating
            }"
        >
        </i>
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
    },
    color: {
        type: String,
        default: null
    }
});

const currentPercent = computed(() => (props.rating / props.max) * 100);
</script>
