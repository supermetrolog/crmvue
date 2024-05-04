<template>
    <div
        ref="modal"
        class="modal active"
        role="dialog"
        :style="{ '--modal-width': width ? width + 'px' : 'auto' }"
        :class="{ 'modal--with-tabs': hasTabs, 'modal--relative': relative }"
    >
        <div @click="clickCancelButton" class="modal__blackout"></div>
        <div class="modal__container">
            <div class="modal__header">
                <p v-if="title">
                    {{ title }}
                </p>
                <slot name="header"></slot>
                <div class="modal__close">
                    <i
                        v-tippy="'Закрыть окно'"
                        @click.prevent="clickCancelButton"
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

<script>
export default {
    name: 'Modal',
    emits: ['close'],
    props: {
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
    },
    data() {
        return {
            alreadyHidden: false
        };
    },
    methods: {
        clickCancelButton() {
            this.$emit('close');
        },
        escapeHandler(event) {
            event.stopImmediatePropagation();
            if (event.code === 'Escape') this.$emit('close');
        }
    },
    mounted() {
        document.addEventListener('keydown', this.escapeHandler, true);
        this.$refs.modal.classList.add('fadein');

        if (document.body.classList.contains('is-modal')) {
            this.alreadyHidden = true;
            return;
        }

        document.body.classList.add('is-modal');
    },
    unmounted() {
        document.removeEventListener('keydown', this.escapeHandler, true);
        if (this.alreadyHidden) return;

        document.body.classList.remove('is-modal');
    }
};
</script>
