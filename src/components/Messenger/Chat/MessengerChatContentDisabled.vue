<template>
    <UiModal
        v-model:visible="isVisible"
        title="Предупреждение"
        relative
        hide-header
        :width="400"
        body-class="messenger-chat-content__disabled"
        :close-on-outside-click="false"
        :close-on-press-esc="false"
    >
        <div class="text-center">
            <i class="fa-solid fa-users-slash icon mb-2" />
            <p class="fs-3">Отсутствуют активные контакты!</p>
        </div>
        <template #footer="{ close }">
            <Button @click="close" small>Открыть чат</Button>
        </template>
    </UiModal>
</template>
<script setup>
import UiModal from '@/components/common/UI/UiModal.vue';
import Button from '@/components/common/Button.vue';
import { ref } from 'vue';

const isVisible = ref(true);
</script>
