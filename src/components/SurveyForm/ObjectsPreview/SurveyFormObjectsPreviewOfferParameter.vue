<template>
    <div class="survey-form-object-preview-offer__parameter">
        <i :class="icon" />
        <p class="fs-1 text-dark font-weight-semi"><slot /></p>
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
