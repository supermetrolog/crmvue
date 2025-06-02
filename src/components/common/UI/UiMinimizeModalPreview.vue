<template>
    <div class="ui-minimize-modal-preview">
        <p class="ui-minimize-modal-preview__title">{{ title }}</p>
        <UiTooltipIcon
            @click="$emit('expand')"
            class="ui-minimize-modal-preview__button ml-auto"
            icon="fa-solid fa-expand"
            tooltip="Развернуть"
        />
        <UiTooltipIcon
            @click="$emit('close')"
            class="ui-minimize-modal-preview__button"
            icon="fa-solid fa-close"
            tooltip="Закрыть"
        />
    </div>
</template>

<script setup>
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';

defineEmits(['close', 'expand']);

defineProps({
    title: {
        type: String,
        required: true
    }
});
</script>
