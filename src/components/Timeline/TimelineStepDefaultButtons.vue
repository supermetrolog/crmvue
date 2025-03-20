<template>
    <div class="d-flex gap-2 flex-wrap">
        <TimelineButton
            @click="$emit('done')"
            tooltip="Нажмите, чтобы сохранить ваш результат"
            :disabled="disabled || !objectsLength"
            success
        >
            <span>Подтвердить</span>
            <i class="fa-solid fa-thumbs-up icon"></i>
        </TimelineButton>
        <TimelineButton
            @click="$emit('negative')"
            tooltip="В случае нахождения более подходящих предложений вам придет уведомление!"
            :active="isNegative"
            :disabled="disabled"
            danger
        >
            <span>Нет подходящих</span>
            <i class="fa-regular fa-frown-open icon"></i>
        </TimelineButton>
    </div>
</template>
<script setup>
import TimelineButton from '@/components/Timeline/TimelineButton.vue';

defineEmits(['negative', 'done']);
defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    objectsLength: {
        type: Number,
        default: 0
    },
    isNegative: {
        type: Boolean,
        default: false
    }
});
</script>
