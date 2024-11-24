<template>
    <div class="messenger-bar">
        <MessengerBarTab
            @select="$emit('select', messenger.tabs.OBJECTS, $event)"
            label="Предложения"
            :class="{ active: current?.name === messenger.tabs.OBJECTS }"
            :counts="objectCounts"
            :current="current.sort"
            :loading="isInitialLoading.objects"
        >
            <template #icon>
                <IconWarehouse />
            </template>
        </MessengerBarTab>
        <MessengerBarTab
            @select="$emit('select', messenger.tabs.COMPANIES, $event)"
            label="Компании"
            :class="{ active: current?.name === messenger.tabs.COMPANIES }"
            :counts="companiesCounts"
            :current="current.sort"
            :loading="isInitialLoading.companies"
        >
            <template #icon>
                <IconCompanies class="messenger-bar__company-icon" />
            </template>
        </MessengerBarTab>
        <MessengerBarTab
            @select="$emit('select', messenger.tabs.USERS, $event)"
            label="Сотрудники"
            icon="fa-solid fa-users"
            :class="{ active: current?.name === messenger.tabs.USERS }"
            :counts="userCounts"
            :current="current.sort"
            :loading="isInitialLoading.users"
        />
    </div>
</template>
<script setup>
import MessengerBarTab from '@/components/Messenger/MessengerBarTab.vue';
import { computed, onMounted, shallowReactive, watch } from 'vue';
import { useStore } from 'vuex';
import { messenger } from '@/const/messenger.js';
import IconWarehouse from '@/components/common/Icons/IconWarehouse.vue';
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core';
import { DELAY_BETWEEN_UPDATING_STATISTICS } from '@/configs/messenger.config.js';
import IconCompanies from '@/components/common/Icons/IconCompanies.vue';

defineEmits(['select']);
defineProps({
    current: {
        type: Object,
        default: null
    }
});

const store = useStore();

const isInitialLoading = shallowReactive({
    objects: true,
    companies: true,
    users: true
});

const objectCounts = computed(() => store.state.Messenger.counts.object);
const companiesCounts = computed(() => store.state.Messenger.counts.company);
const userCounts = computed(() => store.state.Messenger.counts.user);

function updateStatistics() {
    store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.OBJECT]);
    store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.COMPANY]);
    store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.USER]);
}

const statisticsInterval = useIntervalFn(updateStatistics, DELAY_BETWEEN_UPDATING_STATISTICS);

const documentVisibility = useDocumentVisibility();

watch(documentVisibility, (current, prev) => {
    if (current === 'visible' && prev === 'hidden') {
        statisticsInterval.resume();
    } else {
        statisticsInterval.pause();
    }
});

async function fetchObjectsStatistics() {
    isInitialLoading.objects = true;
    await store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.OBJECT]);
    isInitialLoading.objects = false;
}

async function fetchCompaniesStatistics() {
    isInitialLoading.companies = true;
    await store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.COMPANY]);
    isInitialLoading.companies = false;
}

async function fetchUsersStatistics() {
    isInitialLoading.users = true;
    await store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.USER]);
    isInitialLoading.users = false;
}

function fetchStatistics() {
    fetchObjectsStatistics();
    fetchCompaniesStatistics();
    fetchUsersStatistics();
}

onMounted(() => {
    fetchStatistics();
});
</script>
