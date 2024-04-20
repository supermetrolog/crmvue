<template>
    <MessengerChatMessageAdditionsItem class="messenger-chat-message-addition--warning">
        <template #icon>
            <span class="messenger-chat-message-addition__icon rounded-icon bg-orange">
                <i class="fa-solid fa-exclamation"></i>
            </span>
        </template>
        <template #content>С уведомлением для {{ usersText }}</template>
        <template #actions>
            <HoverActionsButton @click="$editNotification(addition)" label="Редактировать">
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
    name: 'MessengerChatMessageAdditionsNotification',
    components: { MessengerChatMessageAdditionsItem, HoverActionsButton },
    inject: ['$confirmPopup', '$editNotification'],
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
        }
    },
    methods: {
        async edit() {
            await this.$;
        },
        async remove() {
            const confirmed = await this.$confirmPopup(
                'Вы уверены, что хотите безвозвратно удалить уведомление?'
            );

            if (confirmed) {
                await this.$store.dispatch('Messenger/removeAddition', this.addition);
                this.$toast('Уведомление удалено.');
            }
        }
    }
};
</script>
