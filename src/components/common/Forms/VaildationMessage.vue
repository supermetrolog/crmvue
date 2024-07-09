<template>
    <p class="form__error">{{ $formatter.text().ucFirst(message) }}</p>
</template>
<script setup>
defineProps({
    message: {
        type: String,
        required: true
    }
});
</script>
