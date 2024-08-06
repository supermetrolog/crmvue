<template>
    <div class="rating" :class="'rating--' + color">
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
defineProps({
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
</script>
