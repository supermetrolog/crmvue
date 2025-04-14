<template>
    <UiButton v-if="scheduledDate" color="success" small>Звонок запланирован</UiButton>
    <UiButton
        v-else
        @click="$emit('schedule')"
        tooltip="Нажмите, чтобы создать задачу на запланированный звонок"
        color="white"
        small
    >
        Запланировать звонок
    </UiButton>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['schedule']);
defineProps({
    scheduledDate: String
});
</script>
