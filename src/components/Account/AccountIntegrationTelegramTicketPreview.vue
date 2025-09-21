<template>
    <div class="d-flex gap-4">
        <div>
            <UiQRCode :value="ticket.deep_link" />
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
                    target="_blank"
                    color="success"
                    icon="fa-solid fa-external-link"
                    bolder
                >
                    Открыть Telegram
                </UiButton>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { StartTelegramLinkResponse } from '@/api/user-telegram';
import UiQRCode from '@/components/common/UI/UiQRCode.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineProps<{
    ticket: StartTelegramLinkResponse;
}>();
</script>
