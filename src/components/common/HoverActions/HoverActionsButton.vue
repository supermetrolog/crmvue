<template>
    <button v-tippy="label" class="hover-actions__button">
        <slot></slot>
    </button>
</template>
<script>
export default {
    name: 'HoverActionsButton',
    props: {
        label: {
            type: String,
            default: null
        }
    }
};
</script>
