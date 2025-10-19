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
                v-model:filters="filters.object"
                @load="load($event, 'object')"
                :objects="chatMembersObjects.data"
                :pagination="chatMembersObjects.pagination"
            />
            <MessengerAsideCompanies
                ref="asideCompanies"
                v-model:filters="filters.company"
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
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { messenger } from '@/const/messenger.js';
import { useDebounceFn, useElementSize } from '@vueuse/core';
import MessengerAsideCompanies from '@/components/Messenger/Aside/MessengerAsideCompanies.vue';
import { useMessengerContext } from '@/components/Messenger/useMessengerContext.js';

const props = defineProps({
    currentTab: {
        type: Object,
        default: null
    }
});

const store = useStore();
const { filters } = useMessengerContext();

const asideOffers = useTemplateRef('asideOffers');
const asideCompanies = useTemplateRef('asideCompanies');
const isReversing = ref(false);

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

watch(
    () => [props.currentTab.name, props.currentTab.sort],
    ([newTabName, newTabSort], [oldTabName, oldTabSort]) => {
        if (newTabSort !== oldTabSort) debouncedUpdateDialogs();
        else if (newTabSort !== null && newTabName !== oldTabName) debouncedUpdateDialogs();
    }
);

const createPayload = () => {
    const payload = {
        company: { ...filters.company },
        object: { ...filters.object },
        request: { ...filters.request }
    };

    if (store.state.Messenger.currentAsidePanel in payload) {
        payload[store.state.Messenger.currentAsidePanel].sort = props.currentTab.sort
            ? `${props.currentTab.sort},-default`
            : '-default';
    }

    return payload;
};

const load = async ($state, modelType) => {
    const isLastPage = await store.dispatch('Messenger/loadDialogs', {
        modelType,
        payload: createPayload()[modelType]
    });

    if (isLastPage) $state.complete();
    else $state.loaded();
};

const updateDialogs = () => store.dispatch('Messenger/updateDialogs', createPayload());
const debouncedUpdateDialogs = useDebounceFn(updateDialogs, 500);

watch(filters, debouncedUpdateDialogs, { deep: true });

onMounted(() => {
    if (!hasQuery.value && !hasDialogs.value) updateDialogs();
});
</script>
