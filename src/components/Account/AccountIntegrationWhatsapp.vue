<template>
    <div class="d-flex gap-2">
        <AnimationTransition :speed="0.4">
            <UiButton
                v-if="link?.linked"
                :loading="isLoading"
                icon="fa-solid fa-user"
                :label="linkLabel"
                color="light"
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
        <AnimationTransition :speed="0.4">
            <div v-if="link">
                <AnimationTransition :speed="0.4">
                    <UiButton
                        v-if="!link.linked"
                        @click="startLink"
                        icon="fa-solid fa-plus"
                        color="success-light"
                        disabled
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
                </AnimationTransition>
            </div>
        </AnimationTransition>
        <teleport to="body">
            <UiModal v-model:visible="formIsVisible" title="Интеграция c Whatsapp" :width="700">
                <AccountIntegrationWhatsappLinkForm v-if="formIsVisible" @linked="fetchStatus" />
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
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useNotify } from '@/utils/use/useNotify';
import AccountIntegrationWhatsappLinkForm from '@/components/Account/AccountIntegrationWhatsappLinkForm.vue';

const {
    isLoading,
    data: link,
    execute: fetchStatus
} = useAsync(api.userWhatsapp.status, { immediate: true });

const linkLabel = computed(() => {
    if (link.value?.linked) {
        return [link.value.phone, link.value.full_name ?? link.value.first_name]
            .filter(isNotNullish)
            .join(', ');
    }

    return undefined;
});

const formIsVisible = ref(false);

function startLink() {
    formIsVisible.value = true;
}

const notify = useNotify();

const { isLoading: linkIsRevoking, execute: revokeLink } = useAsync(api.userWhatsapp.revoke, {
    onFetchResponse() {
        link.value = null;
        notify.success('Whatsapp успешно отвязан');
        fetchStatus();
    },
    confirmation: true,
    confirmationContent: {
        title: 'Отвязать Whatsapp',
        message: 'Вы уверены, что хотите отвязать Whatsapp аккаунт?'
    }
});
</script>
