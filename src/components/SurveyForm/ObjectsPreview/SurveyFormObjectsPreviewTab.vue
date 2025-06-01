<template>
    <button
        @click="modelValue = name"
        class="survey-form-object-preview__tab"
        :class="{ active: modelValue === name }"
    >
        <slot />
    </button>
</template>
<script setup>
defineProps({
    name: {
        type: String,
        required: true
    }
});

const modelValue = defineModel();
</script>
