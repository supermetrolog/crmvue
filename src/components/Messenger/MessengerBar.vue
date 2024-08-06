<template>
    <div class="messenger-bar">
        <MessengerBarElement
            v-if="unreadTaskCount > 0"
            v-tippy="tasksButtonTitle"
            :class="{ disabled: !unreadTaskCount }"
            color="black"
            icon="fa-solid fa-bolt"
            :label="unreadTaskCount"
        />
        <MessengerBarElement
            v-if="unreadNotificationCount > 0"
            v-tippy="alertsButtonTitle"
            :class="{ disabled: !unreadNotificationCount }"
            color="orange"
            icon="fa-solid fa-exclamation"
            :label="unreadNotificationCount"
        />
        <MessengerBarElement
            v-if="unreadReminderCount > 0"
            v-tippy="remindersButtonTitle"
            :class="{ disabled: !unreadReminderCount }"
            color="red"
            icon="fa-solid fa-bell"
            :label="unreadReminderCount"
        />
        <MessengerBarElement
            v-tippy="messagesButtonTitle"
            :class="{ disabled: !unreadMessageCount }"
            icon="fa-solid fa-envelope"
            :label="unreadMessageCount"
        />
    </div>
</template>
<script setup>
import MessengerBarElement from '@/components/Messenger/MessengerBarElement.vue';
import { useStore } from 'vuex';
import plural from 'plural-ru';
import { messenger } from '@/const/messenger';
import { computed } from 'vue';

const store = useStore();

const unreadTaskCount = computed(() => store.state.Messenger.unreadTaskCount);
const unreadMessageCount = computed(() => store.state.Messenger.unreadMessageCount);
const unreadNotificationCount = computed(() => store.state.Messenger.unreadNotificationCount);
const unreadReminderCount = computed(() => store.state.Messenger.unreadReminderCount);

const tasksButtonTitle = computed(() => {
    if (unreadTaskCount.value > 0)
        return plural(unreadTaskCount.value, ...messenger.buttons.tasks.plural);
    return messenger.buttons.tasks.empty;
});

const messagesButtonTitle = computed(() => {
    if (unreadMessageCount.value > 0)
        return plural(unreadMessageCount.value, ...messenger.buttons.messages.plural);
    return messenger.buttons.messages.empty;
});

const alertsButtonTitle = computed(() => {
    if (unreadNotificationCount.value > 0)
        return plural(unreadNotificationCount.value, ...messenger.buttons.alerts.plural);
    return messenger.buttons.alerts.empty;
});

const remindersButtonTitle = computed(() => {
    if (unreadReminderCount.value > 0)
        return plural(unreadReminderCount.value, ...messenger.buttons.reminders.plural);
    return messenger.buttons.reminders.empty;
});
</script>
