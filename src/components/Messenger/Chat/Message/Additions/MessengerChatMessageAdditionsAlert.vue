<template>
    <MessengerChatMessageAdditionsItem
        class="messenger-chat-message-addition--warning"
        :class="{ completed: isCompleted }"
    >
        <template #icon>
            <span
                v-tippy="addition.subject"
                class="messenger-chat-message-addition__icon rounded-icon bg-orange"
            >
                <i class="fa-solid fa-exclamation"></i>
            </span>
        </template>
        <template #content>С уведомлением для {{ addition.user.userProfile.middle_name }}</template>
        <template v-if="editable" #actions>
            <HoverActionsButton
                @click="
                    $editAddition({
                        messageID: $messageID,
                        addition,
                        additionType: 'alert',
                        successMessage: 'Уведомление успешно обновлено!'
                    })
                "
                label="Редактировать"
            >
                <i class="fa-solid fa-pen"></i>
            </HoverActionsButton>
            <HoverActionsButton @click="remove" label="Удалить">
                <i class="fa-solid fa-trash"></i>
            </HoverActionsButton>
        </template>
    </MessengerChatMessageAdditionsItem>
</template>
<script setup>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import MessengerChatMessageAdditionsItem from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsItem.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import { useNotify } from '@/utils/use/useNotify.js';

const store = useStore();
const { confirm } = useConfirm();
const notify = useNotify();

const $editAddition = inject('$editAddition');
const $messageID = inject('$messageID');

const props = defineProps({
    addition: {
        type: Object,
        required: true
    },
    editable: {
        type: Boolean,
        default: false
    }
});

const isCompleted = computed(() => props.addition.viewed_at !== null);

const remove = async () => {
    const confirmed = await confirm('Вы уверены, что хотите безвозвратно удалить уведомление?');

    if (confirmed) {
        const deleted = await store.dispatch('Messenger/deleteAddition', {
            messageID: $messageID,
            additionID: props.addition.id,
            additionType: 'alert'
        });

        if (deleted) notify.success('Уведомление удалено.');
        else notify.error('Произошла ошибка. Попробуйте позже.');
    }
};
</script>
