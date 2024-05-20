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

export default {
    name: 'MessengerChatMessageAdditionsAlert',
    components: { MessengerChatMessageAdditionsItem, HoverActionsButton },
    inject: ['$confirmPopup', '$editAddition', '$messageID'],
    props: {
        addition: {
            type: Object,
            required: true
        }
    },
    computed: {
        usersText() {
            return this.addition.user.userProfile.middle_name;
        }
    },
    methods: {
        async remove() {
            const confirmed = await this.$confirmPopup(
                'Вы уверены, что хотите безвозвратно удалить уведомление?'
            );

            if (confirmed) {
                const deleted = await this.$store.dispatch('Messenger/deleteAddition', {
                    messageID: this.$messageID,
                    additionID: this.addition.id,
                    additionType: 'alert'
                });

                if (deleted) this.$toast('Уведомление удалено.');
                else this.$toast('Произошла ошибка. Попробуйте позже.');
            }
        }
    }
};
</script>
