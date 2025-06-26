<template>
    <notifications
        @destroy="onNotificationDestroyed"
        position="top right"
        group="version"
        pause-on-hover
    >
        <template #body="{ item }">
            <div class="vue-notification-template vue-notification info">
                <div class="notification-title">{{ item.title }}</div>
                <div class="notification-content">
                    Для доступа к изменениям, обновите версию приложения.
                </div>
                <UiButton @click="reload" class="mt-2" icon="fa-solid fa-sync" color="white">
                    Обновить версию
                </UiButton>
            </div>
        </template>
    </notifications>
</template>

<script setup>
import { Notifications, notify } from '@kyvg/vue3-notification';
import { useClientVersion } from '@/composables/useClientVersion.ts';
import UiButton from '@/components/common/UI/UiButton.vue';
import { watch } from 'vue';

const { isOutdated, stopAutoChecking, resumeAutoChecking } = useClientVersion();

watch(isOutdated, value => {
    if (value) {
        notify({
            group: 'version',
            title: 'Версия клиента устарела',
            type: 'warn',
            duration: 60000
        });

        stopAutoChecking();
    }
});

function reload() {
    window.location.reload(true);
}

function onNotificationDestroyed() {
    resumeAutoChecking();
}
</script>
