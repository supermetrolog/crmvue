<template>
    <div class="messenger-chat-message__additions">
        <MessengerChatMessageAdditionsTask
            v-for="addition in activeAdditions.tasks"
            :key="addition"
            :addition="addition"
            :editable="userCanEdit(addition)"
            :draggable="userCanDrag(addition)"
        />
        <MessengerChatMessageAdditionsAlert
            v-for="addition in activeAdditions.alerts"
            :key="addition"
            :addition="addition"
            :editable="userCanEdit(addition)"
            :draggable="userCanDrag(addition)"
        />
        <MessengerChatMessageAdditionsReminder
            v-for="addition in activeAdditions.reminders"
            :key="addition"
            :addition="addition"
            :editable="userCanEdit(addition)"
            :draggable="userCanDrag(addition)"
        />
    </div>
</template>
<script>
import MessengerChatMessageAdditionsTask from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsTask.vue';
import { mapGetters } from 'vuex';
import MessengerChatMessageAdditionsAlert from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsAlert.vue';
import MessengerChatMessageAdditionsReminder from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsReminder.vue';

export default {
    name: 'MessengerChatMessageAdditions',
    components: {
        MessengerChatMessageAdditionsReminder,
        MessengerChatMessageAdditionsAlert,
        MessengerChatMessageAdditionsTask
    },
    props: {
        additions: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({ currentUser: 'THIS_USER' }),
        activeAdditions() {
            // Определение только активных задач/напоминаний и т.д
            return Object.keys(this.additions).reduce((acc, key) => {
                acc[key] = this.additions[key].filter(addition => addition.deleted_at == null);
                return acc;
            }, {});
        }
    },
    methods: {
        userCanDrag(addition) {
            return (
                Number(addition.created_by_id) === Number(this.currentUser.id) ||
                Number(addition.user_id) === Number(this.currentUser.id) ||
                this.$store.getters.isModerator
            );
        },
        userCanEdit(addition) {
            return (
                Number(addition.created_by_id) === Number(this.currentUser.id) ||
                this.$store.getters.isModerator
            );
        }
    }
};
</script>
