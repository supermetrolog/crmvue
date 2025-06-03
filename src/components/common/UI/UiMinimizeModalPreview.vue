<template>
    <div class="ui-minimize-modal-preview">
        <UiButtonIcon
            @click="$emit('expand')"
            label="Продолжить заполнение"
            icon="fa-solid fa-play"
            small
        />
        <p class="ui-minimize-modal-preview__title">{{ title }}</p>
        <UiTooltipIcon
            @click="$emit('close')"
            class="ui-minimize-modal-preview__button ml-auto"
            icon="fa-solid fa-close"
            tooltip="Закрыть"
        />
    </div>
</template>

<script setup>
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['close', 'expand']);

defineProps({
    title: {
        type: String,
        required: true
    }
});
</script>
