<template>
    <div class="d-flex gap-4">
        <div>
            <UiField color="light" class="w-100 mb-1 text-center font-weight-semi">
                Ссылка на бота
            </UiField>
            <UiQRCode :value="botLink" />
        </div>
        <div class="d-flex flex-column">
            <p class="font-weight-semi fs-4">Telegram успешно связан</p>
            <p class="text-dark mb-2">
                Вы будете получать важные уведомления в Telegram {{ username }}
            </p>
            <div class="d-flex gap-2">
                <UiButton
                    as="a"
                    :href="botLink"
                    target="_blank"
                    color="light"
                    icon="fa-solid fa-external-link"
                >
                    <span>Открыть бота</span>
                </UiButton>
                <UiButton @click="$emit('close')" color="success-light" icon="fa-solid fa-ban">
                    Закрыть форму
                </UiButton>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { StatusUserTelegramLinkResponse } from '@/api/user-telegram';
import UiQRCode from '@/components/common/UI/UiQRCode.vue';
import UiField from '@/components/common/UI/UiField.vue';

defineEmits<{ (e: 'close'): void }>();

const props = defineProps<{
    link: StatusUserTelegramLinkResponse;
}>();

const botLink = `https://t.me/${import.meta.env.VITE_VUE_APP_TELEGRAM_BOT_USERNAME}`;

const username = computed(() => {
    if (props.link.username) {
        return `@${props.link.username}`;
    }

    return [props.link.first_name, props.link.last_name].filter(isNotNullish).join(' ');
});
</script>
