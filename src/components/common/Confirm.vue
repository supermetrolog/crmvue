<template>
    <Modal
        @close="cancel"
        :show="isVisible"
        width="450"
        class="confirm"
        title="Подтверждение действия"
    >
        <p class="confirm__text">{{ message }}</p>
        <div class="confirm__actions">
            <Button @click="submit" success>Подтвердить</Button>
            <Button @click="cancel" danger>Отмена</Button>
        </div>
    </Modal>
</template>
<script setup>
import Modal from '@/components/common/Modal.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import Button from '@/components/common/Button.vue';

const { isVisible, message, cancel, submit } = useConfirm();
</script>
