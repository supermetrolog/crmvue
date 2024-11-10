<template>
    <div class="contact-card__warning">
        <i class="fa-solid fa-exclamation-triangle mr-1"></i>
        <span class="mr-1">Внимание!</span>
        <span>
            {{ comment }}
        </span>
    </div>
</template>
<script setup>
defineProps({
    comment: {
        type: String,
        default: null
    }
});
</script>
