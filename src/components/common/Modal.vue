<template>
    <div
        ref="modal"
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
</template>

<script setup>
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';

const emit = defineEmits(['close']);
defineProps({
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
    }
});

const alreadyHidden = shallowRef(false);
const modal = ref(null);

const close = () => emit('close');
const escapeHandler = event => {
    event.stopImmediatePropagation();
    if (event.code === 'Escape') close();
};

onMounted(() => {
    document.addEventListener('keydown', escapeHandler, true);
    modal.value.classList.add('fadein');

    if (document.body.classList.contains('is-modal')) {
        alreadyHidden.value = true;
        return;
    }

    document.body.classList.add('is-modal');
});

onUnmounted(() => {
    document.removeEventListener('keydown', escapeHandler, true);
    if (alreadyHidden.value) return;

    document.body.classList.remove('is-modal');
});
</script>
