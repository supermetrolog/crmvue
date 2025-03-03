<template>
    <div class="messenger-bar">
        <MessengerBarTab
            @select="$emit('select', messenger.tabs.OBJECTS, $event)"
            label="Предложения"
            :class="{ active: current?.name === messenger.tabs.OBJECTS }"
            :counts="objectCounts"
            :current="current.sort"
            :loading="isInitialLoading.objects"
        />
        <MessengerBarTab
            @select="$emit('select', messenger.tabs.COMPANIES, $event)"
            label="Компании"
            :class="{ active: current?.name === messenger.tabs.COMPANIES }"
            :counts="companiesCounts"
            :current="current.sort"
            :loading="isInitialLoading.companies"
        />
        <MessengerBarTab
            @select="$emit('select', messenger.tabs.USERS, $event)"
            label="Сотрудники"
            :class="{ active: current?.name === messenger.tabs.USERS }"
            :counts="userCounts"
            :current="current.sort"
            :loading="isInitialLoading.users"
        />
    </div>
</template>
<script setup>
import MessengerBarTab from '@/components/Messenger/MessengerBarTab.vue';
import { onMounted } from 'vue';
import { messenger } from '@/const/messenger.js';
import { useSharedMessengerStatistic } from '@/components/Messenger/useSharedMessengerStatistic.js';

defineEmits(['select']);
defineProps({
    current: {
        type: Object,
        default: null
    }
});

const { fetchStatistics, userCounts, objectCounts, companiesCounts, isInitialLoading } =
    useSharedMessengerStatistic();

onMounted(fetchStatistics);
</script>
