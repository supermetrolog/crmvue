<template>
    <Transition name="modal" appear>
        <div
            v-if="show"
            class="modal active"
            role="dialog"
            :style="{ '--modal-width': width ? width + 'px' : 'auto' }"
            :class="{ 'modal--with-tabs': hasTabs, 'modal--relative': relative }"
        >
            <div @click="close" class="modal__blackout"></div>
            <div class="modal__container">
                <div class="modal__header">
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
                <div class="modal__body">
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
        </div>
    </Transition>
</template>

<script setup>
import { onBeforeUnmount, shallowRef, watch } from 'vue';

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
    show: Boolean
});

const alreadyHidden = shallowRef(false);

const close = () => emit('close');
const escapeHandler = event => {
    event.stopImmediatePropagation();
    if (event.code === 'Escape') close();
};

watch(
    () => props.show,
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

onBeforeUnmount(() => {
    document.removeEventListener('keydown', escapeHandler, true);
    if (alreadyHidden.value) return;
    document.body.classList.remove('is-modal');
});
</script>
<style>
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
</style>
