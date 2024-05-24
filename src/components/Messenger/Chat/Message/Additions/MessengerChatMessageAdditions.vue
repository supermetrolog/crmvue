<template>
    <div class="messenger-chat-message__additions">
        <MessengerChatMessageAdditionsTask
            v-for="addition in activeAdditions.tasks"
            :key="addition"
            :addition="addition"
            :editable="userCanEdit('task', addition)"
            :draggable="userCanDrag('task', addition)"
        />
    </div>
</template>
<script>
import MessengerChatMessageAdditionsTask from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsTask.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'MessengerChatMessageAdditions',
    components: {
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
                acc[key] = this.additions[key].filter(addition => addition.deleted_at === null);
                return acc;
            }, {});
        }
    },
    methods: {
        userCanDrag(additionType, addition) {
            if (additionType === 'task') {
                return (
                    Number(addition.created_by_id) === Number(this.currentUser.id) ||
                    Number(addition.user_id) === Number(this.currentUser.id) ||
                    this.$store.getters.isModerator
                );
            }

            return false;
        },
        userCanEdit(additionType, addition) {
            if (additionType === 'task') {
                return (
                    Number(addition.created_by_id) === Number(this.currentUser.id) ||
                    this.$store.getters.isModerator
                );
            }

            return false;
        }
    }
};
</script>
