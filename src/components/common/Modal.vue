<template>
    <div class="modal active" role="dialog">
        <div class="modal__blackout" @click="clickCancelButton"></div>
        <div class="modal__container">
            <div class="modal__header">
                <p v-if="title">
                    {{ title }}
                </p>
                <slot name="header"></slot>
                <div class="modal__close">
                    <i class="icon fa-solid fa-xmark" @click.prevent="clickCancelButton"></i>
                </div>
            </div>
            <div class="modal__body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Modal",
    emits: ['close'],
    data() {
        return {
            alreadyHidden: false,
        };
    },
    props: {
        title: {
            type: String
        }
    },
    methods: {
        clickCancelButton() {
            this.$emit("close");
        },
        escapeHandler(event) {
            if (event.code === 'Escape') this.$emit('close');
        }
    },
    mounted() {
        if (document.body.style.overflow === "hidden") {
            this.alreadyHidden = true;
            return;
        }

        document.body.style.overflow = "hidden";
        document.addEventListener('keydown', this.escapeHandler);
    },
    unmounted() {
        if (this.alreadyHidden) return;

        document.removeEventListener('keydown', this.escapeHandler);
        document.body.style.overflow = null;
    }
};
</script>

<style>
</style>