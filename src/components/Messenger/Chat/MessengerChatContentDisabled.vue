<template>
    <UiModal v-model:visible="isVisible" title="Предупреждение" relative>
        <div class="messenger-chat-content-disabled">
            <h3>У компании отсутствуют активные контакты</h3>
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
