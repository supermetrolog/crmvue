<template>
    <div class="messenger-panel">
        <MessengerTabs @switch="switchTab" :current="currentTab" :tabs="tabs"> </MessengerTabs>
        <MessengerPanelLoader v-if="isLoading" />
        <MessengerPanelEmpty v-else-if="!hasPanel" />
        <div v-if="hasPanel" v-show="!isLoading" class="messenger-panel__wrapper">
            <AnimationTransition :speed="0.3">
                <MessengerPanelUser v-if="currentTab === PANEL_TABS.USER" />
                <InProgress v-else class="h-100" />
            </AnimationTransition>
        </div>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import MessengerTabs from '@/components/Messenger/MessengerTabs.vue';
import { computed, shallowRef, watch } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import InProgress from '@/components/common/InProgress.vue';
import MessengerPanelLoader from '@/components/Messenger/Panel/MessengerPanelLoader.vue';
import MessengerPanelEmpty from '@/components/Messenger/Panel/MessengerPanelEmpty.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerPanelUser from '@/components/Messenger/Panel/MessengerPanelUser.vue';

const PANEL_TABS = {
    USER: 1,
    STATISTIC: 2
};

const tabs = [
    { id: PANEL_TABS.USER, key: 'user', label: 'Профиль' },
    { id: PANEL_TABS.STATISTIC, key: 'statistic', label: 'Статистика' }
];

const store = useStore();
const { isLoading } = useDelayedLoader(store.state.Messenger.loadingPanel);

const currentTab = shallowRef(PANEL_TABS.USER);

const hasPanel = computed(() => {
    return store.state.Messenger.currentPanelUserID;
});

watch(
    () => store.state.Messenger.loadingPanel,
    value => {
        isLoading.value = value;
    }
);

const switchTab = tabId => {
    currentTab.value = tabId;
};
</script>
