<template>
    <div
        @click="openModal"
        class="header-summary-section"
        :class="{ active: count > 0, disabled: loading }"
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
            >
                <slot name="modal" />
            </Modal>
        </teleport>
    </div>
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';
import Modal from '@/components/common/Modal.vue';
import { ref } from 'vue';

defineProps({
    label: {
        type: String,
        required: true
    },
    modalTitle: String,
    modalWidth: {
        type: Number,
        default: 900
    },
    count: {
        type: Number,
        required: true
    },
    loading: Boolean
});

const modalIsVisible = ref(false);

function openModal() {
    modalIsVisible.value = true;
}

function closeModal() {
    modalIsVisible.value = false;
}
</script>
