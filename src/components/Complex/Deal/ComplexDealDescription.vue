<template>
    <div class="deal-info__block deal-info-description">
        <p class="deal-info__block-title">Описание</p>
        <div class="deal-info-description__body" v-html="description"></div>
    </div>
</template>
<script setup>
defineProps({
    description: {
        type: String,
        required: true
    }
});
</script>
