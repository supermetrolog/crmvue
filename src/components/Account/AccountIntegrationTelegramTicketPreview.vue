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
            <div class="d-flex gap-2">
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
                <UiButton @click="$emit('check')" color="light" icon="fa-solid fa-magnifying-glass">
                    Проверить статус
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
import { useCountdown, useDocumentVisibility } from '@vueuse/core';
import { dayjsFromServer } from '@/utils/formatters/date';
import dayjs from 'dayjs';
import { computed, watch } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { toTimeFormat } from '@/utils/formatters/toTimeFormat';

defineEmits<{
    (e: 'retry'): void;
    (e: 'check'): void;
}>();

const props = defineProps<{
    ticket: StartTelegramLinkResponse;
}>();

const { remaining, stop, isActive, pause, start } = useCountdown(
    dayjsFromServer(props.ticket.expires_at).diff(dayjs(), 'seconds'),
    {
        immediate: true,
        onComplete() {
            stop();
        }
    }
);

const documentVisibility = useDocumentVisibility();

watch(documentVisibility, value => {
    if (value) {
        start(dayjsFromServer(props.ticket.expires_at).diff(dayjs(), 'seconds'));
    } else {
        pause();
    }
});

const time = computed(() => toTimeFormat(remaining.value));
</script>
