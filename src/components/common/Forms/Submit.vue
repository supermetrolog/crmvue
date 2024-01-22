<template>
    <button class="submit button" :disabled="disabled" :class="buttonClass">
        <slot />
    </button>
</template>

<script>
export default {
    name: 'Submit',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        success: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        buttonClass() {
            return {
                'button--success': this.success
            };
        }
    }
};
</script>

<style></style>
