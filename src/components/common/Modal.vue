<template>
    <div ref="modal" class="modal active" role="dialog">
        <div @click="clickCancelButton" class="modal__blackout"></div>
        <div class="modal__container">
            <div class="modal__header">
                <p v-if="title">
                    {{ title }}
                </p>
                <slot name="header"></slot>
                <div class="modal__close">
                    <i @click.prevent="clickCancelButton" class="icon fa-solid fa-xmark"></i>
                </div>
            </div>
            <div class="modal__body">
                <div class="container-fluid">
                    <slot></slot>
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
            if (event.code === 'Escape') this.$emit('close');
        }
    },
    mounted() {
        if (document.body.style.overflow === 'hidden') {
            this.alreadyHidden = true;
            return;
        }

        document.body.classList.add('is-modal');
        document.addEventListener('keydown', this.escapeHandler);

        this.$refs.modal.classList.add('fadein');
    },
    unmounted() {
        if (this.alreadyHidden) return;

        document.removeEventListener('keydown', this.escapeHandler);
        document.body.classList.remove('is-modal');
    }
};
</script>

<style></style>
