<template>
    <div class="messenger-page">
        <AnimationTransition :speed="0.5">
            <component :is="currentMessengerAsideComponent" :current-tab="currentTab" />
        </AnimationTransition>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { messenger } from '@/const/messenger.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerAsideConsultants from '@/components/Messenger/Aside/MessengerAsideConsultants.vue';
import MessengerAsideOffers from '@/components/Messenger/Aside/MessengerAsideOffers.vue';

const props = defineProps({
    currentTab: Object
});

const currentMessengerAsideComponent = computed(() => {
    if (props.currentTab?.name === messenger.tabs.USERS) return MessengerAsideConsultants;
    else return MessengerAsideOffers;
});
</script>
