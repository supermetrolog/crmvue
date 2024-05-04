<template>
    <button class="messenger-button" :class="colorClass">
        <slot></slot>
    </button>
</template>
<script>
export default {
    name: 'MessengerButton',
    props: {
        color: {
            type: String,
            default: null
        }
    },
    computed: {
        colorClass() {
            return this.color ? `bg-btn--${this.color}` : null;
        }
    }
};
</script>
