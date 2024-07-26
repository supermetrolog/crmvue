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
            <MessengerButton @click="submit" color="success">Подтвердить</MessengerButton>
            <MessengerButton @click="cancel" color="danger">Отмена</MessengerButton>
        </div>
    </Modal>
</template>
<script setup>
import Modal from '@/components/common/Modal.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { useConfirm } from '@/composables/useConfirm.js';

const { isVisible, message, cancel, submit } = useConfirm();
</script>
