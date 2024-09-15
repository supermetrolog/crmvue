<template>
    <div class="messenger-aside__page">
        <MessengerAsideHeader @load="updateDialogs" />
        <div
            class="messenger-aside__body messenger-aside__offers"
            :class="{ reversed: isReversed, reversing: isReversing }"
            :style="{
                '--offers-height': offersListHeight + 'px',
                '--requests-height': requestsListHeight + 'px',
                '--negative-offers-height': '-' + offersListHeight + 'px',
                '--negative-requests-height': '-' + requestsListHeight + 'px'
            }"
        >
            <MessengerAsideObjects
                ref="asideOffers"
                @load="load($event, 'object')"
                :objects="chatMembersObjects.data"
                :pagination="chatMembersObjects.pagination"
            />
            <MessengerAsideRequests
                ref="asideRequests"
                @load="load($event, 'request')"
                :requests="chatMembersRequests.data"
                :pagination="chatMembersRequests.pagination"
            />
        </div>
    </div>
</template>
<script setup>
import MessengerAsideHeader from '@/components/Messenger/Aside/MessengerAsideHeader.vue';
import { useStore } from 'vuex';
import MessengerAsideObjects from '@/components/Messenger/Aside/MessengerAsideObjects.vue';
import MessengerAsideRequests from '@/components/Messenger/Aside/MessengerAsideRequests.vue';
import { computed, onBeforeMount, shallowRef, watch } from 'vue';
import { messenger } from '@/const/messenger.js';
import { useDebounceFn, useElementSize } from '@vueuse/core';

const props = defineProps({
    currentTab: {
        type: Object,
        default: null
    }
});

const store = useStore();

const asideOffers = shallowRef(null);
const asideRequests = shallowRef(null);
const isReversing = shallowRef(false);

const { height: offersListHeight } = useElementSize(asideOffers);
const { height: requestsListHeight } = useElementSize(asideRequests);

const debouncedStopReversing = useDebounceFn(() => {
    isReversing.value = false;
}, 800);

const hasQuery = computed(() => store.getters['Messenger/hasQuery']);
const hasDialogs = computed(() => store.getters['Messenger/hasDialogs']);
const chatMembersObjects = computed(() => store.state.Messenger.chatMembersObjects);
const chatMembersRequests = computed(() => store.state.Messenger.chatMembersRequests);
const isReversed = computed(() => props.currentTab.name === messenger.tabs.REQUESTS);

watch(isReversed, () => {
    isReversing.value = true;
    debouncedStopReversing();
});

const load = async ($state, modelType) => {
    const isLastPage = await store.dispatch('Messenger/loadDialogs', {
        modelType,
        payload: {
            sort: props.currentTab.sort ? `${props.currentTab.sort},-default` : '-default'
        }
    });

    if (isLastPage) $state.complete();
    else $state.loaded();
};

watch(
    () => [props.currentTab.name, props.currentTab.sort],
    ([newTabName, newTabSort], [oldTabName, oldTabSort]) => {
        if (newTabSort !== oldTabSort) updateDialogs();
        else if (newTabSort !== null && newTabName !== oldTabName) updateDialogs();
    }
);

const updateDialogs = () =>
    store.dispatch('Messenger/updateDialogs', {
        sort: props.currentTab.sort ? `${props.currentTab.sort},-default` : '-default'
    });

onBeforeMount(() => {
    if (!hasQuery.value && !hasDialogs.value) updateDialogs();
});
</script>
