<template>
    <div class="spinner" :class="{ center: center }">
        <div class="spinner__clip"></div>
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
