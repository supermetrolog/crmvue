<template>
    <div class="header__functions">
        <UiButtonIcon
            ref="activityButton"
            @click="activityIsVisible = !activityIsVisible"
            color="light"
            :label="activityCountLabelPlural"
            :active="activityIsVisible"
            class="header__button header__online"
        >
            <Spinner v-if="activityIsLoading" class="mini" />
            <i v-else class="fa-solid fa-user-group"></i>
            <div
                v-if="!activityIsLoading"
                class="header__count"
                :class="{ 'dashboard-bg-success': preparedActivityCount > 1 }"
            >
                {{ preparedActivityCount }}
            </div>
        </UiButtonIcon>
        <AnimationTransition>
            <HeaderActivity
                v-if="activityIsVisible"
                v-on-click-outside="activityClickOutside"
                @online-updated="activityCount = $event"
            />
        </AnimationTransition>
        <UiButtonIcon
            ref="callsButton"
            @click="callsIsVisible = !callsIsVisible"
            :active="callsIsVisible"
            color="light"
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
        </UiButtonIcon>
        <AnimationTransition>
            <HeaderCalls v-if="callsIsVisible" v-on-click-outside="callsClickOutside" />
        </AnimationTransition>
        <UiButtonIcon
            ref="notificationsButton"
            @click="notificationsIsVisible = !notificationsIsVisible"
            :active="notificationsIsVisible"
            color="light"
            class="header__button"
        >
            <Spinner v-if="isLoading" class="mini" />
            <i v-else class="header__icon fa-regular fa-bell"></i>
            <span v-if="NOTIFICATIONS_COUNT !== 0" class="header__badge badge badge-danger">
                {{ NOTIFICATIONS_COUNT }}
            </span>
        </UiButtonIcon>
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
import { plural } from '@/utils/plural.js';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core';
import HeaderActivity from '@/components/Header/HeaderActivity.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

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

        fetchOnline();
    } else {
        onlineInterval.pause();
    }
});

const fetchOnline = async () => {
    const response = await api.user.online();
    if (response) activityCount.value = response.online_count;
};

const onlineInterval = useIntervalFn(fetchOnline, ONLINE_INTERVAL);

const fetchInitialOnline = async () => {
    activityIsLoading.value = true;

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
