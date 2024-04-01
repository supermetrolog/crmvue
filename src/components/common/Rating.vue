<template>
    <div class="rating" :class="className">
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

<script>
export default {
    name: 'Rating',
    props: {
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
    },
    computed: {
        className() {
            if (this.color) return 'rating--' + this.color;

            return null;
        }
    }
};
</script>
