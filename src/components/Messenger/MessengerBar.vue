<template>
    <div class="messenger-bar">
        <MessengerBarElement
            v-tippy="tasksButtonTitle"
            :class="{ disabled: !countNewTasks }"
            color="black"
            icon="fa-solid fa-bolt"
            :label="countNewTasks"
        />
        <MessengerBarElement
            v-tippy="notificationsButtonTitle"
            :class="{ disabled: !countNewNotifications }"
            color="orange"
            icon="fa-solid fa-exclamation"
            :label="countNewNotifications"
        />
        <MessengerBarElement
            v-tippy="remindersButtonTitle"
            :class="{ disabled: !countNewReminders }"
            color="red"
            icon="fa-solid fa-bell"
            :label="countNewReminders"
        />
        <MessengerBarElement
            v-tippy="messagesButtonTitle"
            :class="{ disabled: !countNewMessages }"
            icon="fa-solid fa-envelope"
            :label="countNewMessages"
        />
    </div>
</template>
<script>
import MessengerBarElement from '@/components/Messenger/MessengerBarElement.vue';
import { mapState } from 'vuex';
import plural from 'plural-ru';
import { messenger } from '@/const/messenger';

export default {
    name: 'MessengerBar',
    components: { MessengerBarElement },
    computed: {
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
