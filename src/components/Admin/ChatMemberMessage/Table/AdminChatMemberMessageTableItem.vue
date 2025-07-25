<template>
    <Tr class="admin-chat-member-message-table-item">
        <Td :width="60" class="text-center">
            {{ message.id }}
        </Td>
        <Td>
            <component
                :is="dialogComponent"
                v-if="message.to"
                :model="message.to.model"
                :statistic="message.to.statistic"
                :last-message="message.to.last_message"
            />
            <p v-else class="text-center">—</p>
        </Td>
        <Td class="py-2">
            <AdminChatMemberMessageTableItemMessage
                @delete="$emit('delete')"
                @pin-to-entity="$emit('pin-to-entity')"
                class="admin-chat-member-message-table-item__message"
                :message
            />
        </Td>
    </Tr>
</template>

<script setup>
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import AdminChatMemberMessageTableItemMessage from '@/components/Admin/ChatMemberMessage/Table/AdminChatMemberMessageTableItemMessage.vue';
import { messenger } from '@/const/messenger.js';
import MessengerDialogCompany from '@/components/Messenger/Dialog/Company/MessengerDialogCompany.vue';
import MessengerDialogUser from '@/components/Messenger/Dialog/MessengerDialogUser.vue';
import MessengerDialogObject from '@/components/Messenger/Dialog/Object/MessengerDialogObject.vue';
import MessengerDialogRequest from '@/components/Messenger/Dialog/MessengerDialogRequest.vue';
import { computed } from 'vue';

defineEmits(['delete', 'pin-to-entity']);
const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

const componentsMap = {
    [messenger.dialogTypes.COMPANY]: MessengerDialogCompany,
    [messenger.dialogTypes.USER]: MessengerDialogUser,
    [messenger.dialogTypes.OBJECT]: MessengerDialogObject,
    [messenger.dialogTypes.REQUEST]: MessengerDialogRequest
};

const dialogComponent = computed(() => {
    return componentsMap[props.message.to.model_type];
});
</script>
