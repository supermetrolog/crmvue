<template>
    <div class="messenger-chat-message-actions">
        <HoverActions>
            <HoverActionsButton
                @click="$createNotification(message.id)"
                disabled
                label="Добавить уведомление"
            >
                <i class="fa-solid fa-exclamation"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="$createReminder(message.id)"
                disabled
                label="Добавить напоминание"
            >
                <i class="fa-solid fa-bell"></i>
            </HoverActionsButton>
            <HoverActionsButton @click="$createTask(message.id)" label="Добавить задачу">
                <i class="fa-solid fa-bolt"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="$emit('pinToObject')"
                disabled
                :active="message.pinnedToObject"
                :label="message.pinnedToObject ? 'Открепить от объекта' : 'Закрепить за объектом'"
            >
                <i class="fa-solid fa-warehouse"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="$emit('pin')"
                disabled
                :label="message.pinned ? 'Открепить' : 'Закрепить'"
                :active="message.pinned"
            >
                <i class="fa-solid fa-thumbtack"></i>
            </HoverActionsButton>
            <HoverActionsButton @click="$emit('edit')" disabled label="Редактировать">
                <i class="fa-solid fa-pen"></i>
            </HoverActionsButton>
        </HoverActions>
    </div>
</template>
<script>
import HoverActions from '@/components/common/HoverActions/HoverActions.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

export default {
    name: 'MessengerChatMessageActions',
    components: { HoverActionsButton, HoverActions },
    emits: ['pin', 'edit', 'pinToObject'],
    inject: ['$createTask', '$createReminder', '$createNotification'],
    props: {
        message: {
            type: Object,
            required: true
        }
    }
};
</script>
