<template>
    <div class="messenger-aside__page">
        <MessengerAsideHeader @load="updateDialogs" />
        <div
            class="messenger-aside__body messenger-aside__offers"
            :class="{ reversed: isReversed, reversing: isReversing }"
            :style="{
                '--offers-height': offersListHeight + 'px',
                '--companies-height': companiesListHeight + 'px',
                '--negative-offers-height': '-' + offersListHeight + 'px',
                '--negative-companies-height': '-' + companiesListHeight + 'px'
            }"
        >
            <MessengerAsideObjects
                ref="asideOffers"
                @load="load($event, 'object')"
                :objects="chatMembersObjects.data"
                :pagination="chatMembersObjects.pagination"
            />
            <MessengerAsideCompanies
                ref="asideCompanies"
                @load="load($event, 'company')"
                :companies="chatMembersCompanies.data"
                :pagination="chatMembersCompanies.pagination"
            />
        </div>
    </div>
</template>
<script setup>
import MessengerAsideHeader from '@/components/Messenger/Aside/MessengerAsideHeader.vue';
import { useStore } from 'vuex';
import MessengerAsideObjects from '@/components/Messenger/Aside/MessengerAsideObjects.vue';
import { computed, onBeforeMount, shallowRef, useTemplateRef, watch } from 'vue';
import { messenger } from '@/const/messenger.js';
import { useDebounceFn, useElementSize } from '@vueuse/core';
import MessengerAsideCompanies from '@/components/Messenger/Aside/MessengerAsideCompanies.vue';

const props = defineProps({
    currentTab: {
        type: Object,
        default: null
    }
});

const store = useStore();

const asideOffers = useTemplateRef('asideOffers');
const asideCompanies = useTemplateRef('asideCompanies');
const isReversing = shallowRef(false);

const { height: offersListHeight } = useElementSize(asideOffers);
const { height: companiesListHeight } = useElementSize(asideCompanies);

const debouncedStopReversing = useDebounceFn(() => {
    isReversing.value = false;
}, 800);

const hasQuery = computed(() => store.getters['Messenger/hasQuery']);
const hasDialogs = computed(() => store.getters['Messenger/hasDialogs']);
const chatMembersObjects = computed(() => store.state.Messenger.chatMembersObject);
const chatMembersCompanies = computed(() => store.state.Messenger.chatMembersCompany);
const isReversed = computed(() => props.currentTab.name === messenger.tabs.COMPANIES);

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
