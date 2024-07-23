<template>
    <MessengerChatMessageAdditionsItem :class="{ completed: isCompleted, expired: isExpired }">
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
<script setup>
import dayjs from 'dayjs';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import MessengerChatMessageAdditionsItem from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsItem.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import { useNotify } from '@/utils/useNotify.js';
import { taskOptions } from '@/const/options/task.options.js';

const $editAddition = inject('$editAddition');
const $messageID = inject('$messageID');
const $editTaskStatus = inject('$editTaskStatus');

const props = defineProps({
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
});

const { confirm } = useConfirm();
const notify = useNotify();
const store = useStore();

const usersText = computed(() => props.addition.user.userProfile.middle_name);
const expiredDate = computed(() => dayjs(props.addition.end).format('DD.MM.YYYY'));
const isExpired = computed(() => dayjs(props.addition.end).diff(dayjs(), 'day') <= 3);
const isCompleted = computed(
    () =>
        props.addition.status === taskOptions.statusTypes.COMPLETED ||
        props.addition.status === taskOptions.statusTypes.CANCELED
);

const remove = async () => {
    const confirmed = await confirm('Вы уверены, что хотите безвозвратно удалить задачу?');

    if (confirmed) {
        const deleted = await store.dispatch('Messenger/deleteAddition', {
            messageID: $messageID,
            additionID: props.addition.id,
            additionType: 'task'
        });

        if (deleted) notify.success('Задача удалена.');
        else notify.error('Произошла ошибка. Попробуйте позже.');
    }
};
</script>
