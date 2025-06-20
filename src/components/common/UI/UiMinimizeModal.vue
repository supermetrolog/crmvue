<template>
    <UiModal
        ref="modal"
        v-model:visible="visibleModel"
        @close="$emit('close')"
        @closed="$emit('closed')"
        :title
        v-bind="$attrs"
        :can-be-closed="!isMinimized"
        :lock-scroll="false"
        :esc-close="false"
        :class="{
            minimized: isMinimized,
            minimizing: isMinimizing,
            expanding: isExpanding
        }"
        class="modal--minimize"
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
                icon="fa-solid fa-window-minimize"
                class="icon"
                tooltip="Свернуть окно"
            />
        </template>
        <template #default>
            <slot :minimized="isMinimized" />
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
import { useDebounceFn } from '@vueuse/core';

const visibleModel = defineModel('visible');

const emit = defineEmits(['close', 'closed', 'minimized', 'expanded']);

const props = defineProps({
    title: String,
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

    if (minimizedModalUid.value) {
        expandMinimizedModal({ id: minimizedModalUid.value });
        minimizedModalUid.value = null;
    }
}

function closeModal() {
    if (modal.value) modal.value.close();
}

const isMinimized = ref(false);
const minimizedModalUid = ref(null);

function minimize() {
    if (!props.canBeMinimized) return;

    minimizedModalUid.value = minimizeModal(props.minimizedTitle, closeModal, expandModal);
    isMinimized.value = true;
}

const { minimizeModal, expandModal: expandMinimizedModal } = useMinimizedModalManager();

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
        emit('minimized', minimizedModalUid.value);
        tryUnlockScroll();
    } else {
        emit('expanded');
        tryLockScroll();
    }
});

defineExpose({ minimize, expand: expandModal, isMinimized });

const isMinimizing = ref(false);
const isExpanding = ref(false);

const setMinimizing = useDebounceFn(value => {
    isMinimizing.value = value;
}, 1500);

const setExpanding = useDebounceFn(value => {
    isExpanding.value = value;
}, 1500);

watch(isMinimized, value => {
    if (value) {
        isMinimizing.value = true;
        setMinimizing(false);
    } else {
        isExpanding.value = true;
        setExpanding(false);
    }
});
</script>
