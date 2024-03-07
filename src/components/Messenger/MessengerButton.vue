<template>
    <div class="messenger-button">
        <MessengerButtonElement
            v-tippy="tasksButtonTitle"
            name="tasks"
            icon="fa-solid fa-bolt"
            :label="countNewTasks"
        />
        <MessengerButtonElement
            v-tippy="notificationsButtonTitle"
            name="info"
            icon="fa-solid fa-exclamation"
            :label="countNewNotifications"
        />
        <MessengerButtonElement
            v-tippy="remindersButtonTitle"
            name="notifications"
            icon="fa-solid fa-bell"
            :label="countNewReminders"
        />
        <MessengerButtonElement
            v-tippy="messagesButtonTitle"
            name="messages"
            icon="fa-solid fa-envelope"
            :label="countNewMessages"
        />
    </div>
</template>
<script>
import MessengerButtonElement from '@/components/Messenger/MessengerButtonElement.vue';
import { mapState } from 'vuex';
import { task } from '@vue/cli-plugin-eslint/ui/taskDescriptor';
import plural from 'plural-ru';
import { messenger } from '@/const/messenger';

export default {
    name: 'MessengerButton',
    components: { MessengerButtonElement },
    computed: {
        task() {
            return task;
        },
        ...mapState({
            countNewTasks: state => state.Messenger.countNewTasks,
            countNewMessages: state => state.Messenger.countNewMessages,
            countNewNotifications: state => state.Messenger.countNewNotifications,
            countNewReminders: state => state.Messenger.countNewReminders
        }),
        tasksButtonTitle() {
            if (this.countNewTasks)
                return plural(this.countNewTasks, ...messenger.buttons.tasks.plural);

            return messenger.buttons.tasks.empty;
        },
        messagesButtonTitle() {
            if (this.countNewMessages)
                return plural(this.countNewMessages, ...messenger.buttons.messages.plural);

            return messenger.buttons.messages.empty;
        },
        notificationsButtonTitle() {
            if (this.countNewNotifications)
                return plural(
                    this.countNewNotifications,
                    ...messenger.buttons.notifications.plural
                );

            return messenger.buttons.notifications.empty;
        },
        remindersButtonTitle() {
            if (this.countNewReminders)
                return plural(this.countNewReminders, ...messenger.buttons.reminders.plural);

            return messenger.buttons.reminders.empty;
        }
    }
};
</script>
