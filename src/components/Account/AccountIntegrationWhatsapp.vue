<template>
    <div class="d-flex gap-2">
        <AnimationTransition :speed="0.4">
            <UiButton
                v-if="link?.linked"
                @click="previewIsVisible = true"
                :loading="isLoading"
                icon="fa-solid fa-user"
                :label="linkLabel"
            />
            <UiButton
                v-else
                disabled
                color="gray-light"
                icon="fa-solid fa-ban"
                :loading="isLoading"
                :label="isLoading ? 'Поиск профиля' : 'Не привязан'"
            />
        </AnimationTransition>
        <UiButton @click="startLink" icon="fa-solid fa-plus" color="success-light">
            Привязать аккаунт
        </UiButton>
        <teleport to="body">
            <UiModal v-model:visible="previewIsVisible" title="Связанный профиль в Telegram">
                <AccountIntegrationTelegramLinkPreview :link />
            </UiModal>
            <UiModal
                v-model:visible="ticketPreviewIsVisible"
                title="Интеграция c Telegram"
                :width="700"
            >
                <AccountIntegrationTelegramTicketPreviewSkeleton v-if="startIsGenerating" />
                <AccountIntegrationTelegramTicketPreview v-else-if="ticket" :ticket />
            </UiModal>
        </teleport>
    </div>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAsync } from '@/composables/useAsync';
import api from '@/api/api';
import { computed, ref } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import UiModal from '@/components/common/UI/UiModal.vue';
import AccountIntegrationTelegramLinkPreview from '@/components/Account/AccountIntegrationTelegramLinkPreview.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import AccountIntegrationTelegramTicketPreview from '@/components/Account/AccountIntegrationTelegramTicketPreview.vue';
import AccountIntegrationTelegramTicketPreviewSkeleton from '@/components/Account/AccountIntegrationTelegramTicketPreviewSkeleton.vue';

const { isLoading, data: link } = useAsync(api.userWhatsapp.status, { immediate: true });

const linkLabel = computed(() => {
    if (link.value?.linked) {
        if (link.value!.first_name || link.value!.last_name) {
            return [link.value!.first_name, link.value!.last_name].filter(isNotNullish).join(' ');
        }

        return `@${link.value!.username ?? link.value.telegram_user_id}`;
    }

    return undefined;
});

const previewIsVisible = ref(false);
const ticketPreviewIsVisible = ref(false);

function startLink() {
    ticketPreviewIsVisible.value = true;
    executeStartLink();
}

const {
    isLoading: startIsGenerating,
    data: ticket,
    execute: executeStartLink
} = useAsync(api.userTelegram.start);
</script>
