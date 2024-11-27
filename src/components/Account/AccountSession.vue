<template>
    <div class="account-session">
        <div class="account-session__body" :class="{ current: current }">
            <div>
                <i v-tippy="systemTippy" class="account-session__icon" :class="systemIcon" />
            </div>
            <div>
                <div class="account-session__header">
                    <p class="account-session__name">
                        {{ userAgent.browser.name }}, {{ userAgent.os.name }}
                        {{ userAgent.os.version }},
                        {{ session.ip }}
                    </p>
                    <DashboardChip
                        v-if="current"
                        class="dashboard-bg-success account-session__chip text-white"
                    >
                        <i class="fa-solid fa-user-check mr-1"></i>
                        <span>Текущая сессия</span>
                    </DashboardChip>
                </div>
                <div class="account-session__footer">
                    <DashboardChip
                        v-tippy="expiresAtTippy"
                        :class="[expiresAtStateClass, 'account-session__chip']"
                        with-icon
                    >
                        <i class="fa-regular fa-clock"></i>
                        <span>{{ expiresAt }}</span>
                    </DashboardChip>
                    <DashboardChip
                        v-tippy="'Дата входа в аккаунт'"
                        class="account-session__chip dashboard-bg-gray-l"
                    >
                        {{ createdAt }}
                    </DashboardChip>
                </div>
            </div>
            <div class="account-session__actions">
                <HoverActionsButton
                    @click="$emit('logout')"
                    label="Отозвать сессию"
                    class="dashboard-bg-danger-l"
                    small
                    :disabled="session.updating"
                >
                    <i class="fa-solid fa-ban"></i>
                </HoverActionsButton>
            </div>
        </div>
    </div>
</template>
<script>
/**
 * The number of days between the current date and the expiration date of the token,
 * at which the token is considered to be obsolete soon.
 * @type {number}
 */
const EXPIRES_DATE_LIMIT = 7;
</script>
<script setup>
import { computed } from 'vue';
import { UAParser } from 'ua-parser-js';
import { dayjsFromMoscow, toDateFormat } from '@/utils/formatters/date.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import dayjs from 'dayjs';
import plural from 'plural-ru';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

defineEmits(['logout']);
const props = defineProps({
    session: {
        type: Object,
        required: true
    },
    current: {
        type: Boolean,
        default: false
    }
});

const UAP = new UAParser(props.session.user_agent);

const userAgent = computed(() => UAP.getResult());
const isDesktop = computed(() => userAgent.value.device.type === undefined);
const createdAt = computed(() => toDateFormat(props.session.created_at));
const expiresAt = computed(() => toDateFormat(props.session.expires_at, 'D MMMM YYYY'));
const daysCountFromExpiresAt = computed(() =>
    dayjsFromMoscow(props.session.expires_at).diff(dayjs(), 'days')
);

const expiresAtStateClass = computed(() =>
    daysCountFromExpiresAt.value < EXPIRES_DATE_LIMIT
        ? 'dashboard-bg-danger-l'
        : 'dashboard-bg-success-l'
);
const expiresAtTippy = computed(() => {
    return (
        'Токен истечет через ' +
        plural(daysCountFromExpiresAt.value, '%d день', '%d дня', '%d дней')
    );
});

const systemIcon = computed(() =>
    isDesktop.value ? 'fa-solid fa-desktop' : 'fa-solid fa-mobile-screen'
);
const systemTippy = computed(() => {
    if (isDesktop.value)
        return `${userAgent.value.browser.name} ${userAgent.value.browser.version}`;

    return `${userAgent.value.device.vendor} [${userAgent.value.device.model}]`;
});
</script>
