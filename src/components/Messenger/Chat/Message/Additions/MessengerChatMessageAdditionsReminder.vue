<template>
    <MessengerChatMessageAdditionsItem>
        <template #icon>
            <span class="messenger-chat-message-addition__icon rounded-icon bg-red">
                <i class="fa-solid fa-bell"></i>
            </span>
        </template>
        <template #content>Напоминание {{ formattedDate }} для {{ usersText }}</template>
        <template #actions>
            <HoverActionsButton
                @click="
                    $editAddition({
                        messageID: $messageID,
                        addition,
                        additionType: 'reminder',
                        successMessage: 'Напоминание успешно создано!'
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
import dayjs from 'dayjs';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import MessengerChatMessageAdditionsItem from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsItem.vue';

export default {
    name: 'MessengerChatMessageAdditionsReminder',
    components: { MessengerChatMessageAdditionsItem, HoverActionsButton },
    inject: ['$confirmPopup', '$editAddition'],
    props: {
        addition: {
            type: Object,
            required: true
        }
    },
    computed: {
        usersText() {
            if (this.addition?.users === null) return 'всех';
            else return this.addition?.users.join(', ');
        },
        formattedDate() {
            return dayjs(this.addition.reminder).format('DD.MM.YYYY в HH:MM');
        }
    },
    methods: {
        async remove() {
            const confirmed = await this.$confirmPopup(
                'Вы уверены, что хотите безвозвратно удалить напоминание?'
            );

            if (confirmed) {
                const deleted = await this.$store.dispatch('Messenger/deleteAddition', {
                    messageID: this.$messageID,
                    additionID: this.addition.id,
                    additionType: 'reminder'
                });

                if (deleted) this.$toast('Напоминание удалено.');
                else this.$toast('Произошла ошибка. Попробуйте позже.');
            }
        }
    }
};
</script>
