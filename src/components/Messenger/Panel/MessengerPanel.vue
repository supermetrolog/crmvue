<template>
    <div class="messenger-column">
        <AnimationTransition :speed="0.5">
            <component :is="currentMessengerPanelComponent" />
        </AnimationTransition>
    </div>
</template>
<script setup>
import { messenger } from '@/const/messenger.js';
import { computed } from 'vue';
import MessengerPanelForUser from '@/components/Messenger/Panel/MessengerPanelForUser.vue';
import MessengerPanelForObject from '@/components/Messenger/Panel/MessengerPanelForObject.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const props = defineProps({
    currentTab: {
        type: Object,
        default: null
    }
});

const currentMessengerPanelComponent = computed(() => {
    if (props.currentTab.name === messenger.tabs.USERS) return MessengerPanelForUser;
    else return MessengerPanelForObject;
});
</script>
