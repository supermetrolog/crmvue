<template>
    <div class="spinner" :class="{ center }">
        <div class="spinner__dot"></div>
        <div class="spinner__dot"></div>
        <div class="spinner__dot"></div>
        <div class="spinner__dot"></div>
        <div class="spinner__dot"></div>
        <div class="spinner__dot"></div>
    </div>
</template>
<script>
export default {
    name: 'Spinner',
    props: {
        center: {
            type: Boolean,
            default: false
        }
    }
};
</script>
