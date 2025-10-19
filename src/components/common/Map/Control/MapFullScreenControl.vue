<template>
    <YandexMapControlButton v-model="button" :settings="{ onClick: toggleFullScreen }">
        <div
            class="d-flex align-items-center justify-content-center"
            style="width: 24px; height: 24px"
        >
            <i v-if="isActive" class="fa-solid fa-down-left-and-up-right-to-center icon"></i>
            <i v-else class="fa-solid fa-up-right-and-down-left-from-center icon"></i>
        </div>
    </YandexMapControlButton>
</template>
<script setup lang="ts">
import { YandexMapControlButton } from 'vue-yandex-maps';
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';
import { YMapControlButton } from '@yandex/ymaps3-types';

const isActive = defineModel<boolean>({ default: false });

const button = shallowRef<YMapControlButton | null>(null);

function toggleFullScreen() {
    if (isActive.value) {
        document.exitFullscreen();
    } else {
        const root = button.value?.root;

        if (root) {
            root.container.requestFullscreen();
        }
    }
}

let interval: number | undefined;

function handleFullscreenChange() {
    isActive.value = !!document.fullscreenElement;
}

onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onBeforeUnmount(() => {
    clearInterval(interval);

    document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>
<style scoped>
.icon {
    font-size: 20px;
}
</style>
