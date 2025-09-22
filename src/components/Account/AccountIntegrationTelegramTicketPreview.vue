<template>
    <div class="d-flex gap-4">
        <div>
            <UiQRCode :value="ticket.deep_link" :disabled="!isActive" />
        </div>
        <div class="d-flex flex-column">
            <p class="font-weight-semi fs-4">Свяжите Telegram аккаунт с системой</p>
            <p class="text-dark mb-2">
                Вы можете открыть Telegram на мобильном с помощью QR или воспользоваться Web-версией
            </p>
            <div class="d-flex">
                <UiButton
                    as="a"
                    :href="ticket.deep_link"
                    :disabled="!isActive"
                    target="_blank"
                    :color="isActive ? 'success' : 'dark'"
                    icon="fa-solid fa-external-link"
                    bolder
                >
                    <span>Открыть Telegram</span>
                    <template v-if="isActive">
                        <span class="mx-1">|</span>
                        <span>{{ time }}</span>
                    </template>
                </UiButton>
            </div>
            <AnimationTransition :speed="0.4">
                <div v-if="!isActive" class="d-flex mt-2">
                    <UiButton
                        @click="$emit('retry')"
                        icon="fa-solid fa-sync"
                        bolder
                        color="success"
                    >
                        Сгенерировать новый код
                    </UiButton>
                </div>
            </AnimationTransition>
        </div>
    </div>
</template>
<script setup lang="ts">
import { StartTelegramLinkResponse } from '@/api/user-telegram';
import UiQRCode from '@/components/common/UI/UiQRCode.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useCountdown } from '@vueuse/core';
import { dayjsFromServer } from '@/utils/formatters/date';
import dayjs from 'dayjs';
import { computed } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

defineEmits<{
    (e: 'retry'): void;
}>();

const props = defineProps<{
    ticket: StartTelegramLinkResponse;
}>();

const { remaining, stop, isActive } = useCountdown(
    dayjsFromServer(props.ticket.expires_at).diff(dayjs(), 'seconds'),
    {
        immediate: true,
        onComplete() {
            stop();
        }
    }
);

const time = computed(() => `${Math.floor(remaining.value / 60)}:${remaining.value % 60}`);
</script>
