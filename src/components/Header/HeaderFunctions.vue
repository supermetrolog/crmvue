<template>
    <teleport to="body">
        <FormCompanyDeal v-if="dealFormIsVisible" @close="dealFormIsVisible = false" />
    </teleport>
    <div class="header__functions">
        <HoverActionsButton
            ref="callsButton"
            @click="callsIsVisible = !callsIsVisible"
            :active="callsIsVisible"
            class="header__button"
            :class="{ 'current-call-exist': CURRENT_CALLS.length }"
        >
            <i class="header__icon fa-solid fa-phone"></i>
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
            <i class="header__icon fa-regular fa-bell"></i>
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
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import HeaderCalls from '@/components/Header/HeaderCalls.vue';
import HeaderNotifications from '@/components/Header/HeaderNotifications.vue';
import { useStore } from 'vuex';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { computed, onBeforeMount, ref, shallowRef } from 'vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

const store = useStore();

const callsButton = ref(null);
const notificationsButton = ref(null);

const dealFormIsVisible = shallowRef(false);
const callsIsVisible = shallowRef(false);
const notificationsIsVisible = shallowRef(false);

const NOTIFICATIONS_COUNT = computed(() => store.getters.NOTIFICATIONS_COUNT);
const CALLS_COUNT = computed(() => store.getters.CALLS_COUNT);
const CURRENT_CALLS = computed(() => store.getters.CURRENT_CALLS);

const callsClickOutside = [() => (callsIsVisible.value = false), { ignore: [callsButton] }];
const notificationsClickOutside = [
    () => (notificationsIsVisible.value = false),
    { ignore: [notificationsButton] }
];

onBeforeMount(() => {
    store.dispatch('FETCH_NOTIFICATIONS_COUNT');
    store.dispatch('FETCH_CALLS_COUNT');
});
</script>
