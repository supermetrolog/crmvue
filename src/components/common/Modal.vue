<template>
    <Transition name="modal" appear>
        <div
            v-if="show || visibleModel"
            class="modal active"
            role="dialog"
            :style="{ '--modal-width': width ? width + 'px' : 'auto' }"
            :class="{ 'modal--with-tabs': hasTabs, 'modal--relative': relative }"
        >
            <div @click="onBlackoutClick" class="modal__blackout"></div>
            <slot name="container">
                <div
                    class="modal__container animate__animated"
                    :class="{
                        animate__headShake: !canBeClosed
                    }"
                >
                    <div v-if="!hideHeader" class="modal__header">
                        <p v-if="title">
                            {{ title }}
                        </p>
                        <slot name="header"></slot>
                        <div class="modal__close">
                            <UiTooltipIcon
                                @click.prevent="close"
                                tooltip="Закрыть окно"
                                icon="fa-solid fa-xmark"
                                class="icon"
                            />
                        </div>
                    </div>
                    <div class="modal__body" :class="bodyClass">
                        <div class="container-fluid">
                            <slot></slot>
                        </div>
                    </div>
                    <div v-if="$slots.footer" class="modal__footer">
                        <div class="container-fluid">
                            <div class="modal__buttons">
                                <slot name="footer"></slot>
                            </div>
                        </div>
                    </div>
                </div>
            </slot>
        </div>
    </Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useTimeoutFn } from '@vueuse/core';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import { useModalScrollLock } from '@/composables/useModalScrollLock.js';

const visibleModel = defineModel('visible');
const emit = defineEmits(['close']);
const props = defineProps({
    title: {
        type: String
    },
    hasTabs: {
        type: Boolean,
        default: false
    },
    relative: {
        type: Boolean,
        default: false
    },
    width: {
        type: [Number, String],
        default: null
    },
    show: Boolean,
    minHeight: {
        type: Number,
        default: 50
    },
    blackoutOpacity: {
        type: Number,
        default: 0.25
    },
    closeOnOutsideClick: {
        type: Boolean,
        default: true
    },
    closeOnPressEsc: {
        type: Boolean,
        default: true
    },
    hideHeader: Boolean,
    bodyClass: [String, Array, Object]
});

const canBeClosed = ref(true);
const { start: showCloseErrorAnimation } = useTimeoutFn(() => {
    canBeClosed.value = true;
}, 500);

const minHeightSize = computed(() => props.minHeight + 'px');

const onBlackoutClick = () => {
    if (props.closeOnOutsideClick) close();
    else tryShowCloseErrorAnimation();
};
const close = () => emit('close');
const escapeHandler = event => {
    event.stopImmediatePropagation();

    if (event.code === 'Escape') {
        if (props.closeOnPressEsc) close();
        else tryShowCloseErrorAnimation();
    }
};

const tryShowCloseErrorAnimation = () => {
    if (canBeClosed.value) {
        canBeClosed.value = false;
        showCloseErrorAnimation();
    }
};

const { lockScroll: makeScrollLIsLock, unlockScroll } = useModalScrollLock();

const scrollIsLocked = ref(false);

watch(
    () => props.show,
    value => {
        if (value) {
            document.addEventListener('keydown', escapeHandler, true);

            if (!scrollIsLocked.value && props.lockScroll) {
                makeScrollLIsLock();
                scrollIsLocked.value = true;
            }
        } else {
            document.removeEventListener('keydown', escapeHandler, true);

            if (scrollIsLocked.value) {
                unlockScroll();
                scrollIsLocked.value = false;
            }
        }
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    document.removeEventListener('keydown', escapeHandler, true);
    if (scrollIsLocked.value) unlockScroll();
});
</script>
<style scoped>
.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal__container,
.modal-leave-to .modal__container {
    transform: scale(1.1);
}

.modal {
    --modal-body-min-height: v-bind(minHeightSize);
}

.modal__blackout {
    background-color: rgba(0, 0, 0, v-bind(blackoutOpacity));
}
</style>
