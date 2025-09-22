<template>
    <div class="d-flex gap-2">
        <AnimationTransition :speed="0.4">
            <UiButton
                v-if="link?.linked"
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
        <UiButton
            v-if="!link?.linked"
            @click="startLink"
            icon="fa-solid fa-plus"
            color="success-light"
        >
            Привязать аккаунт
        </UiButton>
        <UiButton
            v-else
            @click="revokeLink"
            :loading="linkIsRevoking"
            icon="fa-solid fa-ban"
            color="danger-light"
        >
            Отвязать аккаунт
        </UiButton>
        <teleport to="body">
            <UiModal
                v-model:visible="ticketPreviewIsVisible"
                title="Интеграция c Telegram"
                :width="700"
            >
                <AccountIntegrationTelegramTicketPreviewSkeleton
                    v-if="startIsGenerating || isLoading"
                />
                <AccountIntegrationTelegramTicketPreview
                    v-else-if="ticket && !telegramIsLinked"
                    @retry="executeStartLink"
                    :ticket
                />
                <AccountIntegrationTelegramTicketSuccessPreview
                    v-else-if="telegramIsLinked && link"
                    :link
                />
            </UiModal>
        </teleport>
    </div>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAsync } from '@/composables/useAsync';
import api from '@/api/api';
import { computed, ref, watch } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import UiModal from '@/components/common/UI/UiModal.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import AccountIntegrationTelegramTicketPreview from '@/components/Account/AccountIntegrationTelegramTicketPreview.vue';
import AccountIntegrationTelegramTicketPreviewSkeleton from '@/components/Account/AccountIntegrationTelegramTicketPreviewSkeleton.vue';
import { useNotify } from '@/utils/use/useNotify';
import AccountIntegrationTelegramTicketSuccessPreview from '@/components/Account/AccountIntegrationTelegramTicketSuccessPreview.vue';
import { useStore } from 'vuex';

const {
    isLoading,
    data: link,
    execute: fetchStatus
} = useAsync(api.userTelegram.status, { immediate: true });

const linkLabel = computed(() => {
    if (link.value?.linked) {
        if (link.value!.first_name || link.value!.last_name) {
            return [link.value!.first_name, link.value!.last_name].filter(isNotNullish).join(' ');
        }

        return `@${link.value!.username ?? link.value.telegram_user_id}`;
    }

    return undefined;
});

const ticketPreviewIsVisible = ref(false);

function startLink() {
    ticketPreviewIsVisible.value = true;
    executeStartLink();
    store.state.telegramIsLinked = false;
}

const {
    isLoading: startIsGenerating,
    data: ticket,
    execute: executeStartLink
} = useAsync(api.userTelegram.start);

const notify = useNotify();

const { isLoading: linkIsRevoking, execute: revokeLink } = useAsync(api.userTelegram.revoke, {
    onFetchResponse() {
        link.value = null;
        store.state.telegramIsLinked = false;
        notify.success('Telegram успешно отвязан');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Отвязать Telegram',
        message: 'Вы уверены, что хотите отвязать Telegram аккаунт?'
    }
});

const store = useStore();

const telegramIsLinked = computed(() => store.state.telegramIsLinked);

watch(telegramIsLinked, value => {
    if (value) {
        fetchStatus();
    }
});
</script>
