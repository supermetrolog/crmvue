<template>
    <div class="rating">
        <i
            v-for="value in 5"
            :key="value"
            class="far fa-star"
            :class="{
                'fas fa-star': value <= rating,
                red: value <= rating,
            }"
        >
        </i>
    </div>
</template>

<script>
export default {
    name: "Rating",
    props: {
        rating: {
            type: Number,
            required: true,
        },
    },
};
</script>
