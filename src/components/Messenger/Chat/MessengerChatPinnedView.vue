<template>
    <Modal @close="$emit('close')" show title="Просмотр закрепленного сообщения" width="800">
        <div class="d-flex justify-content-center my-5">
            <MessengerChatMessage v-if="message" :message="message" pinned />
        </div>
    </Modal>
</template>
<script>
import MessengerChatMessage from '@/components/Messenger/Chat/Message/MessengerChatMessage.vue';
import Modal from '@/components/common/Modal.vue';
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';

export default {
    name: 'MessengerChatPinnedView',
    components: { Modal, MessengerChatMessage },
    emits: ['close'],
    computed: {
        message() {
            const pinned = this.$store.state.Messenger.currentPinned;
            pinned.dayjs_date = dayjs(pinned.created_at);

            return pinned;
        },
        ...mapGetters({ currentUser: 'THIS_USER' })
    }
};
</script>
