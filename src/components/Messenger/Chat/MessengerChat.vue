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

const props = defineProps({
    currentTab: {
        type: Object,
        default: null
    }
});

const currentMessengerChatComponent = computed(() => {
    if (props.currentTab.name === messenger.tabs.USERS) return MessengerChatForUser;
    else return MessengerChatForObject;
});
</script>
