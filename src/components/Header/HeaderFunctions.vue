<template>
    <div class="header__functions">
        <HoverActionsButton
            ref="activityButton"
            @click="activityIsVisible = !activityIsVisible"
            :label="activityCountLabelPlural"
            :active="activityIsVisible"
            class="header__button"
        >
            <Spinner v-if="activityIsLoading" class="mini" />
            <i v-else class="fa-solid fa-user-group"></i>
            <span
                v-if="!activityIsLoading"
                class="header__badge badge badge-danger"
                :class="{ 'badge-success': preparedActivityCount > 1 }"
            >
                {{ preparedActivityCount }}
            </span>
        </HoverActionsButton>
        <AnimationTransition>
            <HeaderActivity v-if="activityIsVisible" v-on-click-outside="activityClickOutside" />
        </AnimationTransition>
        <HoverActionsButton
            ref="callsButton"
            @click="callsIsVisible = !callsIsVisible"
            :active="callsIsVisible"
            class="header__button"
            :class="{ 'current-call-exist': CURRENT_CALLS.length }"
        >
            <Spinner v-if="isLoading" class="mini" />
            <i v-else class="header__icon fa-solid fa-phone"></i>
            <span
                v-if="CALLS_COUNT !== 0"
                class="header__badge badge badge-danger"
                :class="{ 'badge-info': CURRENT_CALLS.length }"
            >
                {{ CALLS_COUNT }}
            </span>
        </HoverActionsButton>
        <AnimationTransition>
            <HeaderCalls v-if="callsIsVisible" v-on-click-outside="callsClickOutside" />
        </AnimationTransition>
        <HoverActionsButton
            ref="notificationsButton"
            @click="notificationsIsVisible = !notificationsIsVisible"
            :active="notificationsIsVisible"
            class="header__button"
        >
            <Spinner v-if="isLoading" class="mini" />
            <i v-else class="header__icon fa-regular fa-bell"></i>
            <span v-if="NOTIFICATIONS_COUNT !== 0" class="header__badge badge badge-danger">
                {{ NOTIFICATIONS_COUNT }}
            </span>
        </HoverActionsButton>
        <AnimationTransition>
            <HeaderNotifications
                v-if="notificationsIsVisible"
                v-on-click-outside="notificationsClickOutside"
            />
        </AnimationTransition>
    </div>
</template>
<script setup>
import { vOnClickOutside } from '@vueuse/components';
import HeaderCalls from '@/components/Header/HeaderCalls.vue';
import HeaderNotifications from '@/components/Header/HeaderNotifications.vue';
import { useStore } from 'vuex';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { computed, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import plural from 'plural-ru';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core';
import dayjs from 'dayjs';
import HeaderActivity from '@/components/Header/HeaderActivity.vue';

const ACTIVITY_INTERVAL = 180000;
const ONLINE_INTERVAL = 60000;

const store = useStore();
const documentVisibility = useDocumentVisibility();

const callsButton = useTemplateRef('callsButton');
const notificationsButton = useTemplateRef('notificationsButton');
const activityButton = useTemplateRef('activityButton');

const callsIsVisible = shallowRef(false);
const notificationsIsVisible = shallowRef(false);
const activityIsVisible = ref(false);
const activityCount = ref(1);
const isLoading = ref(true);
const activityIsLoading = ref(true);

let pausedTime = null;

const preparedActivityCount = computed(() => Number(activityCount.value || 1));

const activityCountLabelPlural = computed(() => {
    if (preparedActivityCount.value === 1) return '1 сотрудник в сети (Вы)';

    return plural(
        preparedActivityCount.value,
        '%d сотрудник в сети',
        '%d сотрудника в сети',
        '%d сотрудников в сети'
    );
});

const NOTIFICATIONS_COUNT = computed(() => store.getters.NOTIFICATIONS_COUNT);
const CALLS_COUNT = computed(() => store.getters.CALLS_COUNT);
const CURRENT_CALLS = computed(() => store.getters.CURRENT_CALLS);

const callsClickOutside = [() => (callsIsVisible.value = false), { ignore: [callsButton] }];
const notificationsClickOutside = [
    () => (notificationsIsVisible.value = false),
    { ignore: [notificationsButton] }
];
const activityClickOutside = [
    () => (activityIsVisible.value = false),
    { ignore: [activityButton] }
];

watch(documentVisibility, (current, prev) => {
    if (current === 'visible' && prev === 'hidden') {
        onlineInterval.resume();
        activityInterval.resume();

        if (pausedTime) {
            const diff = dayjs().diff(pausedTime, 'ms');
            if (diff > ACTIVITY_INTERVAL / 2) {
                fetchOnline();
                setUserIsOnline();
            }

            pausedTime = null;
        }
    } else {
        onlineInterval.pause();
        activityInterval.pause();
        pausedTime = dayjs();
    }
});

const fetchOnline = async () => {
    const response = await api.user.online();
    if (response) activityCount.value = response.online_count;
};

const setUserIsOnline = async () => {
    await api.user.activity();
};

const activityInterval = useIntervalFn(fetchOnline, ACTIVITY_INTERVAL);
const onlineInterval = useIntervalFn(setUserIsOnline, ONLINE_INTERVAL);

const fetchInitialOnline = async () => {
    activityIsLoading.value = true;

    await setUserIsOnline();
    await fetchOnline();

    activityIsLoading.value = false;
};

const fetchInitialData = async () => {
    isLoading.value = true;

    await Promise.all([
        store.dispatch('FETCH_NOTIFICATIONS_COUNT'),
        store.dispatch('FETCH_CALLS_COUNT')
    ]);

    isLoading.value = false;
};

onMounted(() => {
    fetchInitialData();
    fetchInitialOnline();
});
</script>
