<template>
    <Transition name="modal" appear>
        <div
            v-if="visibleModel"
            class="modal active"
            role="dialog"
            :style="{ '--modal-width': width ? width + 'px' : 'auto' }"
            :class="{ 'modal--with-tabs': hasTabs, 'modal--relative': relative }"
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
                    <div v-if="$slots.footer" class="modal__footer">
                        <div class="container-fluid">
                            <div class="modal__buttons">
                                <slot name="footer" :close="close"></slot>
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
    bodyClass: [String, Object, Array]
});

const minHeightSize = computed(() => props.minHeight + 'px');

// close logic

function close() {
    if (props.customClose) {
        emit('close');
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

const alreadyHidden = ref(false);

watch(
    visibleModel,
    value => {
        if (value) {
            document.addEventListener('keydown', escapeHandler, true);

            if (document.body.classList.contains('is-modal')) {
                alreadyHidden.value = true;
                return;
            } else alreadyHidden.value = false;

            document.body.classList.add('is-modal');
        } else {
            document.removeEventListener('keydown', escapeHandler, true);
            if (alreadyHidden.value) return;

            document.body.classList.remove('is-modal');
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
    if (alreadyHidden.value) return;
    document.body.classList.remove('is-modal');
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
