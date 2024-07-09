<template>
    <MessengerChatMessageAdditionsItem class="messenger-chat-message-addition--warning">
        <template #icon>
            <span
                v-tippy="addition.message"
                class="messenger-chat-message-addition__icon rounded-icon bg-orange"
            >
                <i class="fa-solid fa-exclamation"></i>
            </span>
        </template>
        <template #content>С уведомлением для {{ usersText }}</template>
        <template #actions>
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
<script>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import MessengerChatMessageAdditionsItem from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsItem.vue';
import { useConfirm } from '@/composables/useConfirm.js';

export default {
    name: 'MessengerChatMessageAdditionsAlert',
    components: { MessengerChatMessageAdditionsItem, HoverActionsButton },
    inject: ['$editAddition', '$messageID'],
    props: {
        addition: {
            type: Object,
            required: true
        }
    },
    setup() {
        const { confirm } = useConfirm();
        return { confirm };
    },
    computed: {
        usersText() {
            return this.addition.user.userProfile.middle_name;
        }
    },
    methods: {
        async remove() {
            const confirmed = await this.confirm(
                'Вы уверены, что хотите безвозвратно удалить уведомление?'
            );

            if (confirmed) {
                const deleted = await this.$store.dispatch('Messenger/deleteAddition', {
                    messageID: this.$messageID,
                    additionID: this.addition.id,
                    additionType: 'alert'
                });

                if (deleted) this.$notify('Уведомление удалено.');
                else this.$notify('Произошла ошибка. Попробуйте позже.');
            }
        }
    }
};
</script>
