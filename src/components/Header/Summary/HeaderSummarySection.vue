<template>
    <div
        @click="openModal"
        class="header-summary-section"
        :class="{ active: count > 0, disabled: loading, 'silent-loading': silentLoading }"
    >
        <Spinner v-if="loading" class="mini" />
        <div v-else class="header-summary-section__indicator">{{ count }}</div>
        <p class="header-summary-section__label">{{ label }}</p>
        <slot />
        <teleport v-if="$slots.modal" to="body">
            <Modal
                @close="closeModal"
                :width="modalWidth"
                :show="modalIsVisible"
                :title="modalTitle"
                :has-tabs="sticky"
            >
                <slot name="modal" :close="closeModal" />
            </Modal>
        </teleport>
    </div>
</template>
<script setup lang="ts">
import Spinner from '@/components/common/Spinner.vue';
import Modal from '@/components/common/Modal.vue';
import { ref } from 'vue';

withDefaults(
    defineProps<{
        label: string;
        modalTitle?: string;
        modalWidth?: number;
        count: number;
        loading?: boolean;
        silentLoading?: boolean;
        sticky?: boolean;
    }>(),
    { modalWidth: 900 }
);

const modalIsVisible = ref(false);

function openModal() {
    modalIsVisible.value = true;
}

function closeModal() {
    modalIsVisible.value = false;
}
</script>
