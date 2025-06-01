<template>
    <UiButton v-if="active" color="success">Звонок запланирован</UiButton>
    <UiButton
        v-else
        tooltip="Нажмите, чтобы создать задачу на запланированный звонок"
        color="white"
    >
        Перезвонить
    </UiButton>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';

defineProps({
    active: Boolean
});
</script>
