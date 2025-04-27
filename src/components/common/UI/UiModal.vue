<template>
    <Transition name="modal" appear>
        <div
            v-if="visibleModel"
            class="modal active"
            role="dialog"
            :style="{ '--modal-width': width ? width + 'px' : 'auto' }"
            :class="{
                'modal--with-tabs': hasTabs,
                'modal--relative': relative,
                'modal--small': small
            }"
        >
            <div @click="onBlackoutClick" class="modal__blackout"></div>
            <slot name="container" :close="close">
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
                            <i
                                v-tippy="'Закрыть окно'"
                                @click.prevent="close"
                                class="icon fa-solid fa-xmark"
                            ></i>
                        </div>
                    </div>
                    <div class="modal__body" :class="bodyClass">
                        <div class="container-fluid">
                            <slot :close="close"></slot>
                        </div>
                    </div>
                    <div
                        v-if="$slots.footer || $slots.actions"
                        class="modal__footer"
                        :class="footerClass"
                    >
                        <div class="container-fluid">
                            <slot name="footer" :close="close">
                                <div class="modal__buttons" :class="actionsClass">
                                    <slot name="actions" :close="close" />
                                </div>
                            </slot>
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
import { useModalScrollLock } from '@/composables/useModalScrollLock.js';

const visibleModel = defineModel('visible');
const emit = defineEmits(['close', 'closed']);
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    hasTabs: Boolean,
    relative: Boolean,
    show: Boolean,
    width: {
        type: [Number, String],
        default: null
    },
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
    customClose: Boolean,
    hideHeader: Boolean,
    lockScroll: {
        type: Boolean,
        default: true
    },
    small: Boolean,
    bodyClass: [String, Object, Array],
    footerClass: [String, Object, Array],
    actionsClass: [String, Object, Array]
});

if (props.show) {
    visibleModel.value = true;
}

const minHeightSize = computed(() => props.minHeight + 'px');

// close logic

function close() {
    if (props.customClose) {
        emit('close');

        if (scrollIsLocked.value) {
            unlockScroll();
            scrollIsLocked.value = false;
        }
    } else {
        visibleModel.value = false;
        emit('closed');
    }
}

const canBeClosed = ref(true);

const { start: showCloseErrorAnimation } = useTimeoutFn(() => {
    canBeClosed.value = true;
}, 500);

function onBlackoutClick() {
    if (props.closeOnOutsideClick) close();
    else tryShowCloseErrorAnimation();
}

function tryShowCloseErrorAnimation() {
    if (canBeClosed.value) {
        canBeClosed.value = false;
        showCloseErrorAnimation();
    }
}

// visibility

const { lockScroll: makeScrollLIsLock, unlockScroll } = useModalScrollLock();

const scrollIsLocked = ref(false);

watch(
    visibleModel,
    (value, oldValue) => {
        if (value) {
            document.addEventListener('keydown', escapeHandler, true);

            if (!scrollIsLocked.value && props.lockScroll) {
                makeScrollLIsLock();
                scrollIsLocked.value = true;
            }
        } else if (oldValue) {
            document.removeEventListener('keydown', escapeHandler, true);

            if (scrollIsLocked.value) {
                unlockScroll();
                scrollIsLocked.value = false;
            }
        }
    },
    { immediate: true }
);

function escapeHandler(event) {
    event.stopImmediatePropagation();

    if (event.code === 'Escape') {
        if (props.closeOnPressEsc) close();
        else tryShowCloseErrorAnimation();
    }
}

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
