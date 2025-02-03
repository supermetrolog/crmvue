<template>
    <div class="messenger-column">
        <AnimationTransition :speed="0.5">
            <component :is="currentMessengerChatComponent" />
        </AnimationTransition>
    </div>
</template>
<script setup>
import { messenger } from '@/const/messenger.js';
import { computed } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatForObject from '@/components/Messenger/Chat/MessengerChatForObject.vue';
import MessengerChatForUser from '@/components/Messenger/Chat/MessengerChatForUser.vue';
import { createMessengerChatContext } from '@/components/Messenger/Chat/useMessengerChatContext.js';
import { useStore } from 'vuex';

createMessengerChatContext();

const store = useStore();

const currentMessengerChatComponent = computed(() => {
    if (store.state.Messenger.currentContentPanel === messenger.tabs.USERS)
        return MessengerChatForUser;
    else return MessengerChatForObject;
});
</script>
