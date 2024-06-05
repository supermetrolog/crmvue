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
        <template v-if="editable || draggable" #actions>
            <template v-if="editable">
                <HoverActionsButton
                    @click="
                        $editAddition({
                            messageID: $messageID,
                            addition,
                            additionType: 'task',
                            successMessage: 'Задача успешно создана!'
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
            <HoverActionsButton
                v-if="draggable"
                @click.stop="$editTaskStatus($messageID, addition)"
                label="Изменить статус"
            >
                <i class="fa-solid fa-arrow-right-arrow-left"></i>
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
    name: 'MessengerChatMessageAdditionsTask',
    components: { MessengerChatMessageAdditionsItem, HoverActionsButton },
    inject: ['$editAddition', '$messageID', '$editTaskStatus'],
    props: {
        addition: {
            type: Object,
            required: true
        },
        editable: {
            type: Boolean,
            default: false
        },
        draggable: {
            type: Boolean,
            default: false
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
        expiredDate() {
            return dayjs(this.addition.end).format('DD.MM.YYYY');
        },
        isExpired() {
            return dayjs(this.addition.end).diff(dayjs(), 'day') <= 3;
        }
    },
    methods: {
        async remove() {
            const confirmed = await this.confirm(
                'Вы уверены, что хотите безвозвратно удалить задачу?'
            );

            if (confirmed) {
                const deleted = await this.$store.dispatch('Messenger/deleteAddition', {
                    messageID: this.$messageID,
                    additionID: this.addition.id,
                    additionType: 'task'
                });

                if (deleted) this.$toast('Задача удалена.');
                else this.$toast('Произошла ошибка. Попробуйте позже.');
            }
        }
    }
};
</script>
