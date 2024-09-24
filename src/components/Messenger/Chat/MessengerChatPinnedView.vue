<template>
    <Modal @close="$emit('close')" show title="Просмотр закрепленного сообщения" width="800">
        <div class="col-12 my-5">
            <MessengerChatMessage v-if="message" :message="message" pinned />
        </div>
    </Modal>
</template>
<script setup>
import MessengerChatMessage from '@/components/Messenger/Chat/Message/MessengerChatMessage.vue';
import Modal from '@/components/common/Modal.vue';
import { useStore } from 'vuex';
import { dayjsFromMoscow } from '@/utils/index.js';
import { computed } from 'vue';

defineEmits(['close']);

const store = useStore();

const message = computed(() => {
    const pinned = store.state.Messenger.currentPinned;
    pinned.dayjs_date = dayjsFromMoscow(pinned.created_at);

    return pinned;
});
</script>
