<template>
    <div class="messenger-chat-message__additions">
        <MessengerChatMessageAdditionsTask
            v-for="task in tasks"
            :key="task.id"
            @read="readTask(task)"
            :addition="task"
            :editable="userCanEdit(task)"
            :draggable="userCanDrag(task)"
        />
        <MessengerChatMessageAdditionsAlert
            v-for="notification in notifications"
            :key="notification.id"
            :addition="notification"
            :editable="userCanEdit(notification)"
            :draggable="userCanDrag(notification)"
        />
    </div>
</template>
<script setup>
import MessengerChatMessageAdditionsTask from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsTask.vue';
import MessengerChatMessageAdditionsAlert from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsAlert.vue';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import api from '@/api/api.js';
import { useNotify } from '@/utils/useNotify.js';

defineProps({
    tasks: {
        type: Array,
        required: true
    },
    notifications: {
        type: Array,
        required: true
    }
});

const store = useStore();
const notify = useNotify();

const userCanDrag = addition => {
    return (
        Number(addition.created_by_id) === Number(store.getters.THIS_USER.id) ||
        Number(addition.user_id) === Number(store.getters.THIS_USER.id) ||
        store.getters.isModerator
    );
};

const userCanEdit = addition => {
    return (
        Number(addition.created_by_id) === Number(store.getters.THIS_USER.id) ||
        store.getters.isModerator
    );
};

const readTask = async task => {
    const payload = {
        chatMemberId: store.state.Messenger.currentDialog.id,
        modelType: store.state.Messenger.currentDialog.model_type
    };

    task.isLoading = true;
    const observed = await api.task.read(task.id);
    task.isLoading = false;

    if (!observed) notify.info('При чтении задачи произошла ошибка. Попробуйте позже.');

    notify.success('Задача успешно прочитана.');
    store.commit('Messenger/onTaskObserved', payload);
    const observerIndex = task.observers.findIndex(
        observer => observer.user_id === store.getters.THIS_USER.id
    );
    if (observerIndex !== -1) task.observers[observerIndex].viewed_at = dayjs();
};
</script>
