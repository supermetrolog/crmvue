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
            <AnimationTransition :speed="0.4">
                <div v-if="pinnedTask && !pinnedTaskIsHidden" class="modal__pinned-task">
                    <UiModalPinnedTask @hide="pinnedTaskIsHidden = true" :task="pinnedTask" />
                </div>
            </AnimationTransition>
            <slot name="container" :close="close">
                <div
                    class="modal__container animate__animated"
                    :class="{
                        animate__headShake: !localeCanBeClosed
                    }"
                    v-bind="containerAttrs"
                >
                    <div v-if="!hideHeader" class="modal__header">
                        <p v-if="title">
                            {{ title }}
                        </p>
                        <slot name="header"></slot>
                        <div class="modal__close" :class="{ disabled: !canBeClosed }">
                            <slot name="header-actions" />
                            <UiTooltipIcon
                                v-if="canBeClosed"
                                @click.prevent="close"
                                icon="fa-solid fa-xmark"
                                class="icon"
                                tooltip="Закрыть окно"
                            />
                        </div>
                    </div>
                    <slot name="before-body" />
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
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import UiModalPinnedTask from '@/components/common/UI/UiModalPinnedTask.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const visibleModel = defineModel('visible');
const emit = defineEmits(['close', 'closed']);
const props = defineProps({
    title: String,
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
    canBeClosed: {
        type: Boolean,
        default: true
    },
    hideHeader: Boolean,
    lockScroll: {
        type: Boolean,
        default: true
    },
    small: Boolean,
    bodyClass: [String, Object, Array],
    footerClass: [String, Object, Array],
    actionsClass: [String, Object, Array],
    escClose: {
        type: Boolean,
        default: true
    },
    pinnedTask: Object,
    containerAttrs: Object
});

if (props.show) {
    visibleModel.value = true;
}

const minHeightSize = computed(() => props.minHeight + 'px');

// close logic

function close() {
    if (!props.canBeClosed) return;

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

defineExpose({ close });

const localeCanBeClosed = ref(true);

const { start: showCloseErrorAnimation } = useTimeoutFn(() => {
    localeCanBeClosed.value = true;
}, 500);

function onBlackoutClick() {
    if (props.closeOnOutsideClick) close();
    else tryShowCloseErrorAnimation();
}

function tryShowCloseErrorAnimation() {
    if (localeCanBeClosed.value) {
        localeCanBeClosed.value = false;
        showCloseErrorAnimation();
    }
}

// pinned

const pinnedTaskIsHidden = ref(false);

// visibility

const { lockScroll: makeScrollLIsLock, unlockScroll } = useModalScrollLock();

const scrollIsLocked = ref(false);

watch(
    visibleModel,
    (value, oldValue) => {
        if (value) {
            if (props.escClose) document.addEventListener('keydown', escapeHandler, true);

            if (!scrollIsLocked.value && props.lockScroll) {
                makeScrollLIsLock();
                scrollIsLocked.value = true;
            }
        } else if (oldValue) {
            if (props.escClose) document.removeEventListener('keydown', escapeHandler, true);

            if (scrollIsLocked.value) {
                unlockScroll();
                scrollIsLocked.value = false;
            }
        }

        pinnedTaskIsHidden.value = false;
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
    if (props.escClose) document.removeEventListener('keydown', escapeHandler, true);
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

.modal-enter-from .modal__container {
    transform: scale(1.1);
}

.modal-leave-to .modal__container,
.modal-leave-to .modal__pinned-task {
    transform: scale(0.9);
}

.modal-enter-from .modal__pinned-task {
    transform: scale(1.1) translateY(-10px);
}

.modal {
    --modal-body-min-height: v-bind(minHeightSize);
}

.modal__blackout {
    background-color: rgba(0, 0, 0, v-bind(blackoutOpacity));
}
</style>
