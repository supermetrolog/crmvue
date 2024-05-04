<template>
    <MessengerChatMessageAdditionsItem>
        <template #icon>
            <span class="messenger-chat-message-addition__icon rounded-icon bg-red">
                <i class="fa-solid fa-bell"></i>
            </span>
        </template>
        <template #content>Напоминание {{ formattedDate }} для {{ usersText }}</template>
        <template #actions>
            <HoverActionsButton @click="$editReminder(addition)" label="Редактировать">
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
    inject: ['$confirmPopup', '$editReminder'],
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
                await this.$store.dispatch('Messenger/removeAddition', this.addition);
                this.$toast('Напоминание удалено.');
            }
        }
    }
};
</script>
