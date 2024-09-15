<template>
    <div class="messenger-bar">
        <MessengerBarTab
            @select="$emit('select', messenger.tabs.OBJECTS, $event)"
            label="Предложения"
            :class="{ active: current?.name === messenger.tabs.OBJECTS }"
            :counts="objectCounts"
            :current="current.sort"
        />
        <MessengerBarTab
            @select="$emit('select', messenger.tabs.REQUESTS, $event)"
            label="Запросы"
            :class="{ active: current?.name === messenger.tabs.REQUESTS }"
            :counts="requestCounts"
            :current="current.sort"
        />
        <MessengerBarTab
            @select="$emit('select', messenger.tabs.USERS, $event)"
            label="Сотрудники"
            :class="{ active: current?.name === messenger.tabs.USERS }"
            :counts="userCounts"
            :current="current.sort"
        />
    </div>
</template>
<script></script>
<script setup>
import MessengerBarTab from '@/components/Messenger/MessengerBarTab.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { messenger } from '@/const/messenger.js';

defineEmits(['select']);
defineProps({
    current: {
        type: Object,
        default: null
    }
});

const store = useStore();

const objectCounts = computed(() => store.state.Messenger.counts.objects);
const requestCounts = computed(() => store.state.Messenger.counts.requests);
const userCounts = computed(() => store.state.Messenger.counts.users);
</script>
