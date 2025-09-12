<template>
    <div class="user-notification-inline-card" :class="{ 'op-5': isNew && isActed }">
        <div class="user-notification-inline-card__preview">
            <i
                v-if="isSystemNotification"
                class="fa-solid fa-bell user-notification-inline-card__icon"
            />
            <Avatar
                v-else-if="notification.createdBy"
                :src="notification.createdBy.userProfile.avatar"
                :label="notification.createdBy.userProfile.medium_name"
                :size="30"
            />
        </div>
        <div class="user-notification-inline-card__content">
            <div class="user-notification-inline-card__header">
                <p>
                    <span class="user-notification-inline-card__subject">
                        {{ notification.subject }}
                    </span>
                    <span class="mx-1">·</span>
                    <span class="user-notification-inline-card__date">{{ createdAt }}</span>
                </p>
            </div>
            <div class="user-notification-inline-card__body">
                <p>{{ notification.message }}</p>
            </div>
            <div class="user-notification-inline-card__badges">
                <UiField v-if="isNew" color="success-light">
                    <span>Новое</span>
                </UiField>
                <UiField v-if="isActed" color="light">
                    <i class="fa-solid fa-check" />
                    <span>Обработано</span>
                </UiField>
                <UiField v-else-if="isExpired" color="light">
                    <i class="fa-solid fa-clock-rotate-left" />
                    <span>Истекло {{ expiredDate }}</span>
                </UiField>
                <UiField v-else-if="isViewed" color="light">
                    <i class="fa-solid fa-eye" />
                    <span>Просмотрено</span>
                </UiField>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ShortUserNotification } from '@/types/user-notification/user-notification';
import { computed } from 'vue';
import { isNullish } from '@/utils/helpers/common/isNullish';
import Avatar from '@/components/common/Avatar.vue';
import { dayjsFromServer, toBeautifulDateFormat, toDateFormat } from '@/utils/formatters/date';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import dayjs from 'dayjs';
import UiField from '@/components/common/UI/UiField.vue';

const props = defineProps<{ notification: ShortUserNotification; isNew?: boolean }>();

const isSystemNotification = computed(() => isNullish(props.notification.createdBy));

const createdAt = computed(() => toBeautifulDateFormat(props.notification.created_at));

const isActed = computed(() => isNotNullish(props.notification.acted_at));
const isViewed = computed(() => isNotNullish(props.notification.viewed_at));
const isExpired = computed(
    () =>
        isNotNullish(props.notification.expires_at) &&
        dayjsFromServer(props.notification.expires_at).isBefore(dayjs())
);

const expiredDate = computed(() => toDateFormat(props.notification.expires_at, 'D.MM.YY'));
</script>
