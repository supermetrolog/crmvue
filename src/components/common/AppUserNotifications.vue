<template>
    <teleport to="body">
        <transition name="backdrop-fade">
            <div v-if="isOpen && current" class="important-toast-backdrop">
                <transition name="toast-spring" mode="out-in" appear>
                    <UserNotificationPreviewContent
                        v-if="current"
                        :key="current.id"
                        @acted="onActed"
                        @close="dismissAll"
                        :notification-id="current.notificationId"
                    >
                        <template #additional-actions>
                            <UiButton
                                v-if="pending > 1"
                                @click="onAction('next')"
                                :color="currentIsActed ? 'success-light' : 'light'"
                                icon="fa-solid fa-arrow-right"
                            >
                                Далее (ещё {{ pending - 1 }})
                            </UiButton>
                            <UiButton
                                v-else-if="!currentIsActed"
                                @click="onAction('skip')"
                                color="light"
                                icon="fa-solid fa-ban"
                            >
                                Отложить
                            </UiButton>
                            <UiButton
                                v-else
                                @click="onAction('close')"
                                color="light"
                                icon="fa-solid fa-ban"
                            >
                                Закрыть
                            </UiButton>
                        </template>
                        <template #fallback></template>
                    </UserNotificationPreviewContent>
                </transition>
            </div>
        </transition>
    </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUserNotificationToasts } from '@/composables/useUserNotificationToasts';
import UserNotificationPreviewContent from '@/components/UserNotificationPreview/UserNotificationPreviewContent.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const { current, isOpen, action, pending, dismissAll } = useUserNotificationToasts();

function onAction(val: string) {
    action(val);
}

const currentIsActed = ref(false);

watch(
    () => current.value?.id,
    () => {
        currentIsActed.value = false;
    }
);

function onActed() {
    currentIsActed.value = true;
}
</script>
<style>
.important-toast-backdrop {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.7);
    z-index: 4001;
}

.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
    transition: opacity 0.6s ease;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
    opacity: 0;
}

.toast-spring-enter-active {
    animation: toastSpringIn 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.toast-spring-leave-active {
    transition:
        transform 1s ease,
        opacity 1s ease;
}

.toast-spring-leave-to {
    transform: translateY(100px);
    opacity: 0;
}

@keyframes toastSpringIn {
    0% {
        transform: translateY(-100px) scale(0.98);
        opacity: 0;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}
</style>
