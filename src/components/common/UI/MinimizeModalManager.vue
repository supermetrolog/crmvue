<template>
    <AnimationTransition :speed="0.7">
        <div v-if="manager.modals.length" class="minimized-modals">
            <div class="minimized-modals__header">
                <p>Свернутые окна ({{ manager.modals.length }})</p>
                <UiButtonIcon
                    v-if="manager.modals.length > 2"
                    @click="isOpened = !isOpened"
                    :icon="isOpened ? 'fa-solid fa-angle-down' : 'fa-solid fa-angle-up'"
                    :label="isOpened ? 'Свернуть' : 'Просмотреть больше'"
                    small
                />
            </div>
            <div class="minimized-modals__list" :class="{ opened: isOpened }">
                <UiMinimizeModalPreview
                    v-for="modal in manager.modals"
                    :key="modal.id"
                    @expand="expandModal(modal)"
                    @close="closeModal(modal)"
                    :title="modal.title"
                />
            </div>
        </div>
    </AnimationTransition>
</template>
<script setup>
import UiMinimizeModalPreview from '@/components/common/UI/UiMinimizeModalPreview.vue';
import { getMinimizedModalManager } from '@/composables/useMinimizedModalManager.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { ref } from 'vue';

const manager = getMinimizedModalManager();

function expandModal(modal) {
    manager.expandModal(modal);
}

function closeModal(modal) {
    manager.closeModal(modal);
}

const isOpened = ref(false);
</script>
