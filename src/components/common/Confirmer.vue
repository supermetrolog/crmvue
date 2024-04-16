<template>
    <Modal
        v-if="opened"
        @close="close"
        width="450"
        class="confirmer"
        title="Подтверждение действия"
    >
        <p class="confirmer__text">{{ promiseProps }}</p>
        <div class="confirmer__actions">
            <MessengerButton @click="resolve" color="success">Подтвердить</MessengerButton>
            <MessengerButton @click="close" color="danger">Отмена</MessengerButton>
        </div>
    </Modal>
</template>
<script>
import { AsyncModalMixin } from '@/components/common/mixins';
import Modal from '@/components/common/Modal.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';

export default {
    name: 'Confirmer',
    components: { MessengerButton, Modal },
    mixins: [AsyncModalMixin]
};
</script>
