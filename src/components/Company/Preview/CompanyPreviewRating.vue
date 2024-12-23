<template>
    <div class="company-preview-rating">
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
defineProps({
    rating: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
        default: 5
    }
});
</script>
