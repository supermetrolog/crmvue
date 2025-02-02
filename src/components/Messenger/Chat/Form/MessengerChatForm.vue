<template>
    <component :is="currentComponent" @cancel-reply="$emit('cancel-reply')" :reply-to="replyTo" />
</template>
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import MessengerChatFormForObject from '@/components/Messenger/Chat/Form/MessengerChatFormForObject.vue';
import MessengerChatFormForUser from '@/components/Messenger/Chat/Form/MessengerChatFormForUser.vue';
import { messenger } from '@/const/messenger.js';

const COMPONENTS = {
    [messenger.tabs.OBJECTS]: MessengerChatFormForObject,
    [messenger.tabs.REQUESTS]: MessengerChatFormForObject,
    [messenger.tabs.COMPANIES]: MessengerChatFormForObject,
    [messenger.tabs.USERS]: MessengerChatFormForUser
};

defineEmits(['cancel-reply']);
defineProps({
    replyTo: {
        type: Object,
        default: null
    }
});

const store = useStore();

const currentComponent = computed(() => {
    if (store.state.Messenger.currentContentPanel)
        return COMPONENTS[store.state.Messenger.currentContentPanel];
    return COMPONENTS[messenger.tabs.OBJECTS];
});
</script>
