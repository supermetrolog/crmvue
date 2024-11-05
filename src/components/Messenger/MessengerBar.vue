<template>
    <div class="messenger-bar">
        <MessengerBarTab
            @select="$emit('select', messenger.tabs.OBJECTS, $event)"
            label="Предложения"
            :class="{ active: current?.name === messenger.tabs.OBJECTS }"
            :counts="objectCounts"
            :current="current.sort"
            :loading="isInitialLoading"
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
            :loading="isInitialLoading"
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
            :loading="isInitialLoading"
        />
    </div>
</template>
<script setup>
import MessengerBarTab from '@/components/Messenger/MessengerBarTab.vue';
import { computed, onMounted, shallowRef, watch } from 'vue';
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

const isInitialLoading = shallowRef(true);

const objectCounts = computed(() => store.state.Messenger.counts.object);
const companiesCounts = computed(() => store.state.Messenger.counts.company);
const userCounts = computed(() => store.state.Messenger.counts.user);

const statisticsInterval = useIntervalFn(() => {
    store.dispatch('Messenger/updateCounters');
}, DELAY_BETWEEN_UPDATING_STATISTICS);

const documentVisibility = useDocumentVisibility();

watch(documentVisibility, (current, prev) => {
    if (current === 'visible' && prev === 'hidden') {
        statisticsInterval.resume();
    } else {
        statisticsInterval.pause();
    }
});

onMounted(async () => {
    isInitialLoading.value = true;
    await store.dispatch('Messenger/updateCounters');
    isInitialLoading.value = false;
});
</script>
