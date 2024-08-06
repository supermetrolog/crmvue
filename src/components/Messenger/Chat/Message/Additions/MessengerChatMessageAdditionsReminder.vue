<template>
    <MessengerChatMessageAdditionsItem>
        <template #icon>
            <span
                v-tippy="addition.message"
                class="messenger-chat-message-addition__icon rounded-icon bg-red"
            >
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
import { useConfirm } from '@/composables/useConfirm.js';

export default {
    name: 'MessengerChatMessageAdditionsReminder',
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
        },
        formattedDate() {
            return dayjs(this.addition.notify_at).format('DD.MM.YYYY в HH:MM');
        }
    },
    methods: {
        async remove() {
            const confirmed = await this.confirm(
                'Вы уверены, что хотите безвозвратно удалить напоминание?'
            );

            if (confirmed) {
                const deleted = await this.$store.dispatch('Messenger/deleteAddition', {
                    messageID: this.$messageID,
                    additionID: this.addition.id,
                    additionType: 'reminder'
                });

                if (deleted) this.$notify('Напоминание удалено.');
                else this.$notify('Произошла ошибка. Попробуйте позже.');
            }
        }
    }
};
</script>
