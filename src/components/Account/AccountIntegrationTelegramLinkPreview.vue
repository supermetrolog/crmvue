<template>
    <div class="d-flex gap-2">
        <UiButton
            v-if="link?.linked"
            @click="openLinkPreview"
            :loading="isLoading"
            icon="fa-solid fa-user"
            :label="linkLabel"
        />
        <UiButton v-else disabled color="gray-light" icon="fa-solid fa-ban">
            {{ isLoading ? 'Поиск профиля' : 'Не привязан' }}
        </UiButton>
        <UiButton icon="fa-solid fa-plus" color="success-light">Привязать аккаунт</UiButton>
        <teleport to="body">
            <UiModal></UiModal>
        </teleport>
    </div>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAsync } from '@/composables/useAsync';
import api from '@/api/api';
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import UiModal from '@/components/common/UI/UiModal.vue';

const { isLoading, data: link } = useAsync(api.userTelegram.status, { immediate: true });

const linkLabel = computed(() => {
    if (link.value?.linked) {
        if (link.value!.first_name || link.value!.last_name) {
            return [link.value!.first_name, link.value!.last_name].filter(isNotNullish).join(' ');
        }

        return `@${link.value!.username}` ?? `#id${link.value.telegram_user_id}`;
    }

    return undefined;
});

function openLinkPreview() {}
</script>
