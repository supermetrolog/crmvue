<template>
    <MessengerChatMessageAdditionsItem
        :class="{ completed: addition.completed, expired: isExpired }"
    >
        <template #icon>
            <span
                v-tippy="addition.message"
                class="messenger-chat-message-addition__icon rounded-icon bg-black"
            >
                <i class="fa-solid fa-bolt"></i>
            </span>
        </template>
        <template #content>Задача для {{ usersText }} до {{ expiredDate }}</template>
        <template #actions>
            <HoverActionsButton @click="$editTask($messageID, addition)" label="Редактировать">
                <i class="fa-solid fa-pen"></i>
            </HoverActionsButton>
            <HoverActionsButton @click="remove" label="Удалить">
                <i class="fa-solid fa-trash"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click.stop="complete"
                disabled
                label="Выполнено"
                :active="addition.completed"
            >
                <i class="fa-solid fa-check-double"></i>
            </HoverActionsButton>
        </template>
    </MessengerChatMessageAdditionsItem>
</template>
<script>
import dayjs from 'dayjs';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import MessengerChatMessageAdditionsItem from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsItem.vue';

export default {
    name: 'MessengerChatMessageAdditionsTask',
    components: { MessengerChatMessageAdditionsItem, HoverActionsButton },
    inject: ['$confirmPopup', '$editTask', '$messageID'],
    props: {
        addition: {
            type: Object,
            required: true
        }
    },
    computed: {
        usersText() {
            return this.addition.user.userProfile.middle_name;
        },
        expiredDate() {
            return dayjs(this.addition.end).format('DD.MM.YYYY');
        },
        isExpired() {
            return dayjs(this.addition.end).diff(dayjs(), 'day') <= 3;
        }
    },
    methods: {
        async remove() {
            const confirmed = await this.$confirmPopup(
                'Вы уверены, что хотите безвозвратно удалить задачу?'
            );

            if (confirmed) {
                const deleted = await this.$store.dispatch('Messenger/deleteTask', {
                    messageID: this.$messageID,
                    taskID: this.addition.id
                });

                if (deleted) this.$toast('Задача удалена.');
                else this.$toast('Произошла ошибка. Попробуйте позже.');
            }
        },
        async complete() {
            await this.$store.dispatch('Messenger/completeTask', this.addition);

            this.$toast(
                this.addition.completed
                    ? 'Задача помечена выполненной.'
                    : 'Задача помечена невыполненной.'
            );
        }
    }
};
</script>
