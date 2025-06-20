<template>
    <UiButton small
rect
:color
:icon
class="survey-form__button">
        <slot />
    </UiButton>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';

defineProps({
    color: {
        type: String,
        default: 'transparent'
    },
    icon: String
});
</script>
