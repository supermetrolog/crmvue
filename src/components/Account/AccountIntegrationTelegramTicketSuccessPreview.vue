<template>
    <div class="d-flex gap-4">
        <div class="d-flex flex-column">
            <p class="font-weight-semi fs-4">Telegram успешно связан</p>
            <p class="text-dark mb-2">
                Вы будете получать важные уведомления в Telegram {{ username }}
            </p>
            <div class="d-flex">
                <UiButton color="success" icon="fa-solid fa-check" bolder> Закрыть</UiButton>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import { UserTelegramLink } from '@/types/integration/user-telegram-link';
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

const props = defineProps<{
    link: UserTelegramLink;
}>();

const username = computed(() => {
    if (props.link.username) {
        return `@${props.link.username}`;
    }

    return [props.link.first_name, props.link.last_name].filter(isNotNullish).join(' ');
});
</script>
