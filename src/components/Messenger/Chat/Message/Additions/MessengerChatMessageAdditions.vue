<template>
    <div class="messenger-chat-message__additions">
        <MessengerChatMessageAdditionsTask
            v-for="addition in activeAdditions.tasks"
            :key="addition"
            :addition="addition"
        />
    </div>
</template>
<script>
import MessengerChatMessageAdditionsTask from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsTask.vue';

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
        activeAdditions() {
            // Определение только активных задач/напоминаний и т.д
            return Object.keys(this.additions).reduce((acc, key) => {
                acc[key] = this.additions[key].filter(addition => addition.deleted_at === null);
                return acc;
            }, {});
        }
    }
};
</script>
