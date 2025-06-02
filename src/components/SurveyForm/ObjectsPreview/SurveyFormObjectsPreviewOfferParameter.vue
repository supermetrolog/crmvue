<template>
    <div class="survey-form-object-preview-offer__parameter">
        <i :class="icon" />
        <p class="fs-1 text-dark"><slot /></p>
    </div>
</template>
<script setup>
defineProps({
    icon: {
        type: String,
        required: true
    }
});
</script>
