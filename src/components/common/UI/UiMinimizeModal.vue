<template>
    <UiModal
        v-show="!isMinimized"
        ref="modal"
        v-model:visible="visibleModel"
        @close="$emit('close')"
        @closed="$emit('closed')"
        :title
        v-bind="$attrs"
        :can-be-closed="!isMinimized"
        :lock-scroll="false"
        :esc-close="false"
    >
        <template #header>
            <slot name="header" />
        </template>
        <template #before-body>
            <slot name="before-body" />
        </template>
        <template v-if="canBeMinimized" #header-actions>
            <UiTooltipIcon
                @click.prevent="minimize"
                icon="fa-solid fa-minus"
                class="icon"
                tooltip="Свернуть окно"
            />
        </template>
        <template #default>
            <slot />
        </template>
        <template v-if="$slots.footer" #footer>
            <slot name="footer" :close="close" />
        </template>
        <template v-if="$slots.actions" #actions>
            <slot name="actions" :close="close" />
        </template>
    </UiModal>
</template>

<script setup>
import { onBeforeUnmount, ref, useTemplateRef, watch } from 'vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useMinimizedModalManager } from '@/composables/useMinimizedModalManager.js';
import { useModalScrollLock } from '@/composables/useModalScrollLock.js';

const visibleModel = defineModel('visible');

const emit = defineEmits(['close', 'closed', 'minimized', 'expanded']);

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    minimizedTitle: {
        type: String,
        required: true
    },
    canBeMinimized: {
        type: Boolean,
        default: true
    }
});

// minimize

const modal = useTemplateRef('modal');

function expandModal() {
    isMinimized.value = false;
}

function closeModal() {
    expandModal();
    if (modal.value) modal.value.close();
}

const isMinimized = ref(false);

function minimize() {
    if (!props.canBeMinimized) return;

    isMinimized.value = true;
    minimizeModal(props.minimizedTitle, closeModal, expandModal);
}

const { minimizeModal } = useMinimizedModalManager();

const scrollIsLocked = ref(false);

const { lockScroll, unlockScroll } = useModalScrollLock();

function tryLockScroll() {
    if (!scrollIsLocked.value) {
        lockScroll();
        scrollIsLocked.value = true;
    }
}

function tryUnlockScroll() {
    if (scrollIsLocked.value) {
        unlockScroll();
        scrollIsLocked.value = false;
    }
}

onBeforeUnmount(tryUnlockScroll);

watch(
    visibleModel,
    (value, oldValue) => {
        if (value) {
            tryLockScroll();
        } else if (oldValue) {
            tryUnlockScroll();
        }
    },
    { immediate: true }
);

watch(isMinimized, value => {
    if (value) {
        emit('minimized');
        tryUnlockScroll();
    } else {
        emit('expanded');
        tryLockScroll();
    }
});

defineExpose({ minimize });
</script>
