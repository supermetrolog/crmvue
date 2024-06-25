<template>
    <div class="copy-field">
        <slot />
        <button
            v-tippy="'Нажмите, чтобы скопировать'"
            @click.stop="copy"
            class="copy-field__button"
        >
            <i class="fa-solid fa-copy" />
        </button>
    </div>
</template>
<script>
export default {
    name: 'CopyField',
    props: {
        value: {
            type: [String, Number],
            default: null
        }
    },
    methods: {
        async copy() {
            await navigator.clipboard.writeText(this.value);
            this.$toast('Значение скопировано');
        }
    }
};
</script>
