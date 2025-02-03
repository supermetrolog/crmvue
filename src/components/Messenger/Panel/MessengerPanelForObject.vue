<template>
    <div class="messenger-panel">
        <MessengerTabs @switch="switchTab" :current="currentTab" :tabs="tabs" />
        <MessengerPanelLoader v-if="isLoading" />
        <MessengerPanelEmpty v-else-if="!hasPanel" />
        <div v-if="hasPanel" v-show="!isLoading" class="messenger-panel__wrapper">
            <AnimationTransition :speed="0.3">
                <MessengerPanelContent v-if="currentTab === PANEL_TABS.COMPANY" />
                <MessengerPanelRenter v-else class="w-100" />
            </AnimationTransition>
        </div>
    </div>
</template>
<script setup>
import MessengerPanelContent from '@/components/Messenger/Panel/MessengerPanelContent.vue';
import MessengerPanelEmpty from '@/components/Messenger/Panel/MessengerPanelEmpty.vue';
import MessengerPanelLoader from '@/components/Messenger/Panel/MessengerPanelLoader.vue';
import { useStore } from 'vuex';
import MessengerTabs from '@/components/Messenger/MessengerTabs.vue';
import { computed, shallowRef, watch } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import MessengerPanelRenter from '@/components/Messenger/Panel/MessengerPanelRenter.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const PANEL_TABS = {
    COMPANY: 1
};

const tabs = [{ id: PANEL_TABS.COMPANY, key: 'company', label: 'Компания' }];

const store = useStore();
const { isLoading } = useDelayedLoader(store.state.Messenger.loadingPanel);

const currentTab = shallowRef(PANEL_TABS.COMPANY);

const hasPanel = computed(() => {
    return (
        store.state.Messenger.currentAsideDialogID != null ||
        store.state.Messenger.currentPanelCompanyID != null
    );
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
